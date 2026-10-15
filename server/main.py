import os
import io
import gc
import asyncio
from typing import Dict, Any

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

import torch
from torch import nn
from torchvision import transforms
import uvicorn


# ==============================================================================
# Configuration & Device
# ==============================================================================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = "best_catdog_model.pth"

# Check server directory first, fallback to client directory if needed
MODEL_PATH = os.path.join(BASE_DIR, MODEL_FILENAME)
if not os.path.exists(MODEL_PATH):
    fallback_path = os.path.join(BASE_DIR, "..", "client", MODEL_FILENAME)
    if os.path.exists(fallback_path):
        MODEL_PATH = fallback_path

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
CONFIDENCE_THRESHOLD = 0.60       # 60% confidence guardrail
CLASSES = ["Cat", "Dog"]

# Semaphore to prevent RAM/CPU exhaustion under concurrent requests
inference_semaphore = asyncio.Semaphore(4)


# ==============================================================================
# PyTorch Model Architecture (Matches best_catdog_model.pth)
# ==============================================================================
class CatDogCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(128, 256, 3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(256, 512, 3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.AdaptiveAvgPool2d(1)
        )

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x


# ==============================================================================
# Model Initialization & Checkpoint Loading
# ==============================================================================
model = CatDogCNN().to(device)

if os.path.exists(MODEL_PATH):
    print(f"Loading weights from {MODEL_PATH} on {device}...")
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
    else:
        model.load_state_dict(checkpoint)
    model.eval()
    for param in model.parameters():
        param.requires_grad_(False)
    del checkpoint
    gc.collect()
    print("Model loaded successfully.")
else:
    print(f"WARNING: Model file not found at {MODEL_PATH}. Prediction endpoint will return 503 until model is present.")


# ==============================================================================
# Image Preprocessing Transform
# ==============================================================================
# Resize to 224x224, convert to Tensor, and apply standard ImageNet normalization
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==============================================================================
# FastAPI App & Robust CORS Setup
# ==============================================================================
app = FastAPI(
    title="petSnap.ai Image Classification API",
    description="FastAPI service serving PyTorch Cat vs Dog CNN classifier",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# Routes
# ==============================================================================
@app.get("/")
def root() -> Dict[str, str]:
    return {
        "status": "online",
        "service": "petSnap.ai Classification API",
        "device": str(device)
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "device": str(device),
        "model_loaded": os.path.exists(MODEL_PATH)
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Accepts an uploaded image file, processes it, and returns the predicted class
    ('Cat' or 'Dog') with confidence score as a percentage.
    """
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(
            status_code=503,
            detail=f"Model file not found on server ({MODEL_FILENAME})."
        )

    # 1. Validate file extension / MIME type if provided
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a JPEG, PNG, or WebP image."
        )

    # 2. Read and validate payload size
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 10 MB limit."
        )

    # 3. Decode image and convert to RGB
    try:
        image = Image.open(io.BytesIO(contents))
        image.load()
        image = image.convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file.")
    finally:
        try:
            await file.close()
        except Exception:
            pass

    # 4. Transform image and run inference
    try:
        tensor = transform(image).unsqueeze(0).to(device)

        async with inference_semaphore:
            with torch.inference_mode():
                logits = model(tensor)
                probs = torch.softmax(logits, dim=1)[0]

                cat_prob = probs[0].item()
                dog_prob = probs[1].item()

        # 5. Extract prediction and confidence percentage
        pred_idx = torch.argmax(probs).item()
        raw_prediction = CLASSES[pred_idx]
        max_prob = max(cat_prob, dog_prob)
        confidence_pct = round(max_prob * 100.0, 2)

        # Confidence threshold guardrail check (flag non-pet/ambiguous images if < 60%)
        if max_prob < CONFIDENCE_THRESHOLD:
            final_class = "Not a dog/cat"
        else:
            final_class = raw_prediction

        return {
            "class": final_class,
            "prediction": final_class,
            "raw_class": raw_prediction,
            "confidence": confidence_pct,
            "confidence_score": f"{confidence_pct}%",
            "probability": round(max_prob, 4),
            "cat_probability": round(cat_prob, 4),
            "dog_probability": round(dog_prob, 4),
            "is_confident": max_prob >= CONFIDENCE_THRESHOLD,
            "threshold": CONFIDENCE_THRESHOLD
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
    finally:
        # Free tensor memory
        del tensor
        del image
        gc.collect()


# ==============================================================================
# Direct Execution Entry Point
# ==============================================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

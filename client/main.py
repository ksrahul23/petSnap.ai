
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image, UnidentifiedImageError
import io
import os
import gc
import asyncio

import torch
from torch import nn
from torchvision import transforms
import uvicorn

 
# CONFIGURATION 

device = torch.device("cpu")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "best_catdog_model.pth"
)

# Maximum uploaded file size: 5 MB
MAX_FILE_SIZE = 5 * 1024 * 1024

# Maximum number of simultaneous model inferences
# This helps prevent RAM exhaustion during traffic spikes.
inference_semaphore = asyncio.Semaphore(2)


print("========================================")
print("petsnap.ai API")
print("========================================")
print("Current Directory:", os.getcwd())
print("Model Path:", MODEL_PATH)
print("Using Device:", device)
print("========================================")

 
# MODEL 

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

 
# LOAD MODEL 

print("Loading model...")

model = CatDogCNN().to(device)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )


checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)

print("Checkpoint Keys:", checkpoint.keys())
print("Epoch:", checkpoint.get("epoch", "Unknown"))
print("Val Acc:", checkpoint.get("val_acc", "Unknown"))


model.load_state_dict(
    checkpoint["model_state_dict"]
)

# Evaluation mode
model.eval()

# Disable gradients permanently.
# We only perform inference.
for param in model.parameters():
    param.requires_grad_(False)


# Delete checkpoint from memory after loading.
del checkpoint

gc.collect()


print("Model Loaded Successfully")

 
# IMAGE TRANSFORM 

transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[
            0.485,
            0.456,
            0.406
        ],
        std=[
            0.229,
            0.224,
            0.225
        ]
    )
])

 
# FASTAPI 

app = FastAPI(
    title="petsnap.ai Classifier",
    version="1.0"
)

 
# CORS 

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

 
# HOME 

@app.get("/")
def home():
    return {
        "message": "petsnap.ai API Running"
    }

 
# HEALTH CHECK 

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "device": str(device)
    }

 
# PREDICT 

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    image = None
    image_tensor = None
    image_bytes = None

    try:

        # =================================================
        # VALIDATE FILE TYPE
        # =================================================

        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp"
        }

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Only JPEG, PNG and WEBP "
                    "images are supported."
                )
            )


        # =================================================
        # READ FILE
        # =================================================

        image_bytes = await file.read()

        print("\n========== NEW REQUEST ==========")

        print(
            "Filename:",
            file.filename
        )

        print(
            "Content Type:",
            file.content_type
        )

        print(
            "Bytes Received:",
            len(image_bytes)
        )


        # =================================================
        # FILE SIZE LIMIT
        # =================================================

        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=(
                    "Image is too large. "
                    "Maximum size is 5 MB."
                )
            )


        # =================================================
        # OPEN IMAGE
        # =================================================

        try:

            image = Image.open(
                io.BytesIO(image_bytes)
            )

            # Force image decoding.
            image.load()

            # Convert to RGB.
            image = image.convert("RGB")

        except (
            UnidentifiedImageError,
            OSError
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid image file."
            )


        print(
            "Image Size:",
            image.size
        )


        # =================================================
        # TRANSFORM IMAGE
        # =================================================

        image_tensor = transform(image)

        print(
            "Tensor Stats:",
            image_tensor.min().item(),
            image_tensor.max().item(),
            image_tensor.mean().item()
        )


        # Add batch dimension.
        image_tensor = image_tensor.unsqueeze(0)


        # =================================================
        # MODEL INFERENCE
        # =================================================
        #
        # Only 2 predictions can run simultaneously.
        # This protects RAM during traffic spikes.
        #

        async with inference_semaphore:

            with torch.inference_mode():

                logits = model(
                    image_tensor
                )

                probs = torch.softmax(
                    logits,
                    dim=1
                )


                # Convert immediately to Python floats.
                cat_prob = probs[0, 0].item()

                dog_prob = probs[0, 1].item()


        # =================================================
        # CONFIDENCE THRESHOLD & PREDICTION
        # =================================================
        # If the model's highest probability score falls below 60%,
        # classify as "Not a dog/cat" instead of defaulting.

        CONFIDENCE_THRESHOLD = 0.60
        max_prob = max(cat_prob, dog_prob)

        if max_prob < CONFIDENCE_THRESHOLD:
            prediction = "Not a dog/cat"
        elif cat_prob > dog_prob:
            prediction = "Cat"
        else:
            prediction = "Dog"

        confidence = max_prob

        print(
            f"Cat Probability: "
            f"{cat_prob:.4f}"
        )

        print(
            f"Dog Probability: "
            f"{dog_prob:.4f}"
        )

        print(
            f"Prediction: "
            f"{prediction} (Confidence: {confidence:.4f})"
        )


        # =================================================
        # RESPONSE
        # =================================================

        return {
            "prediction": prediction,
            "probability": confidence,
            "cat_probability": cat_prob,
            "dog_probability": dog_prob,
            "threshold": CONFIDENCE_THRESHOLD,
            "is_confident": max_prob >= CONFIDENCE_THRESHOLD
        }


    # =====================================================
    # HTTP ERRORS
    # =====================================================

    except HTTPException:
        raise


    # =====================================================
    # UNEXPECTED ERRORS
    # =====================================================

    except Exception as e:

        print(
            "ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Prediction failed."
        )


    # =====================================================
    # CLEANUP
    # =====================================================

    finally:

        image_tensor = None
        image = None
        image_bytes = None

        try:
            await file.close()

        except Exception:
            pass

        # Clean unused Python/PIL objects.
        gc.collect()

 
# LOCAL DEVELOPMENT 

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            8000
        )
    )

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )
 

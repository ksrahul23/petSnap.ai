import os
import io
import gc
import asyncio
from typing import Dict, Any

import numpy as np
from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime
import uvicorn


# ==============================================================================
# Configuration & Constants
# ==============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = "best_catdog_model.onnx"

# Locate ONNX model in server folder or current working directory
MODEL_PATH = MODEL_FILENAME
if not os.path.exists(MODEL_PATH):
    candidate_path = os.path.join(BASE_DIR, MODEL_FILENAME)
    if os.path.exists(candidate_path):
        MODEL_PATH = candidate_path

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
CONFIDENCE_THRESHOLD = 0.60       # 60% confidence guardrail
CLASSES = ["Cat", "Dog"]

# Standard ImageNet normalization parameters
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

# Semaphore to prevent RAM/CPU exhaustion under concurrent requests
inference_semaphore = asyncio.Semaphore(4)


# ==============================================================================
# Model Loading (ONNX Runtime)
# ==============================================================================
print(f"Loading ONNX model from {MODEL_PATH}...")
try:
    session = onnxruntime.InferenceSession(
        MODEL_PATH,
        providers=["CPUExecutionProvider"]
    )
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    print(f"Model successfully loaded. Input: '{input_name}', Output: '{output_name}'")
except Exception as e:
    session = None
    input_name = None
    output_name = None
    print(f"WARNING: Failed to initialize ONNX session with {MODEL_PATH}: {e}")


# ==============================================================================
# Preprocessing & Math Helpers
# ==============================================================================
def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess PIL Image using NumPy:
    - Convert to RGB
    - Resize to 224x224 (Bilinear)
    - Scale pixel values to [0.0, 1.0]
    - Apply ImageNet mean and std normalization
    - Transpose from (H, W, C) to (C, H, W)
    - Add batch dimension -> shape (1, C, H, W)
    - Ensure float32 dtype
    """
    # 1. Convert to RGB
    image = image.convert("RGB")

    # 2. Resize to 224x224
    image = image.resize((224, 224), Image.Resampling.BILINEAR)

    # 3. Convert to float32 NumPy array and scale to [0, 1]
    img_array = np.array(image, dtype=np.float32) / 255.0

    # 4. Standard ImageNet normalization: (x - mean) / std
    img_array = (img_array - IMAGENET_MEAN) / IMAGENET_STD

    # 5. Transpose from (H, W, C) to (C, H, W)
    img_array = img_array.transpose(2, 0, 1)

    # 6. Add batch dimension -> (1, 3, 224, 224)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array.astype(np.float32)


def softmax(x: np.ndarray, axis: int = -1) -> np.ndarray:
    """
    Numerically stable Softmax function using NumPy.
    """
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / np.sum(e_x, axis=axis, keepdims=True)


# ==============================================================================
# FastAPI App & CORS Setup
# ==============================================================================
app = FastAPI(
    title="petSnap.ai Image Classification API",
    description="FastAPI service serving ONNX Runtime Cat vs Dog CNN classifier",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pet-snap-ai.vercel.app",
        "http://localhost:5173",           # Local Vite development
        "http://127.0.0.1:5173",
        "*",                               # Fallback
    ],
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
        "runtime": "ONNX Runtime (CPU)"
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "runtime": "ONNX Runtime (CPU)",
        "model_loaded": session is not None
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Accepts an uploaded image file, preprocesses it, runs ONNX inference,
    computes probabilities via Softmax, and returns classification results.
    """
    if session is None:
        raise HTTPException(
            status_code=503,
            detail=f"Model file not loaded on server ({MODEL_FILENAME})."
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
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file.")
    finally:
        try:
            await file.close()
        except Exception:
            pass

    # 4. Preprocess image and execute ONNX inference
    input_tensor = None
    try:
        input_tensor = preprocess_image(image)

        async with inference_semaphore:
            outputs = session.run([output_name], {input_name: input_tensor})
            logits = outputs[0][0]  # shape (2,)
            probs = softmax(logits)

            cat_prob = float(probs[0])
            dog_prob = float(probs[1])

        # 5. Extract prediction and confidence percentage
        pred_idx = int(np.argmax(probs))
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
        # Safe memory cleanup
        if input_tensor is not None:
            del input_tensor
        if "image" in locals() and image is not None:
            del image
        if "contents" in locals() and contents is not None:
            del contents
        gc.collect()


# ==============================================================================
# Direct Execution Entry Point
# ==============================================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

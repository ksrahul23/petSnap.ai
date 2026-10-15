#  petsnap.ai

An intelligent, full-stack pet image classification application built with **FastAPI**, **ONNX Runtime**, **PyTorch**, and **React**. `petsnap.ai` predicts whether an uploaded photo is a **Cat** or a **Dog**, and incorporates an active **60% confidence threshold guardrail** to identify non-pet or uncertain images as **"Not a dog/cat"** instead of forcing a false label.

---

##  What This Project Does

- **Accurate Species Prediction**: Classifies images as Cat or Dog using a custom 5-layer Convolutional Neural Network (CNN).
- **Non-Pet Guardrail**: Rejects arbitrary or ambiguous images when confidence is below 60%, returning `"Not a dog/cat"`.
- **Low-Memory Production Backend**: Model deployed via **ONNX Runtime** (~40MB RAM usage) to comfortably run on Render's 512MB free tier without OOM issues.
- **Modern Web App**: Fast, responsive React frontend with interactive drag-and-drop upload, and instant probability visualizer.
- **Team Dog vs Team Cat Trivia**: Standalone interactive showcase with fun trivia below the upload center.
- **Model Diagnostics**: Real-time display of accuracy (89.58%), precision, recall, F1-score, and confusion matrix.
- **Dedicated Info Page**: Interactive breakdown explaining how computer vision and the neural network pipeline work.

>  **Deep Dive:** For a comprehensive technical breakdown of network layers and Mermaid architecture diagrams, see [MODEL_EXPLANATION.md](./MODEL_EXPLANATION.md).

---

##  Tech Stack

- **Machine Learning & Backend**: Python 3.10+, ONNX Runtime, FastAPI, Uvicorn, Pillow, NumPy (PyTorch for CNN training)
- **Frontend**: React 19, Vite, Tailwind CSS

---

##  Installation

### 1. Clone Repository
```bash
git clone https://github.com/ksrahul23/CatAndDogClassification.git
cd CatAndDogClassification
```

### 2. Backend Setup
```bash
cd server
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS / Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../catdog
npm install
```

---

##  How to Run

### Start Backend API
From the `server` directory:
```bash
uvicorn main:app --reload --port 8000
```
*API will run at `http://localhost:8000` (docs available at `http://localhost:8000/docs`).*

### Start Frontend UI
From the `catdog` directory:
```bash
npm run dev
```
*Open your browser at `http://localhost:5173` to access petsnap.ai.*

---

##  Model Conversion (Optional)
To regenerate `server/best_catdog_model.onnx` from original PyTorch weights `best_catdog_model.pth`:
```bash
python convert_to_onnx.py
```

---

##  Author

- **Rahul Kumar**
- **GitHub**: [https://github.com/ksrahul23](https://github.com/ksrahul23)

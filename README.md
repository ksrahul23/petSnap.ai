# 🐾 petsnap.ai

An intelligent, full-stack pet image classification application built with **PyTorch**, **FastAPI**, and **React**. `petsnap.ai` predicts whether an uploaded photo is a **Cat** or a **Dog**, and incorporates an active **60% confidence threshold guardrail** to identify non-pet or uncertain images as **"Not a dog/cat"** instead of forcing a false label.

---

## 🌟 What This Project Does

- **Accurate Species Prediction**: Classifies images as Cat or Dog using a custom 5-layer Convolutional Neural Network (CNN).
- **Non-Pet Guardrail**: Rejects arbitrary or ambiguous images when confidence is below 60%, returning `"Not a dog/cat"`.
- **Modern Neobrutal Web App**: Fast, responsive React frontend with `#fdf6e3` golden white palette, interactive drag-and-drop upload, and instant probability visualizer.
- **Team Dog vs Team Cat Trivia**: Standalone interactive showcase with fun trivia below the upload center.
- **Model Diagnostics**: Real-time display of accuracy (89.58%), precision, recall, F1-score, and confusion matrix.
- **Dedicated Info Page**: Interactive breakdown explaining how computer vision and the neural network pipeline work.

> 📖 **Deep Dive:** For a comprehensive technical breakdown of network layers and Mermaid architecture diagrams, see [MODEL_EXPLANATION.md](./MODEL_EXPLANATION.md).

---

## 🛠️ Tech Stack

- **Machine Learning & Backend**: Python 3.10+, PyTorch, Torchvision, FastAPI, Uvicorn, Pillow
- **Frontend**: React 19, Vite, Tailwind CSS

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/ksrahul23/CatAndDogClassification.git
cd CatAndDogClassification
```

### 2. Backend Setup
```bash
cd client
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

## 🚀 How to Run

### Start Backend API
From the `client` directory:
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

## 👤 Author

- **Rahul Kumar**
- **GitHub**: [https://github.com/ksrahul23](https://github.com/ksrahul23)

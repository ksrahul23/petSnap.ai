import os
import sys

# Ensure UTF-8 output encoding across Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import torch
import torch.nn as nn
import numpy as np

# ==============================================================================
# PyTorch Model Architecture (Matches CatDogCNN from training checkpoint)
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


def locate_file(filename: str, search_dirs: list) -> str:
    for d in search_dirs:
        candidate = os.path.join(d, filename)
        if os.path.exists(candidate):
            return os.path.abspath(candidate)
    return ""


def convert_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cwd = os.getcwd()

    # Search candidates for the source weights
    search_dirs = [
        os.path.join(script_dir, "server"),
        os.path.join(script_dir, "client"),
        script_dir,
        os.path.join(cwd, "server"),
        os.path.join(cwd, "client"),
        cwd,
    ]
    weights_path = locate_file("best_catdog_model.pth", search_dirs)

    if not weights_path:
        print("ERROR: Could not locate 'best_catdog_model.pth' in any expected directory.")
        sys.exit(1)

    print(f"[*] Found PyTorch weights at: {weights_path}")

    # Determine destination ONNX path (inside server directory)
    server_dir = os.path.join(script_dir, "server")
    if not os.path.isdir(server_dir):
        server_dir = os.path.join(cwd, "server")
    os.makedirs(server_dir, exist_ok=True)

    output_path = os.path.join(server_dir, "best_catdog_model.onnx")

    # 1. Instantiate exact architecture
    print("[*] Instantiating CatDogCNN architecture...")
    model = CatDogCNN()

    # 2. Load trained PyTorch checkpoint
    print(f"[*] Loading checkpoint weights from {weights_path}...")
    checkpoint = torch.load(weights_path, map_location="cpu")
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
    else:
        model.load_state_dict(checkpoint)

    model.eval()
    for param in model.parameters():
        param.requires_grad_(False)

    # 3. Create dummy input tensor of shape (1, 3, 224, 224)
    dummy_input = torch.randn(1, 3, 224, 224, dtype=torch.float32)

    # 4. Export to ONNX
    print(f"[*] Exporting model to ONNX format at: {output_path}...")
    export_kwargs = {
        "export_params": True,
        "opset_version": 14,
        "do_constant_folding": True,
        "input_names": ["input"],
        "output_names": ["output"],
        "dynamic_axes": {
            "input": {0: "batch_size"},
            "output": {0: "batch_size"}
        }
    }

    try:
        torch.onnx.export(model, dummy_input, output_path, dynamo=False, **export_kwargs)
    except TypeError:
        torch.onnx.export(model, dummy_input, output_path, **export_kwargs)

    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"[+] Successfully exported ONNX model! File size: {file_size_mb:.2f} MB")

    # 5. Numerical verification
    try:
        import onnx
        import onnxruntime as ort

        print("[*] Validating exported ONNX model structure...")
        onnx_model = onnx.load(output_path)
        onnx.checker.check_model(onnx_model)
        print("[+] ONNX model check passed!")

        print("[*] Verifying numerical parity with ONNX Runtime...")
        with torch.no_grad():
            torch_output = model(dummy_input).numpy()

        session = ort.InferenceSession(output_path, providers=["CPUExecutionProvider"])
        ort_inputs = {session.get_inputs()[0].name: dummy_input.numpy()}
        ort_output = session.run(None, ort_inputs)[0]

        diff = np.max(np.abs(torch_output - ort_output))
        print(f"[*] Max absolute difference: {diff:.6e}")
        np.testing.assert_allclose(torch_output, ort_output, rtol=1e-3, atol=1e-4)
        print("[+] SUCCESS: ONNX Runtime output matches PyTorch output!")

    except ImportError:
        print("[!] Note: Install 'onnx' and 'onnxruntime' for verification step.")
    except Exception as e:
        print(f"[!] Verification warning: {e}")


if __name__ == "__main__":
    convert_model()

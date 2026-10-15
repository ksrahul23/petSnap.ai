import { useState } from "react";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import Facts from "./Facts.jsx";
import ConfusionMatrix from "./ConfusionMatrix.jsx";
import MetricCards from "./MetricCards.jsx";

const Predict = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const metrics = {
        accuracy: 0.8958,
        precision: 0.8709,
        recall: 0.9279,
        f1_score: 0.8985,
    };

    const confusionMatrix = [
        [522, 82],
        [43, 553]
    ];

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setPrediction(null);
        setErrorMessage("");
    };

    const predict = async () => {
        if (!file) {
            alert("Please select an image");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const formData = new FormData();
            formData.append("file", file);

            // Try local server first if available, then fallback to remote render API
            const primaryUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/predict";
            const fallbackUrl = "https://catanddogclassification-1.onrender.com/predict";

            let response;
            try {
                response = await fetch(primaryUrl, {
                    method: "POST",
                    body: formData,
                });
            } catch (localErr) {
                // If local server is not running and primary was local, try fallback
                if (primaryUrl !== fallbackUrl) {
                    response = await fetch(fallbackUrl, {
                        method: "POST",
                        body: formData,
                    });
                } else {
                    throw localErr;
                }
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                setErrorMessage(data.error);
                return;
            }

            // Confidence threshold check (Requirement 5)
            // If the model's highest probability score falls below 60%,
            // display "Not a dog/cat" instead of defaulting to nearest class.
            const CONFIDENCE_THRESHOLD = 0.60;
            const confidence = data.probability ?? Math.max(data.cat_probability || 0, data.dog_probability || 0);

            let finalPrediction = data.prediction;
            if (confidence < CONFIDENCE_THRESHOLD || data.prediction === "Not a dog/cat") {
                finalPrediction = "Not a dog/cat";
            }

            setPrediction({
                ...data,
                prediction: finalPrediction,
                probability: confidence
            });
        } catch (err) {
            console.error(err);
            setErrorMessage("Prediction failed. Please ensure the backend is running or check internet connectivity.");
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setFile(null);
        setPrediction(null);
        setPreview(null);
        setErrorMessage("");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            {/* Main Upload Center */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Left Column: Upload Controls Card */}
                <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 sm:p-7 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl sm:text-3xl font-black">
                                Upload Pet Image
                            </h2>
                            <span className="bg-yellow-200 border-2 border-black rounded-xl px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_#000]">
                                Step 1
                            </span>
                        </div>

                        <p className="text-sm font-bold text-zinc-600 mb-6">
                            Select or drop a photo of a dog or cat. Non-pet or ambiguous images will be flagged by our 60% confidence guardrail.
                        </p>

                        {/* Drop / Select Area */}
                        <label className="border-4 border-dashed border-black rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-[#fdf6e3] hover:bg-amber-100 transition group mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-white border-3 border-black flex items-center justify-center text-3xl mb-3 shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
                                📷
                            </div>
                            <span className="font-black text-base sm:text-lg text-black">
                                {file ? file.name : "Click to Browse or Drop Photo"}
                            </span>
                            <span className="text-xs font-bold text-zinc-500 mt-1">
                                Supports JPG, PNG, WebP (Max 5MB)
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>

                        {errorMessage && (
                            <div className="bg-rose-100 border-3 border-black rounded-2xl p-3 mb-4 text-xs sm:text-sm font-bold text-rose-800 shadow-[3px_3px_0px_#000]">
                                ⚠️ {errorMessage}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap items-center pt-2">
                        <label className="cursor-pointer bg-white border-3 border-black rounded-xl px-4 py-2.5 font-black text-sm shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2">
                            <span>📂</span>
                            <span>{file ? "Change File" : "Choose File"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>

                        {file && (
                            <Button 
                                onClick={predict} 
                                disabled={loading}
                                className="bg-amber-300!"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin text-lg">⚙️</span>
                                        <span>Analyzing...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>🚀</span>
                                        <span>Classify Pet</span>
                                    </span>
                                )}
                            </Button>
                        )}

                        {(file || prediction) && (
                            <button
                                onClick={clearAll}
                                className="h-11 px-3.5 bg-rose-100 border-3 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Clear all"
                            >
                                <img
                                    src="/cross.png"
                                    alt="clear"
                                    className="w-3.5 h-3.5"
                                />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Prediction Result OR Preview Placeholder */}
                <div className="flex items-center justify-center">
                    {prediction ? (
                        <Card
                            prob={prediction.probability}
                            preview={preview}
                            specie={prediction.prediction}
                            catProb={prediction.cat_probability}
                            dogProb={prediction.dog_probability}
                        />
                    ) : file ? (
                        <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 text-center w-full max-w-md">
                            <span className="text-xs font-black uppercase tracking-wider bg-yellow-100 border-2 border-black rounded-xl px-3 py-1 shadow-[2px_2px_0px_#000]">
                                Ready to Classify
                            </span>
                            <div className="w-52 h-52 mx-auto overflow-hidden rounded-2xl border-4 border-black bg-zinc-50 flex items-center justify-center shadow-[4px_4px_0px_#000] my-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-sm font-bold text-zinc-700">
                                Click &quot;Classify Pet&quot; on the left to run deep learning inference.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-8 text-center w-full max-w-md">
                            <div className="w-20 h-20 rounded-3xl bg-yellow-100 border-3 border-black mx-auto flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000] mb-4">
                                🐾
                            </div>
                            <h3 className="text-2xl font-black mb-2">
                                Result Center
                            </h3>
                            <p className="text-sm font-bold text-zinc-600 leading-relaxed">
                                Upload a picture of a cat or dog to see prediction probabilities, species classification, and certainty metrics.
                            </p>
                            <div className="mt-5 p-3 bg-[#fdf6e3] border-2 border-black rounded-2xl text-xs font-bold text-zinc-700">
                                🛡️ Smart Guardrail: If confidence is below 60%, the classifier flags it as &quot;Not a dog/cat&quot;.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DISTINCT SECTION BELOW UPLOAD CENTER: Team Dog vs Team Cat */}
            <div className="mt-10">
                <Facts />
            </div>

            {/* Model Performance Metrics */}
            <div className="mt-6">
                <MetricCards metrics={metrics} />
            </div>

            {/* Confusion Matrix */}
            <div className="mt-6">
                <ConfusionMatrix matrix={confusionMatrix} />
            </div>
        </div>
    );
};

export default Predict;
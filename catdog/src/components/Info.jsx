import Button from "./Button.jsx";

const Info = ({ onGoToClassifier }) => {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
            {/* Page Header */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 sm:p-8 text-center">
                <div className="inline-block bg-amber-200 border-2 border-black rounded-full px-4 py-1 text-xs sm:text-sm font-black mb-3 shadow-[2px_2px_0px_#000]">
                    💡 Under the Hood
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
                    How petsnap.ai Works
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 font-bold max-w-2xl mx-auto mt-3">
                    A simple guide to how our deep learning neural network sees, processes, and classifies pet photos.
                </p>
                <div className="mt-5">
                    <Button onClick={onGoToClassifier}>
                        Try Classifier Now &rarr;
                    </Button>
                </div>
            </div>

            {/* Architecture Diagram Section */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4 mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black">
                            📐 Simple Architecture Diagram
                        </h2>
                        <p className="text-sm sm:text-base font-semibold text-zinc-600 mt-1">
                            End-to-end data flow: from raw image upload to intelligent thresholded decision
                        </p>
                    </div>
                    <span className="bg-yellow-100 border-2 border-black rounded-xl px-3 py-1 font-bold text-xs self-start sm:self-auto shadow-[2px_2px_0px_#000]">
                        Image Flow Pipeline
                    </span>
                </div>

                {/* Visual Pipeline Flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Node 1 */}
                    <div className="bg-amber-100 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-center flex flex-col justify-between h-full">
                        <div className="text-3xl mb-1">📸</div>
                        <h4 className="font-black text-sm uppercase">1. Raw Image</h4>
                        <p className="text-xs font-bold text-zinc-600 mt-1">
                            JPG / PNG / WebP uploaded by user
                        </p>
                        <div className="mt-2 text-[11px] font-mono bg-white border border-black rounded-lg py-1 px-2">
                            Any size &rarr; 224&times;224 RGB
                        </div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="hidden md:flex justify-center text-2xl font-black text-black">
                        &rarr;
                    </div>

                    {/* Node 2 */}
                    <div className="bg-blue-100 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-center flex flex-col justify-between h-full">
                        <div className="text-3xl mb-1">🔍</div>
                        <h4 className="font-black text-sm uppercase">2. CNN Feature Extraction</h4>
                        <p className="text-xs font-bold text-zinc-600 mt-1">
                            5 Conv2D + BatchNorm + ReLU + MaxPool layers
                        </p>
                        <div className="mt-2 text-[11px] font-mono bg-white border border-black rounded-lg py-1 px-2">
                            Filters: 32 &rarr; 64 &rarr; 128 &rarr; 256 &rarr; 512
                        </div>
                    </div>

                    {/* Arrow 2 */}
                    <div className="hidden md:flex justify-center text-2xl font-black text-black">
                        &rarr;
                    </div>

                    {/* Node 3 */}
                    <div className="bg-purple-100 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-center flex flex-col justify-between h-full">
                        <div className="text-3xl mb-1">🧠</div>
                        <h4 className="font-black text-sm uppercase">3. Dense Classification Head</h4>
                        <p className="text-xs font-bold text-zinc-600 mt-1">
                            Adaptive Pooling, Dropout &amp; Linear layers
                        </p>
                        <div className="mt-2 text-[11px] font-mono bg-white border border-black rounded-lg py-1 px-2">
                            512 &rarr; 128 &rarr; 2 Logits
                        </div>
                    </div>
                </div>

                {/* Lower Flow with Threshold Guardrail */}
                <div className="mt-6 pt-6 border-t-2 border-dashed border-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-pink-100 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⚡</span>
                                <h4 className="font-black text-base uppercase">4. Softmax Probability</h4>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-zinc-700">
                                Converts raw network scores into normalized probabilities totaling 100%:
                            </p>
                            <div className="mt-2 font-mono text-xs bg-white border border-black rounded-xl p-2 font-bold">
                                P(Cat) + P(Dog) = 1.00 (100%)
                            </div>
                        </div>

                        <div className="bg-green-100 border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🛡️</span>
                                <h4 className="font-black text-base uppercase">5. 60% Guardrail Decision</h4>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-zinc-700">
                                Checks if the top prediction score passes the certainty threshold:
                            </p>
                            <div className="mt-2 font-mono text-xs bg-white border border-black rounded-xl p-2 font-bold">
                                {`Confidence >= 60% ? "Cat" / "Dog" : "Not a dog/cat"`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Terms Explanations Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] p-6">
                    <div className="w-12 h-12 bg-yellow-100 border-3 border-black rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-[3px_3px_0px_#000]">
                        👀
                    </div>
                    <h3 className="text-xl font-black mb-2">How the Model "Sees"</h3>
                    <p className="text-sm font-semibold text-zinc-600 leading-relaxed">
                        Computers don't see furry pets; they see a 3D grid of numbers representing Red, Green, and Blue pixels. The first layers scan for basic edges and light gradients, like the curve of an ear or the texture of fur.
                    </p>
                </div>

                <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] p-6">
                    <div className="w-12 h-12 bg-blue-100 border-3 border-black rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-[3px_3px_0px_#000]">
                        🧩
                    </div>
                    <h3 className="text-xl font-black mb-2">Building High-Level Features</h3>
                    <p className="text-sm font-semibold text-zinc-600 leading-relaxed">
                        As pixels travel deeper across 5 convolutional blocks, basic lines combine into complex pet anatomy: whisker layouts, snout shapes, slit versus round pupils, and ear silhouettes.
                    </p>
                </div>

                <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] p-6">
                    <div className="w-12 h-12 bg-pink-100 border-3 border-black rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-[3px_3px_0px_#000]">
                        🛑
                    </div>
                    <h3 className="text-xl font-black mb-2">Why the 60% Guardrail?</h3>
                    <p className="text-sm font-semibold text-zinc-600 leading-relaxed">
                        Standard binary classifiers are forced to choose "Cat" or "Dog" even if you upload a car, shoe, or chair! petsnap.ai uses a 60% confidence filter so anything ambiguous is accurately labeled <strong>"Not a dog/cat"</strong>.
                    </p>
                </div>
            </div>

            {/* Model Architecture Details Table */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-6 sm:p-8">
                <h3 className="text-2xl font-black mb-4">
                    📊 Technical Model Specifications
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-3 border-black">
                                <th className="py-3 px-4 font-black text-sm uppercase bg-yellow-100 border-r-2 border-black">Layer / Stage</th>
                                <th className="py-3 px-4 font-black text-sm uppercase bg-yellow-100 border-r-2 border-black">Configuration</th>
                                <th className="py-3 px-4 font-black text-sm uppercase bg-yellow-100">Purpose</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-black text-xs sm:text-sm font-bold text-zinc-800">
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Input Preprocessing</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">Resize(224, 224) + Normalize</td>
                                <td className="py-3 px-4">Standardizes brightness and dimension</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Conv Block 1 &amp; 2</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">Conv2D(32/64) + BN + ReLU + MaxPool</td>
                                <td className="py-3 px-4">Detects lines, corners, textures</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Conv Block 3, 4 &amp; 5</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">Conv2D(128/256/512) + BN + ReLU + MaxPool</td>
                                <td className="py-3 px-4">Detects complex pet facial features</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Pooling &amp; Regularization</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">AdaptiveAvgPool2D(1) + Dropout(0.5, 0.3)</td>
                                <td className="py-3 px-4">Condenses dimensions and prevents overfitting</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Classifier Head</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">Linear(512 &rarr; 128) &rarr; Linear(128 &rarr; 2)</td>
                                <td className="py-3 px-4">Calculates raw species logits</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-black border-r-2 border-black">Inference Decision</td>
                                <td className="py-3 px-4 font-mono border-r-2 border-black">Softmax + 60% Confidence Guardrail</td>
                                <td className="py-3 px-4">Outputs Cat, Dog, or &quot;Not a dog/cat&quot;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Info;

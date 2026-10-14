const Card = ({ preview, specie, prob, catProb, dogProb }) => {
    const percentage = (prob * 100).toFixed(2);
    const isUncertain = specie === "Not a dog/cat" || (prob !== undefined && prob < 0.60);
    const isDog = specie?.toLowerCase() === "dog";
    const isCat = specie?.toLowerCase() === "cat";

    return (
        <div className="flex justify-center w-full">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_#000] p-5 w-full max-w-md">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-yellow-100 border-2 border-black rounded-xl px-3 py-1 shadow-[2px_2px_0px_#000]">
                        Result
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                        {isUncertain ? "Threshold Check: Failed" : "Threshold Check: Passed"}
                    </span>
                </div>

                <div className="bg-[#fdf6e3] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0px_#000]">
                    {/* Image preview box */}
                    <div className="w-48 h-48 sm:w-52 sm:h-52 mx-auto overflow-hidden rounded-2xl border-4 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_#000]">
                        <img
                            src={preview}
                            alt={specie}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Result Heading */}
                    {isUncertain ? (
                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center justify-center gap-2 bg-rose-100 border-3 border-black rounded-2xl px-4 py-2 shadow-[3px_3px_0px_#000]">
                                <span className="text-2xl">❓</span>
                                <h2 className="text-xl sm:text-2xl font-black text-rose-900">
                                    Not a dog/cat
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-zinc-700 mt-2.5 px-2">
                                Highest probability ({percentage}%) fell below our 60% confidence guardrail.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center justify-center gap-2 bg-emerald-100 border-3 border-black rounded-2xl px-4 py-2 shadow-[3px_3px_0px_#000]">
                                <span className="text-2xl">{isDog ? "🐶" : "🐱"}</span>
                                <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                                    It's a {specie}!
                                </h2>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-white border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_#000]">
                            <h3 className="text-xs font-bold text-zinc-600 uppercase">
                                Classification
                            </h3>
                            <p className="text-base sm:text-lg font-black mt-1 truncate">
                                {isUncertain ? "Neither" : specie}
                            </p>
                        </div>

                        <div className={`border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_#000] ${
                            isUncertain ? "bg-amber-100" : "bg-blue-100"
                        }`}>
                            <h3 className="text-xs font-bold text-zinc-600 uppercase">
                                Confidence
                            </h3>
                            <p className="text-base sm:text-lg font-black mt-1">
                                {percentage}%
                            </p>
                        </div>
                    </div>

                    {/* Detailed probability distribution if available */}
                    {(catProb !== undefined && dogProb !== undefined) && (
                        <div className="mt-3 bg-white border-3 border-black rounded-2xl p-3 shadow-[3px_3px_0px_#000]">
                            <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5 flex justify-between">
                                <span>Species Probabilities</span>
                                <span className="text-zinc-400">Min 60% needed</span>
                            </div>
                            <div className="space-y-1.5 text-xs font-bold">
                                <div className="flex items-center justify-between">
                                    <span>🐱 Cat: {(catProb * 100).toFixed(1)}%</span>
                                    <div className="w-24 bg-zinc-200 border border-black rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-yellow-400 h-full rounded-full" 
                                            style={{ width: `${Math.min(100, Math.max(0, catProb * 100))}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>🐶 Dog: {(dogProb * 100).toFixed(1)}%</span>
                                    <div className="w-24 bg-zinc-200 border border-black rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-blue-400 h-full rounded-full" 
                                            style={{ width: `${Math.min(100, Math.max(0, dogProb * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
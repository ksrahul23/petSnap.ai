const ConfusionMatrix = ({ matrix }) => {
    if (!matrix || matrix.length !== 2) return null;

    const [[tn, fp], [fn, tp]] = matrix;

    const cells = [
        { label: "Cat → Cat", value: tn, color: "bg-green-100" },
        { label: "Cat → Dog", value: fp, color: "bg-red-100" },
        { label: "Dog → Cat", value: fn, color: "bg-red-100" },
        { label: "Dog → Dog", value: tp, color: "bg-green-100" },
    ];

    return (
        <div className="w-full px-3 sm:px-4 md:px-6 max-w-6xl mx-auto mt-8 mb-14">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] p-4 sm:p-6">
                <h3 className="text-2xl sm:text-3xl font-black text-center mb-6 tracking-wide">
                    Confusion Matrix
                </h3>

                <div className="block md:hidden">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-yellow-200 border-2 border-black rounded-2xl py-2 text-center text-sm sm:text-base font-extrabold shadow-[3px_3px_0px_#000]">
                            Predicted Cat
                        </div>
                        <div className="bg-blue-200 border-2 border-black rounded-2xl py-2 text-center text-sm sm:text-base font-extrabold shadow-[3px_3px_0px_#000]">
                            Predicted Dog
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="bg-pink-200 border-2 border-black rounded-2xl px-3 py-2 text-center font-extrabold text-sm sm:text-base shadow-[3px_3px_0px_#000] mb-3">
                            Actual Cat
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {cells.slice(0, 2).map((cell, idx) => (
                                <div
                                    key={idx}
                                    className={`${cell.color} border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center text-center p-3 min-h-[120px]`}
                                >
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                        {cell.label}
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-black text-black">
                                        {cell.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-purple-200 border-2 border-black rounded-2xl px-3 py-2 text-center font-extrabold text-sm sm:text-base shadow-[3px_3px_0px_#000] mb-3">
                            Actual Dog
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {cells.slice(2, 4).map((cell, idx) => (
                                <div
                                    key={idx}
                                    className={`${cell.color} border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center text-center p-3 min-h-[120px]`}
                                >
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                        {cell.label}
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-black text-black">
                                        {cell.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-[100px_1fr] gap-3 items-center">
                    <div></div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-yellow-200 border-2 border-black rounded-2xl py-2 text-center font-extrabold shadow-[3px_3px_0px_#000]">
                            Predicted Cat
                        </div>
                        <div className="bg-blue-200 border-2 border-black rounded-2xl py-2 text-center font-extrabold shadow-[3px_3px_0px_#000]">
                            Predicted Dog
                        </div>
                    </div>

                    <div className="flex flex-col justify-around h-72 gap-3">
                        <div className="bg-pink-200 border-2 border-black rounded-2xl px-2 py-6 text-center font-extrabold shadow-[3px_3px_0px_#000]">
                            Actual Cat
                        </div>
                        <div className="bg-purple-200 border-2 border-black rounded-2xl px-2 py-6 text-center font-extrabold shadow-[3px_3px_0px_#000]">
                            Actual Dog
                        </div>
                    </div>

                    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-72">
                        {cells.map((cell, idx) => (
                            <div
                                key={idx}
                                className={`${cell.color} border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center text-center p-4`}
                            >
                                <p className="text-base font-bold text-gray-700 mb-2">
                                    {cell.label}
                                </p>
                                <p className="text-5xl font-black text-black">{cell.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-8">
                    <div className="flex items-center justify-center gap-2 bg-green-100 border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_#000] font-bold text-sm sm:text-base">
                        <span className="w-4 h-4 rounded-full bg-green-400 border border-black"></span>
                        Correct Prediction
                    </div>

                    <div className="flex items-center justify-center gap-2 bg-red-100 border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_#000] font-bold text-sm sm:text-base">
                        <span className="w-4 h-4 rounded-full bg-red-400 border border-black"></span>
                        Misclassified
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfusionMatrix;
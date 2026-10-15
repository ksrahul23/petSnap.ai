const Home = () => {
    return (
        <div className="w-full flex justify-center px-3 sm:px-4 pt-4 sm:pt-6 pb-2">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] px-4 sm:px-8 py-6 sm:py-8 text-center max-w-4xl w-full relative overflow-hidden">
                {/* Decorative background element */}
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-black bg-[#fdf6e3] p-2 flex items-center justify-center shadow-[5px_5px_0px_#000] hover:scale-105 transition-transform">
                        <img 
                            src="/logo.png" 
                            alt="petsnap.ai logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-black tracking-tight">
                    petsnap<span className="text-amber-500">.ai</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-bold mt-2 max-w-xl mx-auto">
                    Smart Cat &amp; Dog Image Classifier with Non-Pet Detection Guardrails
                </p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 text-xs sm:text-sm font-black">
                    <span className="bg-yellow-100 border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000]">
                        🐾 Dual Species Detection
                    </span>
                    <span className="bg-amber-200 border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000]">
                        🛡️ 60% Confidence Guardrail
                    </span>
                    <span className="bg-green-100 border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000]">
                        ⚡ PyTorch Deep CNN
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
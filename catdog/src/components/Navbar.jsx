const Navbar = ({ activePage, setActivePage }) => {
    return (
        <header className="w-full px-3 sm:px-6 pt-4 pb-2">
            <div className="max-w-6xl mx-auto bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                {/* Logo and Brand */}
                <div 
                    onClick={() => setActivePage("classifier")}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                >
                    <div className="w-11 h-11 rounded-2xl border-3 border-black bg-[#fdf6e3] p-1 flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:rotate-6 transition-transform">
                        <img 
                            src="/logo.png" 
                            alt="petsnap.ai logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl sm:text-2xl tracking-tight leading-none">
                            petsnap<span className="text-amber-500">.ai</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                            Pet Vision AI
                        </span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setActivePage("classifier")}
                        className={`px-3 sm:px-5 py-2 rounded-2xl border-3 border-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer ${
                            activePage === "classifier"
                                ? "bg-amber-300 shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                : "bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
                        }`}
                    >
                        Classifier
                    </button>

                    <button
                        onClick={() => setActivePage("info")}
                        className={`px-3 sm:px-5 py-2 rounded-2xl border-3 border-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer ${
                            activePage === "info"
                                ? "bg-amber-300 shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                : "bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
                        }`}
                    >
                        Info
                    </button>

                    <a
                        href="https://github.com/ksrahul23"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-100 border-3 border-black rounded-2xl shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition font-bold text-xs uppercase"
                    >
                        <span>GitHub</span>
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

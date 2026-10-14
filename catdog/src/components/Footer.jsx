const Footer = () => {
    return (
        <footer className="w-full mt-12 pb-8 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="petsnap.ai logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-base sm:text-lg">
                            petsnap.ai &bull; Built by Rahul Kumar
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 font-bold">
                        <a
                            href="https://github.com/ksrahul23"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-yellow-100 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition text-sm sm:text-base flex items-center gap-2"
                        >
                            <span>GitHub</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Predict from "./components/Predict.jsx";
import Info from "./components/Info.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

const App = () => {
    const [activePage, setActivePage] = useState("classifier");

    return (
        <div className="w-full min-h-screen bg-[#fdf6e3] flex flex-col justify-between">
            <div>
                <Navbar 
                    activePage={activePage} 
                    setActivePage={setActivePage} 
                />

                {activePage === "classifier" ? (
                    <main>
                        <Home />
                        <Predict />
                    </main>
                ) : (
                    <main>
                        <Info 
                            onGoToClassifier={() => setActivePage("classifier")} 
                        />
                    </main>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default App;
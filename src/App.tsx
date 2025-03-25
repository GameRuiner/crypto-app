import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "pages/HomePage";
import CurrencyPage from "pages/CurrencyPage";
import Navbar from "components/Navbar";
import {RatesStoreProvider} from "src/context/RatesStoreContext";
import "./styles/App.css";

const App: React.FC = () => {
    return (
        <RatesStoreProvider>
            <main className="container">
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/:currency" element={<CurrencyPage />} />
                    </Routes>
                </Router>
            </main>
        </RatesStoreProvider>
    );
};

export default App;

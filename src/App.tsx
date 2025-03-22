import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "pages/HomePage";
import CurrencyPage from "pages/CurrencyPage";
import Navbar from "components/Navbar";
import "./styles/App.css";

const App: React.FC = () => {
    return (
        <main className="container">
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:currency" element={<CurrencyPage />} />
                </Routes>
            </Router>
        </main>
    );
};

export default App;

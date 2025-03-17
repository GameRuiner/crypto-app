import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "pages/HomePage";
import CurrencyPage from "pages/CurrencyPage";
import "./styles/App.css";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:currency" element={<CurrencyPage />} />
            </Routes>
        </Router>
    );
};

export default App;

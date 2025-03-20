import React from "react";
import "src/styles/Toggle.css";

interface ToggleProps {
    toggleHandler: (value: React.SetStateAction<boolean>) => void;
    value: boolean;
}

const Toggle: React.FC<ToggleProps> = ({toggleHandler, value}) => (
    <label className="toggle-container">
        <input type="checkbox" checked={value} onChange={() => toggleHandler(!value)} />
        <span className="toggle-slider"></span>
        Group by first letter
    </label>
);

export default Toggle;

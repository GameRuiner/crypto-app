import React from "react";
import "src/styles/Filter.css";

interface FilterProps {
    filterHandler: (value: React.SetStateAction<string>) => void;
}

const Filter: React.FC<FilterProps> = ({filterHandler}) => (
    <input
        type="text"
        placeholder="Filter by currency..."
        onChange={(e) => filterHandler(e.target.value)}
        className="filter-input"
    />
);

export default Filter;

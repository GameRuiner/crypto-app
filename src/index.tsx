import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import "@fontsource/ubuntu";
import "@fontsource/ubuntu/700.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

import React from "react";
import logo from "../../images/logo.png";

const Navbar = () => {
    return (
        <nav>
            <a href="/">
                <img src={logo} alt="CryptoApp Logo" />
            </a>
        </nav>
    );
};

export default Navbar;

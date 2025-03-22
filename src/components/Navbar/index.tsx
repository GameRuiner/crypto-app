import React from "react";
import logo from "../../images/logo.png";

const Navbar = () => {
    return (
        <nav>
            <a href="/">
                <img src={logo} alt="CryptoApp Logo" width="100" />
            </a>
        </nav>
    );
};

export default Navbar;

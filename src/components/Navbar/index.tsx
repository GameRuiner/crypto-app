import React from "react";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <Link to="/">
                <img src={logo} alt="CryptoApp Logo" />
            </Link>
        </nav>
    );
};

export default Navbar;

import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <div className="logo-brand">
                    <NavLink to="/" className="logo-brand ">
                        <img src="/images/swara_logo.png" alt="Logo" />
                    </NavLink>
                </div>
                <nav>
                    <ul>
                        <li><NavLink to="/generate-barcode" className="list">Barcode Generator</NavLink></li>
                        <li><NavLink to="/invoice" className="list">Sell Invoice</NavLink></li>
                        <li><NavLink to="/product-add" className="list">Purchase Invoice</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

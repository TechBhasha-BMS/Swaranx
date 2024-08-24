import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span className="footer-text">Update coming soon by </span>
                <img
                    src="/images/TB.png" // Replace with your image URL
                    alt="Logo"
                    className="footer-image"
                />
            </div>
        </footer>
    );
};

export default Footer;

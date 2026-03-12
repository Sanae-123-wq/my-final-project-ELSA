import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <h2 className="footer-logo">ELSA</h2>
                        <p className="footer-tagline">{t.footer.tagline}</p>
                        <p className="footer-desc">
                            {t.footer.desc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-heading">{t.footer.explore}</h3>
                        <ul className="footer-links">
                            <li><Link to="/">{t.footer.home}</Link></li>
                            <li><Link to="/ai-recipe">{t.footer.aiRecipes}</Link></li>
                            <li><Link to="/cart">{t.footer.cart}</Link></li>
                            <li><Link to="/login">{t.footer.login}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section">
                        <h3 className="footer-heading">{t.footer.contact}</h3>
                        <ul className="contact-list">
                            <li>
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>{t.footer.address}</span>
                            </li>
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <span>hello@elsa-pastry.com</span>
                            </li>
                        </ul>
                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" className="social-icon" aria-label="TikTok"><FaTiktok /></a>
                            <a href="#" className="social-icon" aria-label="WhatsApp"><FaWhatsapp /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

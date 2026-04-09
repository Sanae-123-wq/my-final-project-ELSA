import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaStar, FaQuoteLeft, FaFacebookF } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <img src={logo} alt="ELSA Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                            <h2 className="footer-logo" style={{ margin: 0 }}>ELSA</h2>
                        </div>
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
                                <a 
                                    href="https://www.google.com/maps/place/Technopark+Agadir/@30.403174,-9.5311084,751m/data=!3m2!1e3!4b1!4m6!3m5!1s0xdb3c9b7e7260a7f:0x4ef4d088a51fa8d3!8m2!3d30.403174!4d-9.5285335!16s%2Fg%2F11ll2s0pfj?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    {t.footer.address}
                                </a>
                            </li>
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <a 
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=elsa.pastry1@gmail.com" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    elsa.pastry1@gmail.com
                                </a>
                            </li>
                        </ul>
                        <div className="social-links">
                            <a href="https://www.facebook.com/profile.php?id=61574299620680" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/elsa.pastry1?igsh=cmhjN2xoZDN3Nmht" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://www.tiktok.com/@elsapastry1" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok"><FaTiktok /></a>
                            <a href="https://wa.me/212771398616" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp"><FaWhatsapp /></a>
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

import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import FavoritesContext from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { favorites } = useContext(FavoritesContext);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const favoritesCount = favorites.length;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                {/* Left Section: Logo */}
                <div className="nav-left">
                    <Link to="/" className="nav-logo" onClick={closeMenu}>
                        <img src={logo} alt="ELSA Logo" className="logo-img" />
                    </Link>
                </div>

                {/* Center Section: Main Navigation (Desktop Only) */}
                <div className="nav-center">
                    <Link to="/" className="nav-text-link">{t.navbar.home}</Link>
                    <Link to="/shop" className="nav-text-link">{t.navbar.shop}</Link>
                    <Link to="/stores" className="nav-text-link">{t.navbar.marketplace}</Link>
                    <Link to="/ai-recipe" className="nav-text-link">{t.navbar.aiKitchen}</Link>
                </div>

                {/* Right Section: Icons (Desktop Only) */}
                <div className="nav-right">
                    <LanguageSelector />

                    <Link to="/favorites" className="nav-icon-link" aria-label="Favorites">
                        <FaHeart size={18} />
                        {favoritesCount > 0 && <span className="badge badge-favorites">{favoritesCount}</span>}
                    </Link>

                    <Link to="/cart" className="nav-icon-link" aria-label="Shopping Cart">
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div className="nav-user-box">
                            {user.role === 'admin' && <Link to="/admin" className="nav-role-badge">Admin</Link>}
                            {user.role === 'vendor' && <Link to="/vendor" className="nav-role-badge">Patissier</Link>}
                            {user.role === 'delivery' && <Link to="/delivery" className="nav-role-badge">Livreur</Link>}
                            <Link to="/login" className="nav-icon-link" aria-label="Profile">
                                <FaUser size={18} />
                            </Link>
                            <button onClick={handleLogout} className="nav-icon-link logout-btn" aria-label="Logout">
                                <FaSignOutAlt size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-icon-link" aria-label="Login">
                            <FaUser size={18} />
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>{t.navbar.home}</Link>
                <Link to="/shop" onClick={closeMenu}>{t.navbar.shop}</Link>
                <Link to="/stores" onClick={closeMenu}>{t.navbar.marketplace}</Link>
                <Link to="/ai-recipe" onClick={closeMenu}>{t.navbar.aiKitchen}</Link>
                <Link to="/favorites" onClick={closeMenu}>{t.navbar.favorites}</Link>
                <Link to="/cart" onClick={closeMenu}>{t.navbar.cart}</Link>
                {user ? (
                    <>
                        <span className="mobile-welcome">{t.navbar.hi}, {user.name}</span>
                        <button onClick={handleLogout} className="mobile-logout-btn">{t.navbar.logout}</button>
                    </>
                ) : (
                    <Link to="/login" onClick={closeMenu}>{t.navbar.login}</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHeart, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import FavoritesContext from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import LanguageSelector from './LanguageSelector';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
    const { user, logout, checkAuth } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { favorites } = useContext(FavoritesContext);
    const { t } = useLanguage();
    const { unreadCount } = useSocket();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const handleProtectedLink = (e, path) => {
        if (!checkAuth()) {
            e.preventDefault();
        } else {
            closeMenu();
            navigate(path);
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const favoritesCount = favorites.length;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isClientOrGuest = !user || user.role === 'client';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                {/* Left Section: Logo */}
                <div className="nav-left">
                    <Link to={isClientOrGuest ? "/" : `/${user.role}`} className="nav-logo" onClick={closeMenu}>
                        <img src={logo} alt="ELSA Logo" className="logo-img" />
                    </Link>
                </div>

                {/* Center Section: Main Navigation (Desktop Only) */}
                <div className="nav-center">
                    {isClientOrGuest ? (
                        <>
                            <Link to="/" className="nav-text-link">{t.navbar.home}</Link>
                            <Link to="/shop" className="nav-text-link">{t.navbar.shop}</Link>
                            <Link to="/stores" className="nav-text-link">{t.navbar.marketplace}</Link>
                            <Link to="/ai-recipe" className="nav-text-link">{t.navbar.aiKitchen}</Link>
                            {user && <Link to="/orders" className="nav-text-link">My Orders</Link>}
                        </>
                    ) : (
                        <>
                            <Link to={`/${user.role}`} className="nav-text-link">Dashboard</Link>
                            {user.role === 'admin' && <Link to="/admin/products" className="nav-text-link">Manage Products</Link>}
                            {user.role === 'vendor' && <Link to="/vendor/products" className="nav-text-link">My Products</Link>}
                            {user.role === 'delivery' && <Link to="/delivery/available" className="nav-text-link">Available Orders</Link>}
                        </>
                    )}
                </div>

                {/* Right Section: Icons (Desktop Only) */}
                <div className="nav-right">
                    <LanguageSelector />

                    {isClientOrGuest && (
                        <>
                            <Link 
                                to="/favorites" 
                                className="nav-icon-link" 
                                aria-label="Favorites"
                                onClick={(e) => handleProtectedLink(e, '/favorites')}
                            >
                                <FaHeart size={18} />
                                {favoritesCount > 0 && <span className="badge badge-favorites">{favoritesCount}</span>}
                            </Link>

                            <Link 
                                to="/cart" 
                                className="nav-icon-link" 
                                aria-label="Shopping Cart"
                                onClick={(e) => handleProtectedLink(e, '/cart')}
                            >
                                <FaShoppingCart size={20} />
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </Link>
                        </>
                    )}

                    {user && (
                        <Link to="/notifications" className="nav-icon-link" aria-label="Notifications">
                            <FaBell size={18} />
                            {unreadCount > 0 && <span className="badge badge-notifications">{unreadCount}</span>}
                        </Link>
                    )}

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
                {isClientOrGuest ? (
                    <>
                        <Link to="/" onClick={closeMenu}>{t.navbar.home}</Link>
                        <Link to="/shop" onClick={closeMenu}>{t.navbar.shop}</Link>
                        <Link to="/stores" onClick={closeMenu}>{t.navbar.marketplace}</Link>
                        <Link to="/ai-recipe" onClick={closeMenu}>{t.navbar.aiKitchen}</Link>
                        {user && <Link to="/orders" onClick={closeMenu}>My Orders</Link>}
                        <Link to="/favorites" onClick={(e) => handleProtectedLink(e, '/favorites')}>{t.navbar.favorites}</Link>
                        <Link to="/cart" onClick={(e) => handleProtectedLink(e, '/cart')}>{t.navbar.cart}</Link>
                    </>
                ) : (
                    <>
                        <Link to={`/${user.role}`} onClick={closeMenu}>Dashboard</Link>
                        <Link to="/notifications" onClick={closeMenu}>Notifications</Link>
                    </>
                )}
                
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

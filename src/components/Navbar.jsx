import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="ELSA Logo" className="logo-img" />
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">{t.navbar.home}</Link>
                    <Link to="/shop" className="nav-link">{t.navbar.shop}</Link>
                    <Link to="/stores" className="nav-link">{t.navbar.marketplace}</Link>
                    <Link to="/ai-recipe" className="nav-link">{t.navbar.aiKitchen}</Link>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                        <Link to="/cart" className="items-center flex gap-2 nav-link cart-icon-wrapper">
                            <FaShoppingCart size={20} />
                            <span>{t.navbar.cart}</span>
                            {cartCount > 0 && (
                                <span className="badge">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="nav-link font-bold text-primary">
                                        Admin
                                    </Link>
                                )}
                                {user.role === 'vendor' && (
                                    <Link to="/vendor" className="nav-link font-bold text-primary">
                                        Patissier
                                    </Link>
                                )}
                                {user.role === 'delivery' && (
                                    <Link to="/delivery" className="nav-link font-bold text-primary">
                                        Livreur
                                    </Link>
                                )}
                                <span className="text-sm font-semibold">{t.navbar.hi}, {user.name}</span>
                                <button onClick={handleLogout} className="flex items-center gap-2 nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <FaSignOutAlt />
                                    <span>{t.navbar.logout}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className="flex items-center gap-2 nav-link">
                                    <FaUser />
                                    <span>{t.navbar.login}</span>
                                </Link>
                                <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                    {t.navbar.signup}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

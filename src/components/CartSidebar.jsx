import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaTimes, FaTrash } from 'react-icons/fa';

const CartSidebar = () => {
    const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    
    if (cartItems.length === 0) return null;

    return (
        <aside className="shop-sidebar-cart visible">
            <div className="shop-sidebar-header">
                <h3>
                    {t.navbar.cart} <span className="item-count">({cartCount})</span>
                </h3>
            </div>

            <div className="shop-sidebar-content">
                <div className="shop-sidebar-items">
                    {cartItems.map((item) => (
                        <div key={item._id} className="shop-sidebar-item">
                            <div className="item-img-container">
                                <img src={item.image} alt={item[`name_${language}`] || item.name} />
                            </div>
                            <div className="item-details">
                                <h4>{item[`name_${language}`] || item.name}</h4>
                                <div className="item-price-qty">
                                    <span className="price">${item.price.toFixed(2)}</span>
                                    <div className="qty-controls">
                                        <button onClick={() => updateQty(item._id, -1)} aria-label="Decrease quantity">−</button>
                                        <span className="qty">{item.qty}</span>
                                        <button onClick={() => updateQty(item._id, 1)} aria-label="Increase quantity">+</button>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="item-remove-btn" 
                                onClick={() => removeFromCart(item._id)}
                                aria-label="Remove item"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="shop-sidebar-footer">
                <div className="sidebar-total">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                </div>
                <button 
                    className="btn-primary checkout-btn" 
                    onClick={() => navigate('/cart')}
                >
                    Checkout
                </button>
            </div>
        </aside>
    );
};

export default CartSidebar;

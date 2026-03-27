import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { api } from '../services/api';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.createOrder({
                orderItems: cartItems,
                totalPrice: Number(totalPrice),
            });

            alert('Order Placed Successfully! (Simulated)');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Order Failed');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
            <h1 className="text-center" style={{ marginBottom: '3rem' }}>Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center" style={{ padding: '4rem', background: 'white', borderRadius: '12px' }}>
                    <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#666' }}>Your cart represents a world of untapped potential.</p>
                    <Link to="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="cart-grid">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-thumb" />
                                <div style={{ flexGrow: 1 }}>
                                    <Link to={`/product/${item._id}`} style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>
                                        {item.name}
                                    </Link>
                                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                                        ${item.price.toFixed(2)} x {item.qty}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                        ${(item.price * item.qty).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Summary</h2>
                        <div className="flex justify-between" style={{ marginBottom: '1rem', color: '#666' }}>
                            <span>Total Items</span>
                            <span style={{ fontWeight: 'bold' }}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                        </div>
                        <div className="flex justify-between" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--dark-color)' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary-color)' }}>${totalPrice}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn-primary"
                            style={{ width: '100%', padding: '16px' }}
                        >
                            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import ReclamationModal from '../components/ReclamationModal';
import { resolveImageUrl } from '../utils/imageUrl';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch('http://localhost:5000/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FaClock className="text-orange" />;
            case 'preparing': return <FaBox className="text-orange" />;
            case 'ready': return <FaCheckCircle className="text-green-500" />;
            case 'picked': return <FaTruck className="text-blue-500" />;
            case 'delivered': return <FaCheckCircle className="text-green-600" />;
            case 'cancelled': return <FaTimesCircle className="text-red-500" />;
            default: return <FaClock className="text-gray-400" />;
        }
    };

    const getStatusLabel = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    };

    const canReport = (status) => ['picked', 'delivered'].includes(status);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange"></div>
        </div>
    );

    return (
        <div className="my-orders-section container-premium">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--pat-brown)', fontFamily: "'Playfair Display', serif" }}>
                    My Orders
                </h1>
                <p style={{ color: 'var(--text-light)' }}>Track your sweet treats from our ovens to your door.</p>
            </div>

            <div className="orders-premium-grid">
                <AnimatePresence>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="order-card-premium"
                            >
                                <div className="order-premium-header">
                                    <span className="order-premium-id">#{order._id.toString().slice(-6).toUpperCase()}</span>
                                    <div className={`order-status-badge status-${order.status}`}>
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>

                                <div className="order-premium-products">
                                    {order.products.map((item, i) => (
                                        <div key={i} className="order-premium-item">
                                            <span className="order-premium-item-name">
                                                <span className="order-premium-item-qty">{item.quantity}x</span> {item.productId?.name || 'Deleted Product'}
                                            </span>
                                            <span className="font-bold">{item.price * item.quantity} MAD</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Premium Progress Bar */}
                                {order.status !== 'cancelled' && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ height: '4px', background: 'var(--pat-beige)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    background: 'var(--pat-gold)',
                                                    transition: 'width 1s ease',
                                                    width: order.status === 'delivered' ? '100%' :
                                                        order.status === 'picked' ? '75%' :
                                                            order.status === 'ready' ? '50%' :
                                                                order.status === 'preparing' ? '25%' : '10%'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="order-premium-footer">
                                    <div className="order-premium-date" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                        <FaClock size={12} style={{ display: 'inline', marginRight: '5px' }} />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="order-premium-total">
                                        <span className="total-label">Subtotal</span>
                                        <span className="total-value">{order.totalAmount} MAD</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                                    {canReport(order.status) && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsModalOpen(true);
                                            }}
                                            className="flex items-center justify-center gap-2 flex-1"
                                            style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid #fee2e2', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s' }}
                                        >
                                            <FaExclamationTriangle size={14} />
                                            Report
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedOrderDetails(order);
                                            setIsDetailsModalOpen(true);
                                        }}
                                        className="flex-1 hover:scale-105"
                                        style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--pat-brown)', color: 'white', fontWeight: '700', fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        Details
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20" style={{ gridColumn: '1 / -1', background: 'white', borderRadius: 'var(--pat-radius)', boxShadow: 'var(--pat-shadow)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥐</div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--pat-brown)' }}>No orders found</h2>
                            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Your cookie jar is empty... for now!</p>
                            <button onClick={() => window.location.href = '/shop'} className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
                                Start Shopping
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <ReclamationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orderId={selectedOrder?._id}
                orderNumber={selectedOrder?._id?.toString()?.slice(-6)?.toUpperCase()}
            />

            {/* Premium Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && selectedOrderDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="premium-modal-overlay"
                        onClick={() => setIsDetailsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="premium-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="premium-modal-header">
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--pat-brown)', fontWeight: 'bold' }}>
                                    Order #{selectedOrderDetails._id.toString().slice(-6).toUpperCase()}
                                </h3>
                                <button className="premium-modal-close" onClick={() => setIsDetailsModalOpen(false)}>&times;</button>
                            </div>
                            <div className="premium-modal-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-light)', fontWeight: '600' }}>Status:</span>
                                    <span className={`order-status-badge status-${selectedOrderDetails.status}`}>
                                        {getStatusLabel(selectedOrderDetails.status)}
                                    </span>
                                </div>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--pat-beige)', paddingBottom: '0.5rem' }}>Products</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {selectedOrderDetails.products.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {item.productId?.image && (
                                                <img src={resolveImageUrl(item.productId.image)} alt={item.productId.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '700', color: 'var(--pat-brown)' }}>{item.productId?.name || 'Deleted Product'}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{item.price} MAD × {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: '800' }}>
                                                {item.price * item.quantity} MAD
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px dashed var(--pat-beige)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--pat-brown)' }}>
                                    <span>Total:</span>
                                    <span>{selectedOrderDetails.totalAmount} MAD</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;

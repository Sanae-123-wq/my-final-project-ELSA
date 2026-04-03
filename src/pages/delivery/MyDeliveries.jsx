import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const MyDeliveries = () => {
    const { user } = useContext(AuthContext);
    const { notifications } = useSocket();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(null);

    const STATUS_FLOW = {
        'ready': { label: 'Assigned / Ready', next: 'picked', nextLabel: 'Mark Picked Up', currentBadge: 'badge-neutral', actionBtn: 'admin-btn-secondary' },
        'picked': { label: 'Out for Delivery', next: 'delivered', nextLabel: 'Complete Delivery', currentBadge: 'badge-info', actionBtn: 'admin-btn-primary' },
        'delivered': { label: 'Delivered', next: null, currentBadge: 'badge-success', actionBtn: null },
    };

    useEffect(() => {
        loadMyDeliveries();
    }, [user, notifications]);

    const loadMyDeliveries = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch('http://localhost:5000/api/orders/my-deliveries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const realOrders = await res.json();
            
            setDeliveries(realOrders.sort((a, b) => {
                if (a.status === 'delivered') return 1;
                if (b.status === 'delivered') return -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            }));
        } catch (err) {
            console.error('Failed to load deliveries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, currentStatus) => {
        const nextStatus = STATUS_FLOW[currentStatus]?.next;
        if (!nextStatus) return;

        setStatusUpdating(orderId);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: nextStatus })
            });

            if (!res.ok) throw new Error('Update failed');

            setDeliveries(deliveries.map(d => 
                d._id === orderId ? { ...d, status: nextStatus } : d
            ));
            
            if (nextStatus === 'delivered') {
                alert(`Order ${orderId} marked as DELIVERED! Great job! 🎉`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        } finally {
            setStatusUpdating(null);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">🚚 My Deliveries</h1>
                    <p className="admin-page-subtitle">Track and update your current delivery routes</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={loadMyDeliveries}>
                    🔄 Refresh
                </button>
            </div>

            <div className="admin-tabs">
                <button className="admin-tab active">
                    Active <span className="tab-count">{deliveries.filter(d => d.status !== 'delivered').length}</span>
                </button>
                <button className="admin-tab">
                    Completed <span className="tab-count">{deliveries.filter(d => d.status === 'delivered').length}</span>
                </button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner"></div><p>Loading your routes...</p></div>
            ) : deliveries.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="empty-icon">🗺️</div>
                    <p>You have no deliveries assigned right now.</p>
                </div>
            ) : (
                <div className="vendor-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {deliveries.map(delivery => {
                        const flow = STATUS_FLOW[delivery.status] || STATUS_FLOW['assigned'];
                        const isDelivered = delivery.status === 'delivered';

                        return (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={delivery._id} className="admin-card" style={{ marginBottom: 0, opacity: isDelivered ? 0.7 : 1 }}>
                                <div className="admin-card-header" style={{ padding: '1rem', background: isDelivered ? '#F9F6F3' : 'white' }}>
                                    <h3 className="admin-card-title" style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#5C4033' }}>{delivery._id.substring(0, 8).toUpperCase()}</h3>
                                    <span className={`admin-badge ${flow.currentBadge}`}>
                                        {flow.label}
                                    </span>
                                </div>
                                <div style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FDF3EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                            👤
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#374151', marginBottom: '2px' }}>{delivery.userId?.name || 'Client Name'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>📞 {delivery.userId?.phone || 'Not given'}</div>
                                            <a href={`tel:${delivery.userId?.phone}`} style={{ fontSize: '0.72rem', color: '#5C4033', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '4px' }}>CALL CUSTOMER</a>
                                        </div>
                                    </div>
                                    
                                    <div style={{ background: '#FAF8F5', border: '1px solid #E6D5C3', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1rem' }}>📍</span>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', fontWeight: '700', marginBottom: '2px' }}>Delivery Address</div>
                                                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>{delivery.userId?.address || 'Not specified'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F0EBE3' }}>
                                            <span style={{ fontSize: '1rem' }}>📦</span>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', fontWeight: '700', marginBottom: '2px' }}>Order Details</div>
                                                <div style={{ fontSize: '0.85rem', color: '#5C4033', fontWeight: '600' }}>{delivery.totalAmount} MAD <span style={{ color: '#9ca3af', fontWeight: '400', fontSize: '0.75rem', marginLeft: '4px' }}>({delivery.products?.length || 0} items)</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {!isDelivered && (
                                        <button 
                                            className={`admin-btn ${flow.actionBtn}`} 
                                            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
                                            onClick={() => handleUpdateStatus(delivery._id, delivery.status)}
                                            disabled={statusUpdating === delivery._id}
                                        >
                                            {statusUpdating === delivery._id ? 'Updating...' : `${flow.nextLabel} →`}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyDeliveries;



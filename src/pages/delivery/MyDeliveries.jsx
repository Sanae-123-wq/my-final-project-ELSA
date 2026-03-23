import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

const MyDeliveries = () => {
    const { user } = useContext(AuthContext);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(null);

    const STATUS_FLOW = {
        'assigned': { label: 'Assigned', next: 'picked_up', nextLabel: 'Mark Picked Up', currentBadge: 'badge-neutral', actionBtn: 'admin-btn-secondary' },
        'picked_up': { label: 'Picked Up', next: 'out_for_delivery', nextLabel: 'Start Route', currentBadge: 'badge-info', actionBtn: 'admin-btn-primary' },
        'out_for_delivery': { label: 'On the way', next: 'delivered', nextLabel: 'Complete Delivery', currentBadge: 'badge-warning', actionBtn: 'admin-btn-success' },
        'delivered': { label: 'Delivered', next: null, currentBadge: 'badge-success', actionBtn: null },
    };

    useEffect(() => {
        loadMyDeliveries();
    }, []);

    const loadMyDeliveries = async () => {
        setLoading(true);
        try {
            // In a real app we'd fetch only this worker's orders
            const allOrders = await api.fetchOrders();
            // Mock filtering: getting some orders and forcing them to be 'mine' for UI demo
            const myOrders = allOrders.slice(0, 5).map((o, i) => ({
                ...o,
                status: i === 0 ? 'out_for_delivery' : i === 1 ? 'picked_up' : i === 2 ? 'assigned' : 'delivered',
                customerName: `Customer ${i + 1}`,
                address: `Test Address ${i + 1}, Rabat`,
                phone: `06 11 22 33 0${i}`
            }));
            
            // Sort active first, delivered last
            setDeliveries(myOrders.sort((a, b) => {
                if (a.status === 'delivered') return 1;
                if (b.status === 'delivered') return -1;
                return 0;
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, currentStatus) => {
        const nextStatus = STATUS_FLOW[currentStatus]?.next;
        if (!nextStatus) return;

        setStatusUpdating(orderId);
        try {
            // Mock API call to update status
            await new Promise(resolve => setTimeout(resolve, 800));
            // Update local state
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
                            <div key={delivery._id} className="admin-card" style={{ marginBottom: 0, opacity: isDelivered ? 0.7 : 1 }}>
                                <div className="admin-card-header" style={{ padding: '1rem', background: isDelivered ? '#F9F6F3' : 'white' }}>
                                    <h3 className="admin-card-title" style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#B08968' }}>{delivery._id}</h3>
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
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#374151', marginBottom: '2px' }}>{delivery.customerName || 'Client Name'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>📞 {delivery.phone || '06 00 00 00 00'}</div>
                                            <a href={`tel:${delivery.phone}`} style={{ fontSize: '0.72rem', color: '#B08968', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '4px' }}>CALL CUSTOMER</a>
                                        </div>
                                    </div>
                                    
                                    <div style={{ background: '#FAF8F5', border: '1px solid #E6D5C3', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1rem' }}>📍</span>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', fontWeight: '700', marginBottom: '2px' }}>Delivery Address</div>
                                                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>{delivery.address || 'Mock Address, Rabat'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F0EBE3' }}>
                                            <span style={{ fontSize: '1rem' }}>📦</span>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', fontWeight: '700', marginBottom: '2px' }}>Order Details</div>
                                                <div style={{ fontSize: '0.85rem', color: '#5C3D2E', fontWeight: '600' }}>{delivery.total} MAD <span style={{ color: '#9ca3af', fontWeight: '400', fontSize: '0.75rem', marginLeft: '4px' }}>({delivery.items?.length || 3} items)</span></div>
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyDeliveries;

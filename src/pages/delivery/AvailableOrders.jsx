import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

// Mock location data for nearby orders since it's not in the main mockData yet
const MOCK_NEARBY_ORDERS = [
    { _id: 'ORD_901', customerName: 'Youssef Alaoui', phone: '06 11 22 33 44', address: 'Quartier Souissi, Avenue Mohammed VI, Rabat', distance: '1.2 km', items: 3, total: '240.00', status: 'ready', time: '5 min ago' },
    { _id: 'ORD_902', customerName: 'Amina Bennis', phone: '06 55 66 77 88', address: 'Hay Riad, Secteur 9, Rabat', distance: '2.5 km', items: 1, total: '45.00', status: 'ready', time: '12 min ago' },
    { _id: 'ORD_903', customerName: 'Tariq Mansour', phone: '06 99 88 77 66', address: 'Agdal, Rue Oqba, Rabat', distance: '3.8 km', items: 5, total: '380.00', status: 'preparing', time: '20 min ago' },
    { _id: 'ORD_904', customerName: 'Leila Kettani', phone: '06 44 33 22 11', address: 'Hassan, Place Pietri, Rabat', distance: '4.1 km', items: 2, total: '120.00', status: 'ready', time: '25 min ago' },
];

const AvailableOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDistance, setFilterDistance] = useState('5'); // km
    const [acceptingId, setAcceptingId] = useState(null);

    useEffect(() => {
        // Simulate fetching nearby orders based on worker location
        setTimeout(() => {
            setOrders(MOCK_NEARBY_ORDERS);
            setLoading(false);
        }, 600);
    }, []);

    const handleAcceptOrder = async (orderId) => {
        setAcceptingId(orderId);
        try {
            // Mock API call to accept order
            await new Promise(resolve => setTimeout(resolve, 800));
            // Remove from local list
            setOrders(orders.filter(o => o._id !== orderId));
            
            // In a real app, this would call api.updateOrderStatus(orderId, 'assigned', user._id)
            alert(`Order ${orderId} accepted successfully! It has been added to your deliveries.`);
        } catch (err) {
            console.error(err);
            alert('Failed to accept order. It may have been taken by another driver.');
        } finally {
            setAcceptingId(null);
        }
    };

    const handleAcceptMultiple = async () => {
        const readyOrders = filteredOrders.filter(o => o.status === 'ready');
        if (readyOrders.length === 0) return;
        
        const confirm = window.confirm(`Accept ${readyOrders.length} ready orders?`);
        if (!confirm) return;
        
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrders(orders.filter(o => o.status !== 'ready'));
            alert(`${readyOrders.length} orders accepted!`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter by distance
    const filteredOrders = orders.filter(o => parseFloat(o.distance) <= parseFloat(filterDistance));

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Scanning for nearby orders...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">📍 Available Orders</h1>
                    <p className="admin-page-subtitle">Orders ready for pickup in your area</p>
                </div>
                <button 
                    className="admin-btn admin-btn-primary" 
                    onClick={handleAcceptMultiple}
                    disabled={filteredOrders.filter(o => o.status === 'ready').length === 0}
                >
                    ✓ Accept All Ready ({filteredOrders.filter(o => o.status === 'ready').length})
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #E6D5C3' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Max Distance:</span>
                    <input 
                        type="range" 
                        min="1" max="10" step="1" 
                        value={filterDistance} 
                        onChange={(e) => setFilterDistance(e.target.value)}
                        style={{ accentColor: '#5C4033' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#5C4033', fontWeight: '700' }}>{filterDistance} km</span>
                </div>
                <div className="admin-badge badge-primary" style={{ padding: '0.6rem 1rem' }}>
                    Current Location: <strong>Rabat, Agdal</strong>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-wrap">
                    {filteredOrders.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="empty-icon">📍</div>
                            <p>No orders available within {filterDistance} km right now.</p>
                        </div>
                    ) : (
                        <table className="admin-table admin-table-full">
                            <thead>
                                <tr>
                                    <th>Order Info</th>
                                    <th>Customer & Location</th>
                                    <th>Distance</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="order-id-cell">{order._id}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{order.items} items • {order.total} MAD</div>
                                            <div style={{ fontSize: '0.72rem', color: '#5C4033', marginTop: '2px' }}>⏱ {order.time}</div>
                                        </td>
                                        <td>
                                            <div className="client-name">{order.customerName}</div>
                                            <div className="client-email">📞 {order.phone}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#374151', marginTop: '4px', maxWidth: '250px', whiteSpace: 'normal', lineHeight: '1.3' }}>
                                                📍 {order.address}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '700', color: '#5C4033', fontSize: '1.1rem' }}>{order.distance}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>from you</div>
                                        </td>
                                        <td>
                                            {order.status === 'ready' 
                                                ? <span className="admin-badge badge-success">Ready for Pickup</span>
                                                : <span className="admin-badge badge-warning">Preparing</span>
                                            }
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="admin-btn admin-btn-primary" 
                                                onClick={() => handleAcceptOrder(order._id)}
                                                disabled={acceptingId === order._id || order.status !== 'ready'}
                                                style={{ width: '120px', justifyContent: 'center' }}
                                            >
                                                {acceptingId === order._id ? 'Accepting...' : 'Accept Order'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailableOrders;



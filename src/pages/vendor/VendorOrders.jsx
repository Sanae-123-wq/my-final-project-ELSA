import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const VendorOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadVendorOrders();
    }, [user]);

    const loadVendorOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await api.fetchOrders();
            // Mock: Filter orders that supposedly contain this vendor's items
            const myOrders = allOrders.slice(0, 6).map((o, i) => ({
                ...o,
                _id: `ORD_V${900 + i}`,
                customerName: `Client ${i + 1}`,
                phone: `06 11 22 33 0${i}`,
                items: [
                    { name: 'Classic Croissant', qty: 2, price: 3.5 },
                    { name: i % 2 === 0 ? 'Chocolate Eclair' : 'Fruit Tart', qty: 1, price: 4.5 }
                ],
                totalForVendor: 11.50,
                status: i === 0 ? 'pending' : i === 1 ? 'preparing' : 'delivered'
            }));
            
            setOrders(myOrders);
        } catch (err) {
            console.error('Error fetching vendor orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            // Mock update
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            alert(`Order ${orderId} marked as ${newStatus}`);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return <span className="admin-badge badge-neutral">Pending</span>;
            case 'preparing': return <span className="admin-badge badge-warning">Preparing</span>;
            case 'delivered': return <span className="admin-badge badge-success">Delivered</span>;
            default: return <span className="admin-badge badge-neutral">{status}</span>;
        }
    };

    const filteredOrders = orders.filter(o => 
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading orders...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">📦 Customer Orders</h1>
                    <p className="admin-page-subtitle">Manage orders containing your pastry products</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-filters-row">
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        className="admin-input" 
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr>
                                <th>Order Info</th>
                                <th>Customer</th>
                                <th>Your Items</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td>
                                        <div className="order-id-cell">{order._id}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div className="client-name">{order.customerName}</div>
                                        <div className="client-email">📞 {order.phone}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: '2px' }}>
                                                    <span style={{ fontWeight: '600', color: '#B08968' }}>{item.qty}x</span> {item.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#3D2314', marginTop: '6px' }}>Total: {order.totalForVendor.toFixed(2)} MAD</div>
                                    </td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        {order.status === 'pending' && (
                                            <button 
                                                className="admin-btn admin-btn-primary" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button 
                                                className="admin-btn admin-btn-success" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                onClick={() => handleUpdateStatus(order._id, 'ready')}
                                            >
                                                Mark Ready for Pickup
                                            </button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="admin-empty-state"><p>No orders found.</p></div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorOrders;

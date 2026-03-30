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
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch('http://localhost:5000/api/orders/vendor-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            // Map the data to include display-friendly fields
            const mappedOrders = data.map(order => ({
                ...order,
                customerName: order.userId?.name || 'Customer',
                phone: 'N/A', // Update if phone is in model
                items: order.products.map(p => ({
                    name: p.productId?.name || 'Deleted Product',
                    qty: p.quantity,
                    price: p.price
                })),
                totalForVendor: order.totalAmount // In a real app, this would be vendor's share
            }));
            
            setOrders(mappedOrders);
        } catch (err) {
            console.error('Error fetching vendor orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    };

    const getStatusBadge = (status) => {
        const statusClass = `status-${status}`;
        return <span className={`order-status-badge ${statusClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    const filteredOrders = orders.filter(o => 
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--pat-brown)' }}>📦 Customer Orders</h1>
                    <p className="admin-page-subtitle">Manage orders containing your pastry products</p>
                </div>
            </div>

            <div className="admin-card" style={{ borderRadius: 'var(--pat-radius)', boxShadow: 'var(--pat-shadow)' }}>
                <div className="admin-filters-row">
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        className="admin-input" 
                        style={{ maxWidth: '300px', borderRadius: '12px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr style={{ background: 'var(--pat-cream)', borderBottom: '1.5px solid var(--pat-beige)' }}>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Order Info</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Customer</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Your Items</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Status</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid rgba(245, 230, 211, 0.5)' }}>
                                    <td>
                                        <div style={{ fontWeight: '700', color: 'var(--pat-brown)', letterSpacing: '0.02em', fontSize: '0.9rem' }}>#{order._id.substring(0, 8).toUpperCase()}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600', color: 'var(--dark-color)' }}>{order.customerName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>📞 {order.phone}</div>
                                    </td>
                                    <td>
                                        <div>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: '2px', fontSize: '0.85rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--pat-gold)' }}>{item.qty}x</span> {item.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontWeight: '800', color: 'var(--pat-brown)', marginTop: '6px', fontSize: '0.9rem' }}>{order.totalForVendor.toFixed(2)} MAD</div>
                                    </td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <div className="admin-actions">
                                            {order.status === 'pending' && (
                                                <button 
                                                    className="admin-btn-primary" 
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }}
                                                    onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button 
                                                    className="admin-btn-primary" 
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px', background: 'var(--pat-gold)' }}
                                                    onClick={() => handleUpdateStatus(order._id, 'ready')}
                                                >
                                                    Mark Ready
                                                </button>
                                            )}
                                            {order.status === 'ready' && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--pat-gold)', fontWeight: 'bold' }}>Awaiting Pickup</span>
                                            )}
                                            {order.status === 'picked' && (
                                                <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 'bold' }}>Out for Delivery</span>
                                            )}
                                            {order.status === 'delivered' && (
                                                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Completed</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorOrders;

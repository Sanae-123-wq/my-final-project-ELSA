import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { FaSearch, FaShoppingBag, FaUser, FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import './VendorOrders.css';

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

            const updatedBody = await res.json();
            if (!res.ok) throw new Error(updatedBody.message || 'Failed to update status');

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
        <div className="vo-container inner-admin-page">
            <div className="vo-header">
                <div className="vo-title-section">
                    <h1><FaShoppingBag /> Customer Orders</h1>
                    <p>Track and manage your pastry orders in real-time</p>
                </div>
                <div className="vo-search-bar">
                    <FaSearch className="vo-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer..."
                        className="vo-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="vo-card">
                <div className="vo-table-header">
                    <div className="vo-th">Order Info</div>
                    <div className="vo-th">Customer</div>
                    <div className="vo-th">Your Items</div>
                    <div className="vo-th">Status</div>
                    <div className="vo-th">Actions</div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="vo-empty">
                        <span className="vo-empty-icon">📂</span>
                        <h3 className="vo-empty-title">No orders found</h3>
                        <p className="vo-empty-text">When customers buy your products, they will appear here.</p>
                    </div>
                ) : (
                    <div className="vo-table-body">
                        {filteredOrders.map(order => (
                            <div key={order._id} className="vo-row">
                                {/* Order Info */}
                                <div>
                                    <div className="vo-order-id">#{order._id.substring(0, 8).toUpperCase()}</div>
                                    <div className="vo-order-date">
                                        <FaClock style={{ fontSize: '0.7rem', marginRight: '4px' }} />
                                        {new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Customer info */}
                                <div>
                                    <div className="vo-customer-name">
                                        <FaUser style={{ fontSize: '0.8rem', marginRight: '6px', color: 'rgba(92, 64, 51, 0.4)' }} />
                                        {order.customerName}
                                    </div>
                                    <a href={`tel:${order.phone}`} className="vo-customer-contact">
                                        📞 {order.phone !== 'N/A' ? order.phone : 'Contact info hidden'}
                                    </a>
                                </div>

                                {/* Items */}
                                <div>
                                    <div className="vo-items-list">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="vo-item">
                                                <span className="vo-item-qty">{item.qty}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="vo-total">
                                        {order.totalForVendor.toLocaleString()} MAD
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <span className={`vo-badge vo-badge-${order.status}`}>
                                        {order.status === 'ready' && <FaCheckCircle style={{ marginRight: '6px' }} />}
                                        {order.status === 'picked' && <FaTruck style={{ marginRight: '6px' }} />}
                                        {order.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div>
                                    {order.status === 'pending' && (
                                        <button
                                            className="vo-btn vo-btn-primary"
                                            onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                        >
                                            <FaClock /> Start Prep
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            className="vo-btn vo-btn-gold"
                                            onClick={() => handleUpdateStatus(order._id, 'ready')}
                                        >
                                            <FaCheckCircle /> Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.85rem', fontWeight: '800' }}>
                                            <FaMapMarkerAlt /> Awaiting Delivery
                                        </div>
                                    )}
                                    {order.status === 'picked' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.85rem', fontWeight: '800' }}>
                                            <FaTruck /> In Transit
                                        </div>
                                    )}
                                    {order.status === 'delivered' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', fontSize: '0.85rem', fontWeight: '800' }}>
                                            <FaCheckCircle /> Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;



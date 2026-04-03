import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaSearch, FaShoppingBag, FaUser, FaClock, FaBoxOpen, FaInfoCircle, FaMapMarkerAlt, FaHistory, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './AdminOrders.css';

const STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'picked', 'delivered'];
const STATUS_CONFIG = {
    pending:   { label: 'Pending',     cls: 'status-pending' },
    preparing: { label: 'Preparing',   cls: 'status-preparing' },
    ready:     { label: 'Ready',       cls: 'status-ready' },
    picked:    { label: 'Picked Up',   cls: 'status-picked' },
    delivered: { label: 'Delivered',   cls: 'status-delivered' },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        setLoading(true);
        try { 
            const data = await api.fetchOrders();
            setOrders(data); 
        }
        catch (err) { console.error('Error loading orders:', err); }
        finally { setLoading(false); }
    };

    // Note: status update functionality has been removed for Admin role per project policy.

    const filtered = orders.filter(o => {
        const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
        const matchesSearch = !searchQuery ||
            o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const orderCounts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
            <p className="ml-4 font-bold text-brown">Auditing order logs...</p>
        </div>
    );

    return (
        <div className="ao-container inner-admin-page">
            <div className="ao-header">
                <div className="ao-title-section">
                    <h1><FaShoppingBag /> Order Registry</h1>
                    <p>Comprehensive overview of platform order flow and volume</p>
                </div>
            </div>

            {/* Status Navigation */}
            <div className="ao-status-nav thin-scrollbar">
                <button 
                    className={`ao-nav-btn ${filterStatus === 'all' ? 'active' : ''}`} 
                    onClick={() => setFilterStatus('all')}
                >
                    All Orders <span className="ao-count">{orders.length}</span>
                </button>
                {STATUS_OPTIONS.map(s => (
                    <button 
                        key={s} 
                        className={`ao-nav-btn ${filterStatus === s ? 'active' : ''}`} 
                        onClick={() => setFilterStatus(s)}
                    >
                        {STATUS_CONFIG[s].label} <span className="ao-count">{orderCounts[s]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="ao-filters">
                <div className="ao-search-wrap">
                    <FaSearch className="ao-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by ID, Client name or Email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="ao-search-input"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="ao-card">
                <table className="ao-table">
                    <thead>
                        <tr>
                            <th>Ref ID</th>
                            <th>Client Profile</th>
                            <th>Placement Date</th>
                            <th>Volume</th>
                            <th>Revenue</th>
                            <th>Lifecycle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#9CA3AF' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
                                    <h3 style={{ fontWeight: 800, color: '#5C4033' }}>No orders found</h3>
                                    <p>Try adjusting your filters or search terms</p>
                                </td>
                            </tr>
                        ) : filtered.map(order => {
                            const sc = STATUS_CONFIG[order.status] || { label: order.status, cls: 'tag-pending' };
                            const isExpanded = expandedOrder === order._id;
                            
                            return (
                                <>
                                    <tr key={order._id} className={`ao-row ${isExpanded ? 'expanded' : ''}`}>
                                        <td className="ao-td">
                                            <div 
                                                className="ao-order-id"
                                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                            >
                                                #{order._id.slice(-8).toUpperCase()}
                                                <FaInfoCircle style={{ opacity: 0.3 }} />
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <div className="ao-user-info">
                                                <div className="ao-avatar">{order.userId?.name?.charAt(0) || order.user?.name?.charAt(0) || '?'}</div>
                                                <div>
                                                    <div className="ao-username">{order.userId?.name || order.user?.name || 'Guest'}</div>
                                                    <div className="ao-email">{order.userId?.email || order.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4B5563' }}>
                                                <FaClock style={{ marginRight: '6px', opacity: 0.4 }} />
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <div style={{ fontWeight: 700, color: '#5C4033' }}>
                                                {(order.products?.length || order.items?.length || 0)} <span style={{fontSize: '0.75rem', color: '#9CA3AF'}}>Items</span>
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <div className="ao-total-val">
                                                {(order.totalAmount || order.totalPrice || 0).toLocaleString()} <span style={{fontSize: '0.7rem'}}>MAD</span>
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <span className={`ao-status-tag tag-${order.status}`}>
                                                {order.status === 'delivered' ? <FaCheckCircle /> : <FaHistory />}
                                                {sc.label}
                                            </span>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr key={`${order._id}-detail`}>
                                            <td colSpan="6" className="ao-detail-cell">
                                                <div className="ao-detail-content">
                                                    <div className="ao-detail-section">
                                                        <h4><FaMapMarkerAlt /> Delivery Logistics</h4>
                                                        <div style={{ padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid rgba(139,94,60,0.1)', fontSize: '0.95rem' }}>
                                                            {order.deliveryAddress || 'Standard Boutique Pickup'}
                                                        </div>
                                                        
                                                        <div style={{ marginTop: '1.5rem' }}>
                                                            <h4><FaUser /> Fulfillment Assignment</h4>
                                                            <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>
                                                                {order.deliveryId ? `👤 Assigned Delivery ID: ${order.deliveryId.slice(-8)}` : '⌛ Awaiting "Ready" state for assignment'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ao-detail-section">
                                                        <h4><FaBoxOpen /> Full Manifest</h4>
                                                        <div className="ao-manifest-list">
                                                            {(order.products || order.items || []).map((item, i) => (
                                                                <div key={i} className="ao-item-row">
                                                                    <span>
                                                                        <span className="ao-item-qty">{item.quantity || item.qty}x</span>
                                                                        {item.productId?.name || item.name}
                                                                    </span>
                                                                    <span style={{fontWeight: 700}}>{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)} MAD</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>

                {/* Platform Policy Alert */}
                <div style={{ padding: '0 2rem 2rem' }}>
                    <div className="ao-policy-alert">
                        <FaExclamationTriangle className="ao-policy-icon" />
                        <div className="ao-policy-text">
                            <strong>Platform Governance:</strong> Order status management is decentralized. 
                            Progress from "Preparing" to "Ready" is handled by Vendors, while "Picked Up" and "Delivered" 
                            states are managed exclusively by designated Delivery Workers.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;



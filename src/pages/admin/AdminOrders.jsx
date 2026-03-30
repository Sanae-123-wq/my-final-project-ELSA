import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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
        try { setOrders(await api.fetchOrders()); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.updateOrderStatus(id, newStatus);
            loadOrders();
        } catch (err) { console.error(err); }
    };

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

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading orders...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Manage Orders</h1>
                    <p className="admin-page-subtitle">{orders.length} total orders</p>
                </div>
            </div>

            {/* Status summary pills */}
            <div className="order-status-pills">
                <button className={`status-pill ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                    All <span className="pill-count">{orders.length}</span>
                </button>
                {STATUS_OPTIONS.map(s => (
                    <button key={s} className={`status-pill status-pill-${s.replace('_','-')} ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                        {STATUS_CONFIG[s].label} <span className="pill-count">{orderCounts[s]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="admin-filters-row" style={{ marginBottom: '1rem' }}>
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by order ID or client name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr style={{ background: 'var(--pat-cream)', borderBottom: '1.5px solid var(--pat-beige)' }}>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Order ID</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Client</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Date</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Items</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Total</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Status</th>
                                <th style={{ color: 'var(--pat-brown)', fontWeight: '700' }}>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" className="admin-table-empty">No orders found.</td></tr>
                            ) : filtered.map(order => {
                                const sc = STATUS_CONFIG[order.status] || { label: order.status, cls: 'badge-neutral' };
                                const isExpanded = expandedOrder === order._id;
                                return (
                                    <>
                                        <tr key={order._id} className={isExpanded ? 'row-expanded' : ''}>
                                            <td>
                                                <button
                                                    className="order-id-btn"
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                >
                                                    #{order._id.slice(-6).toUpperCase()}
                                                    <span>{isExpanded ? ' ▲' : ' ▼'}</span>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="client-cell">
                                                    <div className="client-avatar">{order.user?.name?.charAt(0) || '?'}</div>
                                                    <div>
                                                        <div className="client-name">{order.user?.name || '—'}</div>
                                                        <div className="client-email">{order.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="date-cell">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                                            <td>{order.products?.length || order.items?.length || 0} items</td>
                                            <td className="price-cell" style={{ fontWeight: '800', color: 'var(--pat-brown)' }}>{order.totalAmount?.toFixed(2) || order.totalPrice?.toFixed(2)} MAD</td>
                                            <td><span className={`order-status-badge ${sc.cls}`}>{sc.label}</span></td>
                                            <td>
                                                <select
                                                    className="admin-select-sm"
                                                    value={order.status}
                                                    onChange={e => handleStatusChange(order._id, e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map(s => (
                                                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr key={`${order._id}-detail`} className="order-detail-row">
                                                <td colSpan="7">
                                                    <div className="order-detail-panel">
                                                        <div className="order-detail-section">
                                                            <strong>📍 Delivery Address:</strong> {order.deliveryAddress || 'N/A'}
                                                        </div>
                                                        <div className="order-detail-section">
                                                            <strong>🛒 Order Items:</strong>
                                                            <div className="order-items-grid">
                                                                {order.items?.map((item, i) => (
                                                                    <div key={i} className="order-item-chip">
                                                                        {item.name} × {item.qty} — ${(item.price * item.qty).toFixed(2)}
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
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

const VendorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ revenue: 0, netEarnings: 0, activeProducts: 0, totalOrders: 0, pendingProducts: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In reality, this would be an endpoint specifically returning vendor stats
                const allOrders = await api.fetchOrders();
                const allProducts = await api.fetchProducts();

                // Mock calculations as if the backend resolved these
                const myProducts = allProducts.filter(p => p.vendorId === user?._id || p.category === 'Pastry'); // fallback mock logic
                const activeMyProducts = myProducts.filter(p => p.approvalStatus !== 'pending' && p.approvalStatus !== 'rejected');
                const pendingMyProducts = myProducts.filter(p => p.approvalStatus === 'pending');
                
                // Mock order metrics
                const revenue = 8450;
                const netEarnings = revenue * 0.9; // 10% fee
                
                setStats({
                    revenue,
                    netEarnings,
                    activeProducts: activeMyProducts.length || 5, // mock fallback
                    pendingProducts: pendingMyProducts.length || 2,
                    totalOrders: 142
                });

                // Mock recent orders
                const myOrders = allOrders.slice(0, 4).map((o, idx) => ({
                    ...o,
                    customerName: `Client ${idx + 1}`,
                    items: o.items || [{ name: 'Croissant', qty: 2 }],
                    total: o.totalPrice || 150
                }));
                setRecentOrders(myOrders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading your kitchen...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Bienvenue, Patissier {user?.name?.split(' ')[0] || 'Chef'}! 🌾</h1>
                    <p className="admin-page-subtitle">Here is an overview of your patisserie sales and performance.</p>
                </div>
                <Link to="/vendor/add-product" className="admin-btn admin-btn-primary">+ Create New Pastry</Link>
            </div>

            {/* Dashboard Stats */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-revenue">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Net Earnings (After 10% Fee)</div>
                        <div className="stat-card-value">{stats.netEarnings.toFixed(2)} MAD</div>
                        <div className="stat-card-trend trend-up">Gross: {stats.revenue} MAD</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">💰</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-orders">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Orders</div>
                        <div className="stat-card-value">{stats.totalOrders}</div>
                        <div className="stat-card-trend trend-up">↑ 12% from last month</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">📦</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-products">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Active Products</div>
                        <div className="stat-card-value">{stats.activeProducts}</div>
                        <div className="stat-card-trend trend-neutral">{stats.pendingProducts} pending approval</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">🥐</div>
                    </div>
                </div>
            </div>

            <div className="admin-bottom-row">
                <div className="admin-card admin-card-orders">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Recent Orders</h3>
                        <Link to="/vendor/orders" className="admin-card-link">View All →</Link>
                    </div>
                    <div className="admin-table-wrap">
                        {recentOrders.length === 0 ? (
                            <div className="admin-empty-state"><p>No orders yet.</p></div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Your Items</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td className="order-id-cell">{order._id.substring(0, 8)}</td>
                                            <td>{order.customerName}</td>
                                            <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                                {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                                            </td>
                                            <td>
                                                <span className={`admin-badge badge-${order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'neutral' : 'warning'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: '600', color: '#3D2314' }}>{order.total} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="admin-card admin-card-activity">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                        <Link to="/vendor/add-product" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'center' }}>
                            ➕ Add New Product
                        </Link>
                        <Link to="/vendor/earnings" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'center' }}>
                            📊 View Earnings Report
                        </Link>
                        <Link to="/vendor/products" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'center' }}>
                            👀 Review Pending Approvals
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;

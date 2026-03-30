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
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

                // Fetch vendor's own orders from dedicated endpoint
                const ordersRes = await fetch('http://localhost:5000/api/orders/vendor-orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const allOrders = await ordersRes.json();

                const allProducts = await api.fetchProducts();

                // Filter products that belong to this vendor
                const myProducts = allProducts.filter(p =>
                    p.vendorId?.toString() === user?._id?.toString()
                );
                const activeMyProducts = myProducts.filter(p => p.approvalStatus === 'approved' || !p.approvalStatus);
                const pendingMyProducts = myProducts.filter(p => p.approvalStatus === 'pending');

                // Calculate real revenue from orders
                const revenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                const netEarnings = revenue * 0.9; // 10% platform fee

                setStats({
                    revenue,
                    netEarnings,
                    activeProducts: activeMyProducts.length,
                    pendingProducts: pendingMyProducts.length,
                    totalOrders: allOrders.length
                });

                // Show recent orders with real data
                const myOrders = allOrders.slice(0, 4).map(o => ({
                    ...o,
                    customerName: o.userId?.name || 'Customer',
                    items: o.products?.map(p => ({ name: p.productId?.name || 'Item', qty: p.quantity })) || [],
                    total: o.totalAmount || 0
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

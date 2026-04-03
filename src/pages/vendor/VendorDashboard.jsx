import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';
import { FaCoins, FaBox, FaConciergeBell, FaPlus, FaArrowRight, FaChartLine, FaHistory, FaTools, FaFileInvoiceDollar } from 'react-icons/fa';
import './VendorDashboard.css';

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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
            <p className="ml-4 font-bold text-brown">Heating up the ovens...</p>
        </div>
    );

    return (
        <div className="vd-container inner-admin-page">
            <div className="vd-header">
                <div className="vd-welcome">
                    <h1>Bienvenue, Chef {user?.name?.split(' ')[0] || 'Patissier'}! 👨‍🍳</h1>
                    <p>Here's a curated look at your boutique's performance this week.</p>
                </div>
                <Link to="/vendor/add-product" className="vd-cta-btn">
                    <FaPlus /> New Creation
                </Link>
            </div>

            {/* Premium Stat Cards */}
            <div className="vd-stats-grid">
                <div className="vd-stat-card">
                    <div className="vd-stat-info">
                        <div className="vd-stat-label">Net Revenue</div>
                        <div className="vd-stat-value">{stats.netEarnings.toLocaleString()} MAD</div>
                        <div className="vd-stat-trend vd-trend-up">
                            <FaChartLine /> After 10% platform fee
                        </div>
                    </div>
                    <div className="vd-stat-icon-box">
                        <FaCoins />
                    </div>
                </div>

                <div className="vd-stat-card">
                    <div className="vd-stat-info">
                        <div className="vd-stat-label">Total Orders</div>
                        <div className="vd-stat-value">{stats.totalOrders}</div>
                        <div className="vd-stat-trend vd-trend-up">
                            <FaChartLine /> ↑ 12% vs last month
                        </div>
                    </div>
                    <div className="vd-stat-icon-box">
                        <FaBox />
                    </div>
                </div>

                <div className="vd-stat-card">
                    <div className="vd-stat-info">
                        <div className="vd-stat-label">Boutique Catalog</div>
                        <div className="vd-stat-value">{stats.activeProducts}</div>
                        <div className="vd-stat-trend vd-trend-neutral">
                            {stats.pendingProducts} awaiting approval
                        </div>
                    </div>
                    <div className="vd-stat-icon-box">
                        <FaConciergeBell />
                    </div>
                </div>
            </div>

            <div className="vd-main-grid">
                {/* Recent Orders Panel */}
                <div className="vd-panel">
                    <div className="vd-panel-header">
                        <h3 className="vd-panel-title"><FaHistory /> Recent Requests</h3>
                        <Link to="/vendor/orders" className="vd-panel-link">Explore all orders →</Link>
                    </div>
                    <div className="vd-panel-body">
                        {recentOrders.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                                <p>No orders yet. Your first client is just around the corner!</p>
                            </div>
                        ) : (
                            <table className="vd-recent-table">
                                <thead>
                                    <tr>
                                        <th>Ref</th>
                                        <th>Client</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td><span className="vd-order-id">#{order._id.substring(0, 6).toUpperCase()}</span></td>
                                            <td style={{ fontWeight: 700 }}>{order.customerName}</td>
                                            <td>
                                                <span className={`vd-badge vd-badge-${order.status === 'delivered' ? 'delivered' : order.status === 'pending' ? 'pending' : 'warning'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 800 }}>{order.total} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="vd-panel">
                    <div className="vd-panel-header">
                        <h3 className="vd-panel-title"><FaTools /> Kitchen Tools</h3>
                    </div>
                    <div className="vd-actions-list">
                        <Link to="/vendor/add-product" className="vd-action-btn">
                            <div className="vd-action-icon"><FaPlus /></div>
                            <div className="vd-action-text">
                                <span className="vd-action-title">Add Product</span>
                                <span className="vd-action-desc">Publish a new recipe</span>
                            </div>
                            <FaArrowRight style={{ fontSize: '0.8rem', color: '#E5E7EB' }} />
                        </Link>

                        <Link to="/vendor/earnings" className="vd-action-btn">
                            <div className="vd-action-icon"><FaFileInvoiceDollar /></div>
                            <div className="vd-action-text">
                                <span className="vd-action-title">Earnings</span>
                                <span className="vd-action-desc">Financial statements</span>
                            </div>
                            <FaArrowRight style={{ fontSize: '0.8rem', color: '#E5E7EB' }} />
                        </Link>

                        <Link to="/vendor/products" className="vd-action-btn">
                            <div className="vd-action-icon"><FaConciergeBell /></div>
                            <div className="vd-action-text">
                                <span className="vd-action-title">Pending Items</span>
                                <span className="vd-action-desc">Admin review status</span>
                            </div>
                            <FaArrowRight style={{ fontSize: '0.8rem', color: '#E5E7EB' }} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;

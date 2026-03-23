import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simple bar chart component (no external library needed)
const BarChart = ({ data, color = '#B08968', label }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="admin-chart-wrap">
            <div className="admin-bar-chart">
                {data.map((d, i) => (
                    <div key={i} className="admin-bar-col">
                        <div className="admin-bar-value">{d.value}</div>
                        <div
                            className="admin-bar"
                            style={{ height: `${(d.value / max) * 100}%`, background: color }}
                            title={`${d.label}: ${d.value}`}
                        ></div>
                        <div className="admin-bar-label">{d.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Mini sparkline
const Sparkline = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = 32;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0, clients: 0, vendors: 0, delivery: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);

    const monthlySales = [
        { label: 'Jan', value: 42 }, { label: 'Feb', value: 78 }, { label: 'Mar', value: 55 },
        { label: 'Apr', value: 91 }, { label: 'May', value: 67 }, { label: 'Jun', value: 103 },
        { label: 'Jul', value: 88 }, { label: 'Aug', value: 115 }, { label: 'Sep', value: 94 },
        { label: 'Oct', value: 128 }, { label: 'Nov', value: 142 }, { label: 'Dec', value: 167 },
    ];
    const monthlyRevenue = [
        { label: 'Jan', value: 1240 }, { label: 'Feb', value: 2180 }, { label: 'Mar', value: 1650 },
        { label: 'Apr', value: 2900 }, { label: 'May', value: 2100 }, { label: 'Jun', value: 3200 },
        { label: 'Jul', value: 2750 }, { label: 'Aug', value: 3600 }, { label: 'Sep', value: 2950 },
        { label: 'Oct', value: 3900 }, { label: 'Nov', value: 4200 }, { label: 'Dec', value: 5100 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [products, users, orders] = await Promise.all([
                    api.fetchProducts(), api.fetchUsers(), api.fetchOrders()
                ]);
                const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                setStats({
                    products: products.length,
                    users: users.filter(u => u.role === 'client').length,
                    orders: orders.length,
                    revenue: revenue.toFixed(2),
                    clients: users.filter(u => u.role === 'client').length,
                    vendors: users.filter(u => u.role === 'vendor').length,
                    delivery: users.filter(u => u.role === 'delivery').length,
                });
                setRecentOrders(orders.slice(-5).reverse());
                setActivityLog(api.getActivityLog().slice(0, 6));
            } catch (error) {
                console.error('Dashboard error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statusConfig = {
        pending: { label: 'Pending', cls: 'badge-warning' },
        processing: { label: 'Processing', cls: 'badge-info' },
        out_for_delivery: { label: 'Out for Delivery', cls: 'badge-primary' },
        delivered: { label: 'Delivered', cls: 'badge-success' },
    };

    if (loading) return (
        <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard Overview</h1>
                    <p className="admin-page-subtitle">Welcome back! Here's what's happening at ELSA Pâtisserie.</p>
                </div>
                <div className="admin-page-date">
                    📅 {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-orders">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Orders</div>
                        <div className="stat-card-value">{stats.orders}</div>
                        <div className="stat-card-trend trend-up">↑ 12% this month</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">📦</div>
                        <Sparkline data={[3,7,5,11,8,14,10,16]} color="#B08968" />
                    </div>
                </div>
                <div className="admin-stat-card stat-revenue">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Revenue</div>
                        <div className="stat-card-value">${Number(stats.revenue).toLocaleString()}</div>
                        <div className="stat-card-trend trend-up">↑ 8.5% this month</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">💰</div>
                        <Sparkline data={[1200,2100,1600,2900,2100,3200,2750,3600]} color="#7F5539" />
                    </div>
                </div>
                <div className="admin-stat-card stat-clients">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Clients</div>
                        <div className="stat-card-value">{stats.clients}</div>
                        <div className="stat-card-trend trend-up">↑ 3 new this week</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">👥</div>
                        <Sparkline data={[1,2,2,3,3,4,4,5]} color="#CCD5AE" />
                    </div>
                </div>
                <div className="admin-stat-card stat-products">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Products</div>
                        <div className="stat-card-value">{stats.products}</div>
                        <div className="stat-card-trend trend-neutral">— No change</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">🥐</div>
                        <Sparkline data={[12,12,13,14,14,15,15,15]} color="#E6CCB2" />
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="admin-charts-row">
                <div className="admin-card admin-card-lg">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Monthly Orders</h3>
                        <span className="admin-card-badge">2025</span>
                    </div>
                    <BarChart data={monthlySales} color="#B08968" />
                </div>
                <div className="admin-card admin-card-sm">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Revenue (MAD)</h3>
                        <span className="admin-card-badge">2025</span>
                    </div>
                    <BarChart data={monthlyRevenue} color="#7F5539" />
                </div>
            </div>

            {/* Bottom Row: Recent Orders + Activity Log */}
            <div className="admin-bottom-row">
                {/* Recent Orders */}
                <div className="admin-card admin-card-orders">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Recent Orders</h3>
                        <Link to="/admin/orders" className="admin-card-link">View All →</Link>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Client</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan="4" className="admin-table-empty">No orders yet.</td></tr>
                                ) : recentOrders.map(order => {
                                    const sc = statusConfig[order.status] || { label: order.status, cls: 'badge-neutral' };
                                    return (
                                        <tr key={order._id}>
                                            <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td>{order.user?.name || '—'}</td>
                                            <td className="font-semibold">${order.totalPrice?.toFixed(2)}</td>
                                            <td><span className={`admin-badge ${sc.cls}`}>{sc.label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="admin-card admin-card-activity">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Activity Log</h3>
                        <Link to="/admin/activity" className="admin-card-link">View All →</Link>
                    </div>
                    <div className="activity-list">
                        {activityLog.length === 0 ? (
                            <p className="admin-empty-text">No recent activity.</p>
                        ) : activityLog.map((log, i) => (
                            <div key={i} className="activity-item">
                                <div className={`activity-dot dot-${log.type}`}></div>
                                <div className="activity-content">
                                    <div className="activity-text">{log.action}</div>
                                    <div className="activity-time">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="admin-quick-stats">
                        <div className="quick-stat">
                            <span className="quick-stat-icon">👨‍🍳</span>
                            <div>
                                <div className="quick-stat-value">{stats.vendors}</div>
                                <div className="quick-stat-label">Vendors</div>
                            </div>
                        </div>
                        <div className="quick-stat">
                            <span className="quick-stat-icon">🚚</span>
                            <div>
                                <div className="quick-stat-value">{stats.delivery}</div>
                                <div className="quick-stat-label">Delivery</div>
                            </div>
                        </div>
                        <div className="quick-stat">
                            <span className="quick-stat-icon">🛒</span>
                            <div>
                                <div className="quick-stat-value">{stats.orders}</div>
                                <div className="quick-stat-label">Orders</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

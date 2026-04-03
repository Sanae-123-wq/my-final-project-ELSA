import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FaChartBar, FaUsers, FaShoppingBag, FaDollarSign, FaBox, FaArrowUp, FaArrowRight, FaCalendarAlt, FaHistory, FaCheckCircle, FaUserShield, FaBicycle, FaUtensils } from 'react-icons/fa';
import './AdminDashboard.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simple bar chart component (no external library needed)
const PremiumBarChart = ({ data, color = '#D97706' }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="ad-chart-container thin-scrollbar">
            {data.map((d, i) => {
                const height = (d.value / max) * 100;
                return (
                    <div key={i} className="ad-chart-bar-wrap">
                        <div 
                            className="ad-chart-bar" 
                            style={{ 
                                height: `${height}%`, 
                                background: `linear-gradient(to top, ${color}, ${color}CC)`,
                                boxShadow: i % 2 === 0 ? '0 4px 15px rgba(217,119,6,0.1)' : 'none'
                            }}
                            title={`${d.label}: ${d.value}`}
                        >
                            <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800, color: '#5C4033' }}>
                                {d.value > 1000 ? `${(d.value/1000).toFixed(1)}k` : d.value}
                            </div>
                        </div>
                        <div className="ad-chart-label">{d.label}</div>
                    </div>
                );
            })}
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
                const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.totalPrice || 0), 0);
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
        pending:   { label: 'Pending',   cls: 'status-pending' },
        preparing: { label: 'Preparing', cls: 'status-preparing' },
        ready:     { label: 'Ready',     cls: 'status-ready' },
        picked:    { label: 'Picked Up', cls: 'status-picked' },
        delivered: { label: 'Delivered', cls: 'status-delivered' },
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
            <p className="ml-4 font-bold text-brown text-xl">Initializing Admin Intelligence...</p>
        </div>
    );

    return (
        <div className="ad-container inner-admin-page">
            <div className="ad-header">
                <div className="ad-title-group">
                    <h1>Admin Pulse</h1>
                    <p>Orchestrating platform performance and ecosystem growth</p>
                </div>
                <div className="ad-date-badge">
                    <FaCalendarAlt /> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="ad-stats-grid">
                <div className="ad-stat-card stat-rev">
                    <div className="ad-stat-content">
                        <h4>Platform Revenue</h4>
                        <div className="ad-stat-value">{Number(stats.revenue).toLocaleString()} <span style={{fontSize: '1rem'}}>MAD</span></div>
                        <div className="ad-trend trend-up"><FaArrowUp /> 8.4% growth</div>
                    </div>
                    <div className="ad-stat-visual">
                        <div className="ad-icon-box"><FaDollarSign /></div>
                        <Sparkline data={[1200,2100,1600,2900,2100,3200,2750,3600]} color="#D97706" />
                    </div>
                </div>

                <div className="ad-stat-card stat-ord">
                    <div className="ad-stat-content">
                        <h4>Total Orders</h4>
                        <div className="ad-stat-value">{stats.orders}</div>
                        <div className="ad-trend trend-up"><FaArrowUp /> 12.2% growth</div>
                    </div>
                    <div className="ad-stat-visual">
                        <div className="ad-icon-box"><FaShoppingBag /></div>
                        <Sparkline data={[3,7,5,11,8,14,10,16]} color="#16A34A" />
                    </div>
                </div>

                <div className="ad-stat-card stat-usr">
                    <div className="ad-stat-content">
                        <h4>Active Clients</h4>
                        <div className="ad-stat-value">{stats.clients}</div>
                        <div className="ad-trend trend-neutral">Stably scaled</div>
                    </div>
                    <div className="ad-stat-visual">
                        <div className="ad-icon-box"><FaUsers /></div>
                        <Sparkline data={[1,2,2,3,3,4,4,5]} color="#2563EB" />
                    </div>
                </div>

                <div className="ad-stat-card stat-prd">
                    <div className="ad-stat-content">
                        <h4>Catalog Size</h4>
                        <div className="ad-stat-value">{stats.products}</div>
                        <div className="ad-trend trend-neutral">Quality focused</div>
                    </div>
                    <div className="ad-stat-visual">
                        <div className="ad-icon-box"><FaBox /></div>
                        <Sparkline data={[12,12,13,14,14,15,15,15]} color="#DC2626" />
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="ad-main-grid">
                <div className="ad-panel">
                    <div className="ad-panel-header">
                        <div className="ad-panel-title"><FaChartBar /> Order Velocity</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D97706' }}>LAST 12 MONTHS</div>
                    </div>
                    <PremiumBarChart data={monthlySales} color="#5C4033" />
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-header">
                        <div className="ad-panel-title"><FaHistory /> Platform Activity</div>
                        <Link to="/admin/activity" style={{ color: '#D97706', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Live Logs</Link>
                    </div>
                    <div className="ad-list">
                        {activityLog.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No recent activity alerts.</p>
                        ) : activityLog.map((log, i) => (
                            <div key={i} className="ad-list-item">
                                <div className="ad-list-icon">
                                    {log.type === 'order' ? '🛒' : log.type === 'login' ? '👤' : '🛠️'}
                                </div>
                                <div className="ad-list-info">
                                    <div className="ad-list-primary">{log.action}</div>
                                    <div className="ad-list-secondary">{log.time} • by {log.by}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="ad-actions-grid">
                        <Link to="/admin/users" className="ad-action-card">
                            <FaUserShield className="ad-action-btn-icon" />
                            <span className="ad-action-label">User Rights</span>
                        </Link>
                        <Link to="/admin/products" className="ad-action-card">
                            <FaUtensils className="ad-action-btn-icon" />
                            <span className="ad-action-label">Catalog</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Orders Flow */}
            <div className="ad-panel">
                <div className="ad-panel-header">
                    <div className="ad-panel-title"><FaShoppingBag /> Distribution Stream</div>
                    <Link to="/admin/orders" className="ad-date-badge" style={{ textDecoration: 'none', color: '#D97706', border: 'none' }}>Full Log <FaArrowRight /></Link>
                </div>
                <div className="ao-card" style={{ boxShadow: 'none', border: 'none' }}>
                    <table className="ao-table">
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Client</th>
                                <th>Revenue</th>
                                <th>Flow Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => {
                                const sc = statusConfig[order.status] || { label: order.status, cls: 'tag-pending' };
                                return (
                                    <tr key={order._id} className="ao-row">
                                        <td className="ao-td">
                                            <div className="ao-order-id">#{order._id.slice(-8).toUpperCase()}</div>
                                        </td>
                                        <td className="ao-td">
                                            <div className="ao-username">{order.user?.name || 'Guest'}</div>
                                        </td>
                                        <td className="ao-td">
                                            <div className="ad-list-value">{(order.totalAmount || order.totalPrice)?.toFixed(2)} MAD</div>
                                        </td>
                                        <td className="ao-td">
                                            <span className={`ao-status-tag tag-${order.status}`}>
                                                {order.status === 'delivered' ? <FaCheckCircle /> : <FaHistory />}
                                                {sc.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Ecosystem Breakdown */}
                <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px dashed rgba(139,94,60,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="ad-icon-box" style={{ background: '#FFF7ED', color: '#D97706' }}><FaUtensils /></div>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5C4033' }}>{stats.vendors}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF' }}>GOURMET VENDORS</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="ad-icon-box" style={{ background: '#F0FDF4', color: '#16A34A' }}><FaBicycle /></div>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5C4033' }}>{stats.delivery}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF' }}>LOGISTICS STAFF</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="ad-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}><FaShoppingBag /></div>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5C4033' }}>{stats.orders}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF' }}>SYSTEM ORDERS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;



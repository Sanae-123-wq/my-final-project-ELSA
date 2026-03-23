import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

const DeliveryDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayDeliveries: 0,
        activeOrders: 0,
        todayEarnings: 0,
        rating: 4.8
    });
    const [recentDeliveries, setRecentDeliveries] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // In a real app, this would be a specific endpoint for the delivery worker's dashboard
            const allOrders = await api.fetchOrders();
            
            // Mock data processing for the dashboard
            const myOrders = allOrders.filter(o => o.deliveryWorkerId === user?._id);
            const active = allOrders.filter(o => o.status === 'out_for_delivery' && o.deliveryWorkerId === user?._id);
            const today = myOrders.filter(o => o.status === 'delivered'); // Mocking today's completed
            
            setStats({
                todayDeliveries: today.length || 5, // fallback to mock data if empty
                activeOrders: active.length || 2,
                todayEarnings: (today.length || 5) * 15, // Mock 15 MAD per delivery
                rating: 4.9
            });
            
            setRecentDeliveries(myOrders.slice(0, 4));
        } catch (err) {
            console.error('Error loading dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading overview...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Welcome back, {user?.name?.split(' ')[0] || 'Livreur'}! 👋</h1>
                    <p className="admin-page-subtitle">Here's your delivery overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="admin-page-date">
                    <span className="admin-badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>🟢 Online & Ready</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-orders">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Today's Deliveries</div>
                        <div className="stat-card-value">{stats.todayDeliveries}</div>
                        <div className="stat-card-trend trend-up">↑ 2 more than yesterday</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">📦</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-revenue">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Today's Earnings</div>
                        <div className="stat-card-value">{stats.todayEarnings} MAD</div>
                        <div className="stat-card-trend trend-up">Estimated</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">💵</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-clients">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Active Orders</div>
                        <div className="stat-card-value">{stats.activeOrders}</div>
                        <div className="stat-card-trend trend-neutral">Currently assigned</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">🛵</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-products">
                    <div className="stat-card-left">
                        <div className="stat-card-label">My Rating</div>
                        <div className="stat-card-value">⭐ {stats.rating}</div>
                        <div className="stat-card-trend trend-up">Based on 42 reviews</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">⭐</div>
                    </div>
                </div>
            </div>

            <div className="admin-bottom-row">
                {/* Active Deliveries Quick View */}
                <div className="admin-card admin-card-orders">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Current Deliveries</h3>
                        <Link to="/delivery/active" className="admin-card-link">View Map →</Link>
                    </div>
                    <div className="admin-table-wrap">
                        {stats.activeOrders === 0 ? (
                            <div className="admin-empty-state" style={{ padding: '2rem' }}>
                                <div className="empty-icon" style={{ fontSize: '2rem' }}>🛵</div>
                                <p>No active deliveries right now.</p>
                                <Link to="/delivery/available" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>Find Orders</Link>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Destination</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="order-detail-row">
                                        <td className="order-id-cell">ORD_882</td>
                                        <td>
                                            <div className="client-name">Sarah M.</div>
                                            <div className="client-email">06 12 34 56 78</div>
                                        </td>
                                        <td>
                                            <div className="client-name">Quartier Hassan</div>
                                            <div className="client-email">12 Rue de la Liberté, Rabat</div>
                                        </td>
                                        <td><span className="admin-badge badge-warning">On the way</span></td>
                                    </tr>
                                    <tr className="order-detail-row">
                                        <td className="order-id-cell">ORD_885</td>
                                        <td>
                                            <div className="client-name">Karim B.</div>
                                            <div className="client-email">06 98 76 54 32</div>
                                        </td>
                                        <td>
                                            <div className="client-name">Agdal</div>
                                            <div className="client-email">Avenue de France, Rabat</div>
                                        </td>
                                        <td><span className="admin-badge badge-primary">Picked Up</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Performance Goal */}
                <div className="admin-card admin-card-activity">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Daily Goal</h3>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#B08968', lineHeight: '1' }}>{stats.todayDeliveries} <span style={{ fontSize: '1.5rem', color: '#9ca3af' }}>/ 10</span></div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>deliveries completed today</div>
                        </div>
                        <div className="breakdown-bar-bg" style={{ height: '12px', background: '#F0EBE3' }}>
                            <div 
                                className="breakdown-bar-fill" 
                                style={{ width: `${Math.min((stats.todayDeliveries / 10) * 100, 100)}%`, background: 'linear-gradient(90deg, #E6CCB2, #B08968)' }}
                            ></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', marginTop: '1rem' }}>
                            {10 - stats.todayDeliveries > 0 
                                ? `${10 - stats.todayDeliveries} more deliveries to reach your daily bonus!` 
                                : 'Daily goal reached! Great job! 🎉'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;

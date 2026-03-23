const AdminAnalytics = () => {
    const monthlyOrders = [42, 78, 55, 91, 67, 103, 88, 115, 94, 128, 142, 167];
    const monthlyRevenue = [1240, 2180, 1650, 2900, 2100, 3200, 2750, 3600, 2950, 3900, 4200, 5100];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const maxOrders = Math.max(...monthlyOrders);
    const maxRevenue = Math.max(...monthlyRevenue);

    const categoryData = [
        { label: 'Pastry', value: 45, color: '#B08968' },
        { label: 'Cake', value: 30, color: '#7F5539' },
        { label: 'Traditional', value: 25, color: '#CCD5AE' },
    ];

    const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
    const totalOrders = monthlyOrders.reduce((a, b) => a + b, 0);
    const avgOrder = (totalRevenue / totalOrders).toFixed(2);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Analytics</h1>
                    <p className="admin-page-subtitle">Sales performance and revenue insights for 2025</p>
                </div>
                <div className="admin-page-date">📅 2025 Overview</div>
            </div>

            {/* KPI Cards */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card stat-revenue">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Annual Revenue</div>
                        <div className="stat-card-value">${totalRevenue.toLocaleString()}</div>
                        <div className="stat-card-trend trend-up">↑ 34% vs last year</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">💰</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-orders">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Total Orders (2025)</div>
                        <div className="stat-card-value">{totalOrders.toLocaleString()}</div>
                        <div className="stat-card-trend trend-up">↑ 22% vs last year</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">📦</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-clients">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Avg. Order Value</div>
                        <div className="stat-card-value">${avgOrder}</div>
                        <div className="stat-card-trend trend-up">↑ 8% vs last year</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-icon">📊</div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="admin-charts-row">
                {/* Monthly Orders Chart */}
                <div className="admin-card admin-card-lg">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Monthly Orders — 2025</h3>
                    </div>
                    <div className="analytics-chart-container">
                        <div className="analytics-bar-chart">
                            {monthlyOrders.map((v, i) => (
                                <div key={i} className="analytics-bar-col">
                                    <div className="analytics-bar-value">{v}</div>
                                    <div
                                        className="analytics-bar analytics-bar-primary"
                                        style={{ height: `${(v / maxOrders) * 160}px` }}
                                        title={`${months[i]}: ${v} orders`}
                                    ></div>
                                    <div className="analytics-bar-label">{months[i]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="admin-card admin-card-sm">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Sales by Category</h3>
                    </div>
                    <div className="category-breakdown">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="category-breakdown-item">
                                <div className="breakdown-label-row">
                                    <span className="breakdown-label">{cat.label}</span>
                                    <span className="breakdown-pct">{cat.value}%</span>
                                </div>
                                <div className="breakdown-bar-bg">
                                    <div
                                        className="breakdown-bar-fill"
                                        style={{ width: `${cat.value}%`, background: cat.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <div className="category-legend">
                            {categoryData.map((cat, i) => (
                                <div key={i} className="legend-item">
                                    <div className="legend-dot" style={{ background: cat.color }}></div>
                                    <span>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Monthly Revenue — 2025 (MAD)</h3>
                </div>
                <div className="analytics-chart-container">
                    <div className="analytics-bar-chart">
                        {monthlyRevenue.map((v, i) => (
                            <div key={i} className="analytics-bar-col">
                                <div className="analytics-bar-value" style={{ fontSize: '0.65rem' }}>${v.toLocaleString()}</div>
                                <div
                                    className="analytics-bar analytics-bar-secondary"
                                    style={{ height: `${(v / maxRevenue) * 160}px` }}
                                    title={`${months[i]}: $${v}`}
                                ></div>
                                <div className="analytics-bar-label">{months[i]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;

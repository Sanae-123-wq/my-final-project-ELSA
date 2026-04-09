import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const VendorEarnings = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [daysFilter, setDaysFilter] = useState(30);
    const [loading, setLoading] = useState(true);

    const PLATFORM_FEE_PCT = 0.10; // 10%

    useEffect(() => {
        const fetchOrdersForEarnings = async () => {
            setLoading(true);
            try {
                // In a real app we fetch only orders that contain this vendor's items
                const allOrders = await api.fetchOrders();
                
                // Determine how many rows to generate based on filter
                const rowCount = daysFilter === 'all' ? 20 : Math.min(daysFilter, 15);
                
                // Mock expansion to show realistic varied table rows
                const mockEarningsOrders = Array.from({length: rowCount}).map((_, i) => {
                    const baseTotal = (Math.random() * 200 + 50);
                    const fee = baseTotal * PLATFORM_FEE_PCT;
                    const net = baseTotal - fee;
                    
                    return {
                        _id: `ORD_V${900 + i}`,
                        customerName: `Client ${i + 1}`,
                        itemsStr: i % 2 === 0 ? `Assorted Pastries x${Math.ceil(Math.random() * 5)}` : `Custom Cake x1`,
                        gross: baseTotal,
                        fee: fee,
                        net: net,
                        status: 'delivered',
                        date: new Date(Date.now() - (i * 86400000)).toLocaleDateString() // past few days
                    };
                });
                
                setOrders(mockEarningsOrders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrdersForEarnings();
    }, [user, daysFilter]);

    const handleExportCSV = () => {
        if (orders.length === 0) return alert('No data to export');
        
        const headers = ["Order ID", "Date", "Items", "Gross Revenue (MAD)", "Platform Fee (10%)", "Net Earnings (MAD)"];
        const rows = orders.map(o => [
            o._id,
            o.date,
            `"${o.itemsStr}"`,
            o.gross.toFixed(2),
            o.fee.toFixed(2),
            o.net.toFixed(2)
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `ELSA_Earnings_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalGross = orders.reduce((sum, order) => sum + order.gross, 0);
    const totalFees = orders.reduce((sum, order) => sum + order.fee, 0);
    const totalNet = orders.reduce((sum, order) => sum + order.net, 0);

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Calculating fees...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">💰 Earnings & Fees</h1>
                    <p className="admin-page-subtitle">Automatic 10% platform fee calculation and net payout overview</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="admin-filter-group" style={{ display: 'flex', gap: '5px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                        {[7, 30, 'all'].map(days => (
                            <button 
                                key={days}
                                className={`admin-btn ${daysFilter === days ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                                style={{ 
                                    padding: '8px 15px', fontSize: '0.85rem', border: 'none',
                                    background: daysFilter === days ? 'var(--primary-color)' : 'transparent',
                                    color: daysFilter === days ? 'white' : '#64748b'
                                }}
                                onClick={() => setDaysFilter(days)}
                            >
                                {days === 'all' ? 'All Time' : `${days} Days`}
                            </button>
                        ))}
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>⬇️ Export CSV</button>
                </div>
            </div>

            {/* Top Summaries */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card stat-sales">
                    <div className="stat-card-left">
                        <div className="stat-card-label">Gross Revenue</div>
                        <div className="stat-card-value">{totalGross.toFixed(2)} MAD</div>
                        <div className="stat-card-trend trend-neutral">Total sales to customers</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-clients">
                    <div className="stat-card-left">
                        <div className="stat-card-label" style={{ color: '#ef4444' }}>ELSA Platform Fees (10%)</div>
                        <div className="stat-card-value" style={{ color: '#ef4444' }}>-{totalFees.toFixed(2)} MAD</div>
                        <div className="stat-card-trend trend-neutral">Deducted automatically</div>
                    </div>
                </div>
                <div className="admin-stat-card stat-revenue" style={{ background: 'linear-gradient(135deg, #E6CCB2, #5C4033)' }}>
                    <div className="stat-card-left">
                        <div className="stat-card-label" style={{ color: '#FFEEDD' }}>Net Payout</div>
                        <div className="stat-card-value" style={{ color: 'white' }}>{totalNet.toFixed(2)} MAD</div>
                        <div className="stat-card-trend trend-neutral" style={{ color: '#FFEEDD' }}>Your actual earnings</div>
                    </div>
                </div>
            </div>

            {/* Breakdown Table */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Earnings Breakdown ({daysFilter === 'all' ? 'All Time' : `Last ${daysFilter} Days`})</h3>
                </div>
                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead style={{ background: '#FAF8F5' }}>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th style={{ textAlign: 'right' }}>Gross Sales</th>
                                <th style={{ textAlign: 'right', color: '#ef4444' }}>Platform Fee (-10%)</th>
                                <th style={{ textAlign: 'right', color: '#16a34a' }}>Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No earnings data for this period.</td></tr>
                            ) : orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-id-cell">{order._id}</td>
                                    <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>{order.date}</td>
                                    <td>{order.itemsStr}</td>
                                    <td style={{ textAlign: 'right', fontWeight: '500' }}>{order.gross.toFixed(2)} MAD</td>
                                    <td style={{ textAlign: 'right', color: '#ef4444' }}>-{order.fee.toFixed(2)} MAD</td>
                                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#16a34a' }}>{order.net.toFixed(2)} MAD</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ background: '#F0EBE3', borderTop: '2px solid #E6D5C3' }}>
                            <tr>
                                <td colSpan="3" style={{ fontWeight: '700', textAlign: 'right', padding: '1rem' }}>TOTALS:</td>
                                <td style={{ fontWeight: '700', textAlign: 'right', padding: '1rem' }}>{totalGross.toFixed(2)} MAD</td>
                                <td style={{ fontWeight: '700', textAlign: 'right', padding: '1rem', color: '#ef4444' }}>-{totalFees.toFixed(2)} MAD</td>
                                <td style={{ fontWeight: '700', textAlign: 'right', padding: '1rem', color: '#16a34a' }}>{totalNet.toFixed(2)} MAD</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorEarnings;



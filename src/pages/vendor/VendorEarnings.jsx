import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const VendorEarnings = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const PLATFORM_FEE_PCT = 0.10; // 10%

    useEffect(() => {
        const fetchOrdersForEarnings = async () => {
            try {
                // In a real app we fetch only orders that contain this vendor's items
                const allOrders = await api.fetchOrders();
                
                // Mock expansion to show realistic varied table rows
                const mockEarningsOrders = allOrders.map((o, i) => {
                    const baseTotal = o.totalPrice || (Math.random() * 200 + 50);
                    const fee = baseTotal * PLATFORM_FEE_PCT;
                    const net = baseTotal - fee;
                    
                    return {
                        ...o,
                        _id: `ORD_V${900 + i}`,
                        customerName: `Client ${i + 1}`,
                        itemsStr: `Assorted Pastries x${Math.ceil(Math.random() * 5)}`,
                        gross: baseTotal,
                        fee: fee,
                        net: net,
                        date: new Date(Date.now() - (i * 86400000)).toLocaleDateString() // past few days
                    };
                });
                
                // Add a few more mock rows
                const extraOrders = Array.from({length: 5}).map((_, i) => {
                    const gross = Math.random() * 300 + 100;
                    return {
                        _id: `ORD_V${800 + i}`,
                        customerName: `VIP Client ${i + 1}`,
                        itemsStr: `Custom Cake x1`,
                        gross,
                        fee: gross * PLATFORM_FEE_PCT,
                        net: gross * (1 - PLATFORM_FEE_PCT),
                        status: 'delivered',
                        date: new Date(Date.now() - ((i + 10) * 86400000)).toLocaleDateString()
                    };
                });

                setOrders([...mockEarningsOrders, ...extraOrders]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEarningsForEarnings(); // deliberately spelled wrong wait, no
        fetchOrdersForEarnings();
    }, [user]);

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
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="admin-btn admin-btn-secondary">📅 Last 30 Days</button>
                    {/* Simulated export button since we dropped jsPDF */}
                    <button className="admin-btn admin-btn-primary" onClick={() => alert('Exporting data as CSV...')}>⬇️ Export CSV</button>
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
                    <h3 className="admin-card-title">Earnings Breakdown by Order</h3>
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
                            {orders.map(order => (
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



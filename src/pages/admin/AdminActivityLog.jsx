import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const LOG_TYPE_ICONS = {
    product: '🥐',
    user: '👤',
    order: '📦',
    system: '⚙️',
    login: '🔐',
};

const LOG_TYPE_BADGE = {
    product: 'badge-primary',
    user: 'badge-info',
    order: 'badge-success',
    system: 'badge-neutral',
    login: 'badge-purple',
};

const AdminActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLogs(api.getActivityLog());
    }, []);

    const types = ['all', 'product', 'user', 'order', 'login', 'system'];

    const filtered = logs.filter(log => {
        const matchesType = filterType === 'all' || log.type === filterType;
        const matchesSearch = !searchQuery || log.action.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">📋 Activity Log</h1>
                    <p className="admin-page-subtitle">Track all admin actions and system events</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={() => setLogs(api.getActivityLog())}>
                    🔄 Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters-row">
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search activity..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
                <div className="admin-filter-tabs">
                    {types.map(t => (
                        <button
                            key={t}
                            className={`admin-filter-tab ${filterType === t ? 'active' : ''}`}
                            onClick={() => setFilterType(t)}
                        >
                            {t === 'all' ? 'All' : LOG_TYPE_ICONS[t] + ' ' + t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-card">
                <div className="activity-log-list">
                    {filtered.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="empty-icon">📋</div>
                            <p>No activity logs found.</p>
                        </div>
                    ) : filtered.map((log, i) => (
                        <div key={i} className="activity-log-item">
                            <div className="activity-log-icon">
                                {LOG_TYPE_ICONS[log.type] || '📌'}
                            </div>
                            <div className="activity-log-content">
                                <div className="activity-log-action">{log.action}</div>
                                <div className="activity-log-meta">
                                    <span className={`admin-badge ${LOG_TYPE_BADGE[log.type] || 'badge-neutral'}`}>{log.type}</span>
                                    <span className="activity-log-time">🕐 {log.time}</span>
                                    {log.by && <span className="activity-log-by">by {log.by}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminActivityLog;

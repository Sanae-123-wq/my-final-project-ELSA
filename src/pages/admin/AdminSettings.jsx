import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'ELSA Pâtisserie',
        currency: 'MAD',
        timezone: 'Africa/Casablanca',
        emailNotifications: true,
        orderAlerts: true,
        lowStockAlerts: true,
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">⚙️ Settings</h1>
                    <p className="admin-page-subtitle">Manage your admin preferences and store configuration</p>
                </div>
            </div>

            {saved && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
                    ✅ Settings saved successfully!
                </div>
            )}

            <div className="settings-grid">
                {/* Admin Profile */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">👤 Admin Profile</h3>
                    </div>
                    <div className="settings-profile-section">
                        <div className="settings-avatar">{user?.name?.charAt(0) || 'A'}</div>
                        <div>
                            <div className="settings-profile-name">{user?.name || 'Admin'}</div>
                            <div className="settings-profile-email">{user?.email}</div>
                            <span className="admin-badge badge-purple">Administrator</span>
                        </div>
                    </div>
                </div>

                {/* Store Settings */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">🏪 Store Configuration</h3>
                    </div>
                    <form onSubmit={handleSave}>
                        <div className="form-group-admin">
                            <label>Store Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={e => setSettings({...settings, siteName: e.target.value})}
                                className="admin-input"
                            />
                        </div>
                        <div className="form-group-admin">
                            <label>Currency</label>
                            <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="admin-input">
                                <option value="MAD">MAD — Moroccan Dirham</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="EUR">EUR — Euro</option>
                            </select>
                        </div>
                        <div className="form-group-admin">
                            <label>Timezone</label>
                            <select value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="admin-input">
                                <option value="Africa/Casablanca">Africa/Casablanca (UTC+1)</option>
                                <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                        <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
                    </form>
                </div>

                {/* Notifications */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">🔔 Notifications</h3>
                    </div>
                    <div className="settings-toggles">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'orderAlerts', label: 'New Order Alerts', desc: 'Get notified on new orders' },
                            { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when products are low' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} className="settings-toggle-row">
                                <div>
                                    <div className="settings-toggle-label">{label}</div>
                                    <div className="settings-toggle-desc">{desc}</div>
                                </div>
                                <button
                                    className={`toggle-switch ${settings[key] ? 'toggle-on' : ''}`}
                                    onClick={() => setSettings({...settings, [key]: !settings[key]})}
                                    type="button"
                                >
                                    <div className="toggle-thumb"></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">🔒 Security</h3>
                    </div>
                    <div className="security-info">
                        <div className="security-item">
                            <span className="security-icon">🛡️</span>
                            <div>
                                <div className="security-label">Admin Access Control</div>
                                <div className="security-desc">Only admin role can access this dashboard</div>
                            </div>
                            <span className="admin-badge badge-success">Active</span>
                        </div>
                        <div className="security-item">
                            <span className="security-icon">🔐</span>
                            <div>
                                <div className="security-label">Route Protection</div>
                                <div className="security-desc">All admin routes are protected</div>
                            </div>
                            <span className="admin-badge badge-success">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

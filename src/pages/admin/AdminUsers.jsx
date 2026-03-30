import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ROLE_TABS = ['clients', 'vendors', 'delivery'];
const ROLE_LABELS = { clients: 'Clients', vendors: 'Vendors (Patissiers)', delivery: 'Delivery Workers' };
const ROLE_MAP = { clients: 'client', vendors: 'vendor', delivery: 'delivery' };
const ROLE_ICONS = { clients: '👥', vendors: '👨‍🍳', delivery: '🚚' };

const ROLE_BADGE = {
    admin: 'badge-purple',
    vendor: 'badge-info',
    delivery: 'badge-warning',
    client: 'badge-success',
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('clients');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'vendor' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try { setUsers(await api.fetchUsers()); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.register(formData.name, formData.email, formData.password, formData.role);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'vendor' });
            loadUsers();
        } catch (err) {
            setError(err.message || 'Error creating user');
        } finally { setSaving(false); }
    };

    const handleApproveUser = async (id) => {
        if (!window.confirm('Are you sure you want to approve this professional account?')) return;
        try {
            await api.approveUser(id);
            loadUsers();
        } catch (err) {
            alert(err.message || 'Error approving user');
        }
    };

    const tabRole = ROLE_MAP[activeTab];
    const tabUsers = users.filter(u => {
        const roleMatch = u.role === tabRole;
        const searchMatch = !searchQuery ||
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        return roleMatch && searchMatch;
    });

    const roleCounts = Object.keys(ROLE_MAP).reduce((acc, tab) => {
        acc[tab] = users.filter(u => u.role === ROLE_MAP[tab]).length;
        return acc;
    }, {});

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading users...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Manage Users</h1>
                    <p className="admin-page-subtitle">{users.length} total users registered</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                    + Create Staff Account
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {ROLE_TABS.map(tab => (
                    <button
                        key={tab}
                        className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {ROLE_ICONS[tab]} {ROLE_LABELS[tab]}
                        <span className="tab-count">{roleCounts[tab]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="admin-filters-row" style={{ marginBottom: '1rem' }}>
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder={`Search ${ROLE_LABELS[activeTab].toLowerCase()}...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
            </div>

            {/* Users Card */}
            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="admin-table-empty">
                                        No {ROLE_LABELS[activeTab].toLowerCase()} found.
                                    </td>
                                </tr>
                            ) : tabUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">{user.name?.charAt(0)?.toUpperCase()}</div>
                                            <span className="user-name-cell">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="email-cell">{user.email}</td>
                                    <td>
                                        <span className={`admin-badge ${ROLE_BADGE[user.role] || 'badge-neutral'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${user.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                            {user.status || 'approved'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.status === 'pending' && (
                                            <button 
                                                className="admin-btn-action admin-btn-success" 
                                                onClick={() => handleApproveUser(user._id)}
                                                title="Approve User"
                                            >
                                                ✅ Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Staff Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">👤 Create Staff Account</h2>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateUser} className="admin-modal-body">
                            {error && <div className="admin-alert admin-alert-error">{error}</div>}
                            <div className="form-group-admin">
                                <label>Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="admin-input" />
                            </div>
                            <div className="form-group-admin">
                                <label>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="admin-input" />
                            </div>
                            <div className="form-group-admin">
                                <label>Password *</label>
                                <input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength="6" className="admin-input" />
                            </div>
                            <div className="form-group-admin">
                                <label>Role *</label>
                                <select name="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="admin-input">
                                    <option value="vendor">👨‍🍳 Vendor (Patissier)</option>
                                    <option value="delivery">🚚 Delivery Worker</option>
                                </select>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

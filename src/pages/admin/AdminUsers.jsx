import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaUserPlus, FaUsers, FaCloudUploadAlt, FaSearch, FaCheckCircle, FaUserTag, FaEnvelope, FaShieldAlt, FaUtensils, FaBicycle, FaUserShield, FaTimes } from 'react-icons/fa';
import './AdminUsers.css';

const ROLE_TABS = ['clients', 'vendors', 'delivery'];
const ROLE_LABELS = { clients: 'Clients', vendors: 'Patissiers', delivery: 'Logistics' };
const ROLE_MAP = { clients: 'client', vendors: 'vendor', delivery: 'delivery' };
const ROLE_ICONS = { clients: <FaUsers />, vendors: <FaUtensils />, delivery: <FaBicycle /> };

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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
            <p className="ml-4 font-bold text-brown">Synchronizing user registry...</p>
        </div>
    );

    return (
        <div className="au-container inner-admin-page">
            <div className="au-header">
                <div className="au-title-section">
                    <h1>User Intelligence</h1>
                    <p>Managing platform access and professional certifications</p>
                </div>
                <button className="au-btn-create" onClick={() => setShowModal(true)}>
                    <FaUserPlus /> Provision Staff Account
                </button>
            </div>

            {/* Tabs */}
            <div className="au-tabs thin-scrollbar">
                {ROLE_TABS.map(tab => (
                    <button
                        key={tab}
                        className={`au-tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {ROLE_ICONS[tab]}
                        {ROLE_LABELS[tab]}
                        <span className="au-tab-count">{roleCounts[tab]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
                <div className="ao-search-wrap">
                    <FaSearch className="ao-search-icon" />
                    <input
                        type="text"
                        placeholder={`Find ${ROLE_LABELS[activeTab].toLowerCase()} by name or email...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="ao-search-input"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="au-card">
                <table className="au-table">
                    <thead>
                        <tr>
                            <th>Identity Profile</th>
                            <th>Verification</th>
                            <th>Access Role</th>
                            <th>Onboarding</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tabUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📭</div>
                                    <h3 style={{ fontWeight: 800, color: '#5C4033' }}>Archive is empty</h3>
                                    <p>No active accounts found for this classification.</p>
                                </td>
                            </tr>
                        ) : tabUsers.map(user => (
                            <tr key={user._id} className="au-row">
                                <td className="au-td">
                                    <div className="au-user-profile">
                                        <div className="au-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                                        <div>
                                            <div className="au-name">{user.name}</div>
                                            <div className="au-email"><FaEnvelope style={{marginRight: '6px'}} /> {user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="au-td">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#6B7280' }}>
                                        <FaCheckCircle style={{ color: user.isVerified || true ? '#10B981' : '#D1D5DB' }} />
                                        <span>Authorized</span>
                                    </div>
                                </td>
                                <td className="au-td">
                                    <span style={{ 
                                        fontWeight: 800, color: '#5C4033', background: 'rgba(139,94,60,0.06)', 
                                        padding: '0.3rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', textTransform: 'uppercase' 
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="au-td">
                                    <span className={`au-status status-${user.status || 'approved'}`}>
                                        {user.status === 'pending' ? '⏳ Pending' : '✓ Active'}
                                    </span>
                                </td>
                                <td className="au-td">
                                    {user.status === 'pending' ? (
                                        <button 
                                            className="au-btn-approve" 
                                            onClick={() => handleApproveUser(user._id)}
                                        >
                                            <FaUserShield /> Verify
                                        </button>
                                    ) : (
                                        <div style={{ color: '#D1D5DB', fontSize: '0.85rem', fontWeight: 600 }}>Already Verified</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Staff Modal */}
            {showModal && (
                <div className="au-modal-overlay">
                    <div className="au-modal">
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                            <FaTimes style={{ color: '#5C4033', opacity: 0.3, fontSize: '1.25rem' }} />
                        </div>
                        <div className="au-modal-header">
                            <h2 className="au-modal-title">Provision Staff</h2>
                            <p style={{ color: 'rgba(139,94,60,0.6)', marginTop: '0.5rem' }}>Deploy a new authorized account to the platform</p>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            {error && <div style={{ color: '#DC2626', background: '#FEF2F2', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700 }}>⚠️ {error}</div>}
                            
                            <div className="au-form-group">
                                <label>Legal Full Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="au-input" placeholder="e.g. Jean Dupont" />
                            </div>
                            
                            <div className="au-form-group">
                                <label>Corporate Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="au-input" placeholder="staff@elsa-patisserie.com" />
                            </div>
                            
                            <div className="au-form-group">
                                <label>Initial Access Token (Password)</label>
                                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength="6" className="au-input" placeholder="••••••••" />
                            </div>
                            
                            <div className="au-form-group">
                                <label>Functional Classification</label>
                                <select 
                                    className="au-input"
                                    value={formData.role} 
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="vendor">👨‍🍳 Vendor (Patissier)</option>
                                    <option value="delivery">🚚 Logistics Personnel</option>
                                </select>
                            </div>

                            <div className="au-modal-footer">
                                <button type="button" className="au-btn-cancel" onClick={() => setShowModal(false)}>Discard</button>
                                <button type="submit" className="au-btn-submit" disabled={saving}>
                                    {saving ? 'Deploying...' : 'Confirm Provisioning'}
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



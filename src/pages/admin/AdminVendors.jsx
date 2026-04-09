import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AdminVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'vendor' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { loadVendors(); }, []);

    const loadVendors = async () => {
        setLoading(true);
        try {
            const users = await api.fetchUsers();
            setVendors(users.filter(u => u.role === 'vendor'));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.register(formData.name, formData.email, formData.password, 'vendor');
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'vendor' });
            loadVendors();
        } catch (err) {
            setError(err.message || 'Error creating vendor');
        } finally { setSaving(false); }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this chef?')) return;
        try {
            await api.approveUser(id);
            loadVendors();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This will also remove ALL their products from the store.`)) return;
        
        try {
            await api.deleteVendor(id);
            // Instant UI update
            setVendors(prev => prev.filter(v => v._id !== id));
            alert('Vendor and their products deleted successfully');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to delete vendor');
        }
    };

    const filtered = vendors.filter(v =>
        !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading vendors...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">👨‍🍳 Vendors (Patissiers)</h1>
                    <p className="admin-page-subtitle">{vendors.length} registered vendors</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                    + Add Vendor
                </button>
            </div>

            <div className="admin-filters-row" style={{ marginBottom: '1rem' }}>
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input type="text" placeholder="Search vendors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="admin-search-input" />
                </div>
            </div>

            <div className="vendor-cards-grid">
                {filtered.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="empty-icon">👨‍🍳</div>
                        <p>No vendors found. Add your first patissier!</p>
                    </div>
                ) : filtered.map(vendor => (
                    <div key={vendor._id} className="vendor-card">
                        <div className="vendor-card-avatar">{vendor.name?.charAt(0)?.toUpperCase()}</div>
                        <div className="vendor-card-name">{vendor.name}</div>
                        <div className="vendor-card-email">{vendor.email}</div>
                        <div className="vendor-card-footer" style={{ flexDirection: 'column', gap: '8px' }}>
                            <span className={`admin-badge ${vendor.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                {vendor.status || 'approved'}
                            </span>
                            {vendor.status === 'pending' && (
                                <button className="admin-btn-action admin-btn-success" onClick={() => handleApprove(vendor._id)}>
                                    <FaCheckCircle /> Approve Chef
                                </button>
                            )}
                            <button 
                                className="admin-btn-action admin-btn-danger" 
                                style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => handleDelete(vendor._id, vendor.name)}
                            >
                                <FaTrash size={12} /> Delete Vendor
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">👨‍🍳 Add New Vendor</h2>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="admin-modal-body">
                            {error && <div className="admin-alert admin-alert-error">{error}</div>}
                            <div className="form-group-admin">
                                <label>Full Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="admin-input" />
                            </div>
                            <div className="form-group-admin">
                                <label>Email Address *</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="admin-input" />
                            </div>
                            <div className="form-group-admin">
                                <label>Password *</label>
                                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength="6" className="admin-input" />
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Vendor'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;

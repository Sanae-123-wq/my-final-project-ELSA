import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminDelivery = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadWorkers(); }, []);

    const loadWorkers = async () => {
        setLoading(true);
        try {
            const users = await api.fetchUsers();
            setWorkers(users.filter(u => u.role === 'delivery'));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.createUser({ ...formData, role: 'delivery' });
            setShowModal(false);
            setFormData({ name: '', email: '', password: '' });
            loadWorkers();
        } catch (err) {
            setError(err.message || 'Error creating worker');
        } finally { setSaving(false); }
    };

    const statusOptions = ['Available', 'On Delivery', 'Off Duty'];
    const [workerStatus, setWorkerStatus] = useState({});

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading delivery workers...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">🚚 Delivery Workers</h1>
                    <p className="admin-page-subtitle">{workers.length} delivery personnel</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                    + Add Delivery Worker
                </button>
            </div>

            <div className="vendor-cards-grid">
                {workers.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="empty-icon">🚚</div>
                        <p>No delivery workers yet. Add your first one!</p>
                    </div>
                ) : workers.map(worker => {
                    const status = workerStatus[worker._id] || 'Available';
                    const statusClass = status === 'Available' ? 'badge-success' : status === 'On Delivery' ? 'badge-warning' : 'badge-neutral';
                    return (
                        <div key={worker._id} className="vendor-card">
                            <div className="vendor-card-avatar" style={{ background: 'linear-gradient(135deg, #7F5539, #B08968)' }}>
                                {worker.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="vendor-card-name">{worker.name}</div>
                            <div className="vendor-card-email">{worker.email}</div>
                            <div className="vendor-card-status-row">
                                <select
                                    className="admin-select-sm delivery-status-select"
                                    value={workerStatus[worker._id] || 'Available'}
                                    onChange={e => setWorkerStatus({ ...workerStatus, [worker._id]: e.target.value })}
                                >
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="vendor-card-footer">
                                <span className={`admin-badge ${statusClass}`}>{status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">🚚 Add Delivery Worker</h2>
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
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Worker'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDelivery;

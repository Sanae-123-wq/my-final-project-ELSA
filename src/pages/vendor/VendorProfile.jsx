import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const VendorProfile = () => {
    const { user } = useContext(AuthContext);
    const [saved, setSaved] = useState(false);
    
    const [profile, setProfile] = useState({
        storeName: "Les Délices d'ELSA",
        description: "Specializing in authentic Moroccan and fine French pastries.",
        phone: '06 99 88 77 66',
        bankAccount: 'MA64 0110 0000 0000 0000 0000 000',
        address: 'Quartier Hassan, Rabat'
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
                    <h1 className="admin-page-title">👨‍🍳 Patissier Profile</h1>
                    <p className="admin-page-subtitle">Manage your public store information and payout details</p>
                </div>
            </div>

            {saved && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
                    ✅ Profile updated successfully!
                </div>
            )}

            <div className="settings-grid">
                {/* Store Profile Setup */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Store Public Details</h3>
                    </div>
                    
                    <form onSubmit={handleSave} style={{ padding: '1.25rem' }}>
                        <div className="form-group-admin" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #E6CCB2, #5C4033)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '4px solid #F0EBE3' }}>
                                {user?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 1rem' }}>Upload Logo</button>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>JPG, PNG or GIF. Max 2MB.</div>
                            </div>
                        </div>

                        <div className="form-group-admin">
                            <label>Store Name *</label>
                            <input type="text" value={profile.storeName} onChange={e => setProfile({...profile, storeName: e.target.value})} className="admin-input" required />
                        </div>
                        <div className="form-group-admin">
                            <label>Short Description (Public)</label>
                            <textarea value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})} className="admin-input" rows={3}></textarea>
                        </div>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>Business Address</label>
                            <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="admin-input" />
                        </div>
                    </form>
                </div>

                {/* Account Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="admin-card settings-card" style={{ marginBottom: 0 }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Account & Payouts</h3>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div className="form-group-admin">
                                <label>Contact Phone</label>
                                <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="admin-input" />
                            </div>
                            <div className="form-group-admin" style={{ marginBottom: 0 }}>
                                <label>Bank Account (RIB) for Payouts</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🏦</span>
                                    <input type="text" value={profile.bankAccount} onChange={e => setProfile({...profile, bankAccount: e.target.value})} className="admin-input" style={{ paddingLeft: '35px' }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>Earnings are automatically transferred to this account. ELSA deducts a 10% platform fee prior to transfer.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="admin-card settings-card" style={{ marginBottom: 0 }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Approval Status</h3>
                        </div>
                        <div className="security-info">
                            <div className="security-item">
                                <span className="security-icon">✅</span>
                                <div>
                                    <div className="security-label">Seller Account Approved</div>
                                    <div className="security-desc">Authorized to list products on ELSA</div>
                                </div>
                                <span className="admin-badge badge-success">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" onClick={handleSave} className="admin-btn admin-btn-primary" style={{ padding: '0.8rem 2rem' }}>
                        Save Patissier Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;



import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const DeliveryProfile = () => {
    const { user } = useContext(AuthContext);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        phone: '06 12 34 56 78',
        vehicleData: 'Yamaha TMAX 560',
        licensePlate: 'A 12345/11',
        emergencyContact: '06 98 76 54 32 (Brother)'
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
                    <h1 className="admin-page-title">👤 My Profile</h1>
                    <p className="admin-page-subtitle">Manage your personal and vehicle information</p>
                </div>
            </div>

            {saved && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
                    ✅ Profile updated successfully!
                </div>
            )}

            <div className="settings-grid">
                {/* Personal Info */}
                <div className="admin-card settings-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Personal Information</h3>
                    </div>
                    <div className="settings-profile-section" style={{ borderBottom: '1px solid #F0EBE3', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
                        <div className="settings-avatar" style={{ background: 'linear-gradient(135deg, #E6CCB2, #5C4033)', color: '#3D2314' }}>
                            {user?.name?.charAt(0) || 'L'}
                        </div>
                        <div>
                            <div className="settings-profile-name">{user?.name || 'Livreur ELSA'}</div>
                            <div className="settings-profile-email">{user?.email || 'delivery@elsa-patisserie.com'}</div>
                            <span className="admin-badge badge-warning">Delivery Partner</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSave} style={{ paddingTop: '0.5rem' }}>
                        <div className="form-group-admin">
                            <label>Phone Number *</label>
                            <input 
                                type="text" 
                                value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})} 
                                className="admin-input" 
                                required
                            />
                        </div>
                        <div className="form-group-admin">
                            <label>Emergency Contact</label>
                            <input 
                                type="text" 
                                value={profile.emergencyContact} 
                                onChange={e => setProfile({...profile, emergencyContact: e.target.value})} 
                                className="admin-input" 
                            />
                        </div>
                    </form>
                </div>

                {/* Vehicle & Settings Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="admin-card settings-card" style={{ marginBottom: 0 }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">🛵 Vehicle Details</h3>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div className="form-group-admin">
                                <label>Vehicle Make & Model</label>
                                <input 
                                    type="text" 
                                    value={profile.vehicleData} 
                                    onChange={e => setProfile({...profile, vehicleData: e.target.value})} 
                                    className="admin-input" 
                                />
                            </div>
                            <div className="form-group-admin" style={{ marginBottom: 0 }}>
                                <label>License Plate</label>
                                <input 
                                    type="text" 
                                    value={profile.licensePlate} 
                                    onChange={e => setProfile({...profile, licensePlate: e.target.value})} 
                                    className="admin-input" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="admin-card settings-card" style={{ marginBottom: 0 }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">🛡️ Account Status</h3>
                        </div>
                        <div className="security-info">
                            <div className="security-item">
                                <span className="security-icon">✅</span>
                                <div>
                                    <div className="security-label">Account Verified</div>
                                    <div className="security-desc">Identity and documents approved</div>
                                </div>
                                <span className="admin-badge badge-success">Active</span>
                            </div>
                            <div className="security-item">
                                <span className="security-icon">📋</span>
                                <div>
                                    <div className="security-label">Driver License Valid</div>
                                    <div className="security-desc">Expires: 12/2026</div>
                                </div>
                                <span className="admin-badge badge-success">OK</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" onClick={handleSave} className="admin-btn admin-btn-primary" style={{ padding: '0.8rem 2rem' }}>
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;



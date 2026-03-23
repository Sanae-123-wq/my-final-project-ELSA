import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const VendorRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Verifying access...</p></div>;

    if (!user || user.role !== 'vendor') {
        return <Navigate to="/" replace />;
    }

    // Optionally checking if approved
    if (user.role === 'vendor' && user.isApproved === false) {
        return (
            <div className="admin-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
                    <h2 style={{ color: '#3D2314', marginBottom: '1rem', fontFamily: '"Playfair Display", serif' }}>Account Pending Approval</h2>
                    <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                        Thank you for registering as a Patissier with ELSA! Your account is currently under review by our administration team. 
                        You will be able to access your dashboard once approved.
                    </p>
                    <a href="/" className="admin-btn admin-btn-primary" style={{ marginTop: '2rem' }}>Return to Shop</a>
                </div>
            </div>
        );
    }

    return children;
};

export default VendorRoute;

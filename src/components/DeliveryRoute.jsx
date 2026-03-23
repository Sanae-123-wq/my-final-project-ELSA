import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DeliveryRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Verifying access...</p></div>;

    if (!user || user.role !== 'delivery') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default DeliveryRoute;

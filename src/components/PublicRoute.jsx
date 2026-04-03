import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * PublicRoute Component
 * Restricts access to public pages for administrative roles (Admin, Vendor, Delivery)
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return null; // Or a subtle loading state
    }

    if (user && user.role !== 'client') {
        // Redirect administrative roles to their dashboards
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
        if (user.role === 'delivery') return <Navigate to="/delivery" replace />;
    }

    return children;
};

export default PublicRoute;

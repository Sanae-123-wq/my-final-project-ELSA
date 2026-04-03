import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * @param {Array} allowedRoles - List of roles permitted to access the route
 * @param {React.ReactNode} children - The component to render if authorized
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If they are logged in but don't have the right role
        // Redirect based on their actual role to their dashboard
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
        if (user.role === 'delivery') return <Navigate to="/delivery" replace />;
        
        // If all else fails, show access denied
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;

import { useState, useContext, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import AuthContext from '../../context/AuthContext';
import '../../admin.css'; // Reusing the same professional CSS

const NAV_ITEMS = [
    { path: '/delivery', label: 'Dashboard', icon: '⊞', exact: true },
    { path: '/delivery/available', label: 'Available Orders', icon: '📍' },
    { path: '/delivery/active', label: 'My Deliveries', icon: '🚚' },
    { path: '/delivery/map', label: 'Map / Location', icon: '🗺️' },
    { path: '/delivery/profile', label: 'Profile', icon: '👤' },
];

const DeliveryLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { unreadCount } = useSocket();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    if (user?.status === 'pending') {
        return (
            <div className="admin-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FAF3EB', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '4rem' }}>⏳</div>
                <h2 style={{ color: '#5C4033', fontFamily: 'Playfair Display, serif' }}>Account Under Review</h2>
                <p style={{ color: '#8B7355' }}>Your Courier portal is restricted until an administrator verifies your application.</p>
                <button onClick={handleLogout} className="auth-submit-btn" style={{ maxWidth: '200px', padding: '12px 24px', background: '#C1A176', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };


    const currentPage = NAV_ITEMS.find(item =>
        item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );

    return (
        <div className="admin-shell">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">🚚</div>
                    <div>
                        <div className="sidebar-logo-title">ELSA</div>
                        <div className="sidebar-logo-sub">Delivery Portal</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="sidebar-nav-label">DELIVERY MENU</div>
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sidebar-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-admin-info">
                        <div className="sidebar-admin-avatar">
                            {user?.name?.charAt(0) || 'L'}
                        </div>
                        <div>
                            <div className="sidebar-admin-name">{user?.name || 'Livreur'}</div>
                            <div className="sidebar-admin-role">Delivery Worker</div>
                        </div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
                        ⏻
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="admin-main">
                {/* Top Navbar */}
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            ☰
                        </button>
                        <div className="topbar-breadcrumb">
                            <span className="breadcrumb-home">Delivery</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-current">{currentPage?.label || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="topbar-right" style={{ marginLeft: 'auto' }}>
                        {/* Notifications */}
                        <Link to="/notifications" className="nav-icon-link" aria-label="Notifications" style={{ color: '#3D2B1F', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <FaBell size={20} />
                            {unreadCount > 0 && <span className="badge badge-notifications">{unreadCount}</span>}
                        </Link>

                        {/* Profile */}
                        <div className="topbar-profile-wrapper">
                            <button className="topbar-profile-btn" onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
                                <div className="topbar-avatar">{user?.name?.charAt(0) || 'L'}</div>
                                <div className="topbar-profile-info">
                                    <div className="topbar-profile-name">{user?.name || 'Livreur'}</div>
                                    <div className="topbar-profile-role">Delivery Worker</div>
                                </div>
                                <span>▾</span>
                            </button>
                            {profileOpen && (
                                <div className="topbar-dropdown profile-dropdown">
                                    <Link to="/delivery/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                        👤 My Profile
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                                        ⏻ Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DeliveryLayout;

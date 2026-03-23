import { useState, useContext, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    
    // Notification logic
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New order #ORD_882 is 2.5km away', time: 'Just now', type: 'order', isNew: true },
        { id: 2, text: 'Order #ORD_123 was successfully delivered', time: '2 hrs ago', type: 'success', isNew: false },
    ]);
    const unreadCount = notifications.filter(n => n.isNew).length;

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNotifClick = () => {
        setNotifOpen(!notifOpen);
        setProfileOpen(false);
        if (!notifOpen) {
            // Mark as read when opening
            setNotifications(notifications.map(n => ({ ...n, isNew: false })));
        }
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
                        <div className="topbar-notif-wrapper">
                            <button className="topbar-icon-btn" onClick={handleNotifClick}>
                                🔔
                                {unreadCount > 0 && <span className="topbar-notif-dot"></span>}
                            </button>
                            {notifOpen && (
                                <div className="topbar-dropdown notif-dropdown">
                                    <div className="dropdown-header">
                                        <span>Notifications</span>
                                        <span className="dropdown-badge">{notifications.length}</span>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div className="notif-item"><div className="notif-text">No notifications</div></div>
                                    ) : notifications.map(n => (
                                        <div key={n.id} className="notif-item" style={{ background: n.isNew ? '#FDF9F5' : 'transparent' }}>
                                            <div className={`notif-dot notif-dot-${n.type === 'order' ? 'warning' : 'success'}`}></div>
                                            <div>
                                                <div className="notif-text" style={{ fontWeight: n.isNew ? '600' : '400' }}>{n.text}</div>
                                                <div className="notif-time">{n.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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

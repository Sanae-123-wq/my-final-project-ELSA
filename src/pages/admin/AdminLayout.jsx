import { useState, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../admin.css';

const NAV_ITEMS = [
    { path: '/admin', label: 'Dashboard', icon: '⊞', exact: true },
    { path: '/admin/products', label: 'Products', icon: '🥐' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/users', label: 'Clients', icon: '👥' },
    { path: '/admin/vendors', label: 'Vendors', icon: '👨‍🍳' },
    { path: '/admin/delivery', label: 'Delivery', icon: '🚚' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { path: '/admin/activity', label: 'Activity Log', icon: '📋' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const currentPage = NAV_ITEMS.find(item =>
        item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );

    const notifications = [
        { id: 1, text: 'New order #ord_123 received', time: '2 min ago', type: 'order' },
        { id: 2, text: 'Product "Croissant" is low in stock', time: '15 min ago', type: 'warning' },
        { id: 3, text: 'New client registered: Sara M.', time: '1 hr ago', type: 'user' },
    ];

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
                    <div className="sidebar-logo-icon">🥐</div>
                    <div>
                        <div className="sidebar-logo-title">ELSA</div>
                        <div className="sidebar-logo-sub">Admin Panel</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="sidebar-nav-label">MAIN MENU</div>
                    {NAV_ITEMS.slice(0, 3).map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sidebar-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.path === '/admin/orders' && (
                                <span className="sidebar-badge">3</span>
                            )}
                        </Link>
                    ))}

                    <div className="sidebar-nav-label">USER MANAGEMENT</div>
                    {NAV_ITEMS.slice(3, 6).map(item => (
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

                    <div className="sidebar-nav-label">INSIGHTS</div>
                    {NAV_ITEMS.slice(6).map(item => (
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
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div className="sidebar-admin-name">{user?.name || 'Admin'}</div>
                            <div className="sidebar-admin-role">Administrator</div>
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
                            <span className="breadcrumb-home">Admin</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-current">{currentPage?.label || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="topbar-search">
                        <span className="topbar-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search products, orders, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="topbar-search-input"
                        />
                    </div>

                    <div className="topbar-right">
                        {/* Notifications */}
                        <div className="topbar-notif-wrapper">
                            <button className="topbar-icon-btn" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}>
                                🔔
                                <span className="topbar-notif-dot"></span>
                            </button>
                            {notifOpen && (
                                <div className="topbar-dropdown notif-dropdown">
                                    <div className="dropdown-header">
                                        <span>Notifications</span>
                                        <span className="dropdown-badge">{notifications.length}</span>
                                    </div>
                                    {notifications.map(n => (
                                        <div key={n.id} className="notif-item">
                                            <div className={`notif-dot notif-dot-${n.type}`}></div>
                                            <div>
                                                <div className="notif-text">{n.text}</div>
                                                <div className="notif-time">{n.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="dropdown-footer">View all notifications</div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="topbar-profile-wrapper">
                            <button className="topbar-profile-btn" onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
                                <div className="topbar-avatar">{user?.name?.charAt(0) || 'A'}</div>
                                <div className="topbar-profile-info">
                                    <div className="topbar-profile-name">{user?.name || 'Admin'}</div>
                                    <div className="topbar-profile-role">Administrator</div>
                                </div>
                                <span>▾</span>
                            </button>
                            {profileOpen && (
                                <div className="topbar-dropdown profile-dropdown">
                                    <Link to="/admin/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                        ⚙️ Settings
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

export default AdminLayout;

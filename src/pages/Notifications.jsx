import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookie, FaCheckCircle, FaTruck, FaBoxOpen, FaInfoCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const Notifications = () => {
    const { notifications, markAsRead, fetchNotifications } = useSocket();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'preparing': return <FaCookie />;
            case 'ready': return <FaCheckCircle />;
            case 'picked': return <FaTruck />;
            case 'delivered': return <FaBoxOpen />;
            case 'reclamation': return <FaExclamationTriangle />;
            default: return <FaInfoCircle />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notifications-section">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--pat-brown)', fontFamily: "'Playfair Display', serif" }}>
                            Notifications
                        </h1>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                            Stay updated on your sweet orders and alerts
                        </p>
                    </div>
                    <div style={{ background: 'white', padding: '0.5rem 1.5rem', borderRadius: '30px', boxShadow: 'var(--pat-shadow)', fontWeight: '700', color: 'var(--pat-brown)', fontSize: '0.9rem' }}>
                        {notifications.length} Alerts
                    </div>
                </div>

                <div className="notifications-list">
                    <AnimatePresence mode="popLayout">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <motion.div
                                    key={notif._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                    className={`notif-card-premium ${!notif.isRead ? 'unread' : 'read'}`}
                                >
                                    <div className="notif-premium-icon">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="notif-premium-content">
                                        <p className="notif-message">
                                            {notif.message}
                                        </p>
                                        <div className="notif-time">
                                            <FaClock size={12} />
                                            {formatDate(notif.createdAt)}
                                        </div>
                                    </div>
                                    {!notif.isRead && (
                                        <div style={{ width: '10px', height: '10px', background: 'var(--pat-gold)', borderRadius: '50%', boxShadow: '0 0 10px var(--pat-gold)', marginTop: '0.5rem' }}></div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="text-center"
                                style={{ padding: '6rem 2rem', background: 'white', borderRadius: 'var(--pat-radius)', boxShadow: 'var(--pat-shadow)' }}
                            >
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔔</div>
                                <h3 style={{ color: 'var(--pat-brown)', fontSize: '1.5rem', fontWeight: '700' }}>No notifications yet</h3>
                                <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>We'll notify you when your orders change status!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Notifications;

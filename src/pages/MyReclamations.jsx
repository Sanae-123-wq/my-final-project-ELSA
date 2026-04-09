import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationCircle, FaCheckCircle, FaClock, FaReply, FaSearch } from 'react-icons/fa';

const MyReclamations = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMyReclamations = async () => {
            try {
                // We'll use the user-specific endpoint (to be added to api.js if not there)
                const res = await fetch(`http://localhost:5000/api/reclamations?userId=${user._id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                setReclamations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch reclamations:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyReclamations();
        }
    }, [user]);

    const filtered = reclamations.filter(rec => 
        rec.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.adminReply && rec.adminReply.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fef3c7', color: '#b45309', icon: <FaClock /> };
            case 'answered': return { bg: '#dcfce7', color: '#166534', icon: <FaReply /> };
            case 'resolved': return { bg: '#dbeafe', color: '#1e40af', icon: <FaCheckCircle /> };
            default: return { bg: '#f3f4f6', color: '#374151', icon: <FaExclamationCircle /> };
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="reclamations-page py-12">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--pat-brown)', fontFamily: "'Playfair Display', serif" }}>
                            My Support Cases
                        </h1>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                            Track your reports and admin responses
                        </p>
                    </div>
                    
                    <div className="search-box-premium">
                        <FaSearch className="search-icon-dim" />
                        <input 
                            type="text" 
                            placeholder="Search cases..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="reclamations-list">
                    <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? (
                            filtered.map((rec) => {
                                const style = getStatusStyle(rec.status);
                                return (
                                    <motion.div
                                        key={rec._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="reclamation-card-premium"
                                    >
                                        <div className="rec-card-header flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="status-badge-premium" style={{ background: style.bg, color: style.color }}>
                                                    {style.icon}
                                                    <span className="capitalize">{rec.status}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    ID: #{rec._id.toString().slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(rec.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="rec-content mb-6">
                                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">My Message</h4>
                                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                {rec.message}
                                            </p>
                                        </div>

                                        {rec.adminReply && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="admin-reply-box"
                                            >
                                                <div className="flex items-center gap-2 mb-2 text-primary">
                                                    <FaReply size={14} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wider">Admin Response</h4>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {rec.adminReply}
                                                </p>
                                            </motion.div>
                                        )}
                                        
                                        {!rec.adminReply && rec.status === 'pending' && (
                                            <div className="pending-notice flex items-center gap-2 text-amber-600 text-sm italic">
                                                <FaClock size={12} />
                                                Waiting for admin review...
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="empty-state-card text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                                <FaExclamationCircle className="mx-auto text-gray-300 mb-4" size={50} />
                                <h3 className="text-xl font-bold text-gray-400">No reclamations found</h3>
                                <p className="text-gray-500">All your support cases will appear here.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MyReclamations;

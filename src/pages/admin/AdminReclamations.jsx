import React, { useEffect, useState, useContext, useRef } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaTrashAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './AdminModeration.css';

const AdminReclamations = () => {
    const { user } = useContext(AuthContext);
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyModal, setReplyModal] = useState({ open: false, recId: null, message: '' });

    useEffect(() => {
        fetchReclamations();
    }, []);

    const fetchReclamations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.fetchReclamations();
            setReclamations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch reclamations:', err);
            setError('Could not sync with support database.');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        try {
            await api.replyToReclamation(replyModal.recId, replyModal.message);
            setReplyModal({ open: false, recId: null, message: '' });
            fetchReclamations();
        } catch (err) {
            console.error('Failed to send reply:', err);
            alert('Failed to send response. Please try again.');
        }
    };

    const filtered = reclamations.filter(rec => {
        return (rec.message?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
               (rec.userId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-brown)', borderBottomColor: 'var(--pat-brown)' }}></div>
            <p className="ml-4 font-bold text-brown">Synchronizing reclamations...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 m-10">
            <FaExclamationCircle className="text-red-400 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold text-red-800">{error}</h3>
            <button onClick={fetchReclamations} className="mt-4 text-red-600 font-bold hover:underline">Try Refreshing</button>
        </div>
    );

    return (
        <div className="admin-reclamations-container">
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-main-title">Reclamation Management</h1>
                    <p className="admin-subtitle">Respond to client complaints and manage service quality</p>
                </div>

                <div className="admin-controls-grid">
                    <div className="admin-search-wrapper" style={{ gridColumn: 'span 2' }}>
                        <input 
                            type="text" 
                            placeholder="Search by client or message..." 
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="reclamations-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Inquiry Preview</th>
                            <th>Received On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.length > 0 ? (
                                filtered.map(rec => (
                                    <motion.tr 
                                        key={rec._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td>
                                            <div className="client-info-cell">
                                                <strong>{rec.userId?.name}</strong>
                                                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{rec.userId?.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="message-preview-cell" title={rec.message}>
                                                {rec.message.length > 80 ? rec.message.substring(0, 80) + '...' : rec.message}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--pat-brown)', fontSize: '0.85rem' }}>
                                                {new Date(rec.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`admin-status-badge badge-${(rec.status || 'pending').toLowerCase()}`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions-cell">
                                                <button 
                                                    onClick={() => setReplyModal({ open: true, recId: rec._id, message: rec.adminReply || '' })}
                                                    className="admin-btn-icon reply" 
                                                    title="Send Response"
                                                >
                                                    <FaReply />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        <div className="text-center py-20 opacity-40">
                                            <FaExclamationCircle size={40} className="mx-auto mb-4" />
                                            <p className="text-xl font-medium">No reclamations found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyModal.open && (
                    <div className="admin-modal-overlay">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="admin-modal"
                            style={{ maxWidth: '650px', width: '95%' }}
                        >
                            <h2 className="modal-title">Respond to Client</h2>
                            <p className="modal-description">Provide a professional and helpful response to resolve this inquiry.</p>
                            
                            <textarea 
                                className="admin-textarea"
                                placeholder="Type your official response here..."
                                rows="8"
                                value={replyModal.message}
                                onChange={(e) => setReplyModal({ ...replyModal, message: e.target.value })}
                            />
                            
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setReplyModal({ open: false, recId: null, message: '' })}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={handleReply}>
                                    Send Private Reply
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminReclamations;

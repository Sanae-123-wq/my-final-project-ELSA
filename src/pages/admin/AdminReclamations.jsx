import React, { useEffect, useState, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaTrashAlt, FaCheckCircle, FaExclamationCircle, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import './AdminModeration.css';

const AdminReclamations = () => {
    const { user } = useContext(AuthContext);
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
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
        const matchesSearch = rec.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             rec.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
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
            <div className="admin-page-header">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="admin-main-title">Reclamation Management</h1>
                        <p className="admin-subtitle">Respond to client complaints and manage service quality</p>
                    </div>
                </div>

                <div className="admin-controls-grid">
                    <div className="admin-search-wrapper">
                        <FaSearch className="admin-search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by client or message..." 
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="admin-filter-wrapper">
                        <FaFilter className="admin-filter-icon" />
                        <select 
                            className="admin-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="answered">Answered</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="reclamations-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Message Preview</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.map(rec => (
                                <motion.tr 
                                    key={rec._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td>
                                        <div className="client-info-cell">
                                            <strong>{rec.userId?.name}</strong>
                                            <span className="text-xs text-gray-500">{rec.userId?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="message-preview-cell" title={rec.message}>
                                            {rec.message.length > 60 ? rec.message.substring(0, 60) + '...' : rec.message}
                                        </div>
                                    </td>
                                    <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`admin-status-badge badge-${rec.status}`}>
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions-cell">
                                            <button 
                                                onClick={() => setReplyModal({ open: true, recId: rec._id, message: rec.adminReply || '' })}
                                                className="admin-btn-icon reply" 
                                                title="Reply"
                                            >
                                                <FaReply />
                                            </button>
                                            <button className="admin-btn-icon view" title="View Details">
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {replyModal.open && (
                <div className="admin-modal-overlay">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="admin-modal"
                        style={{ maxWidth: '600px', width: '90%' }}
                    >
                        <h2 className="modal-title">Reply to Reclamation</h2>
                        <textarea 
                            className="admin-textarea"
                            placeholder="Write your response to the client..."
                            rows="6"
                            value={replyModal.message}
                            onChange={(e) => setReplyModal({ ...replyModal, message: e.target.value })}
                        />
                        <div className="modal-actions mt-4">
                            <button className="btn-secondary" onClick={() => setReplyModal({ open: false, recId: null, message: '' })}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleReply}>
                                Send Response
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminReclamations;

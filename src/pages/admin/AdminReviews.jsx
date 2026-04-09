import React, { useEffect, useState, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrashAlt, FaStar, FaSearch, FaFilter, FaQuoteLeft, FaExclamationCircle } from 'react-icons/fa';
import './AdminModeration.css';

const AdminReviews = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.fetchAdminReviews();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError('Could not sync with review database.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to hide this review from the public?')) return;
        
        try {
            await api.softDeleteReview(id);
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Failed to delete review:', err);
            alert('Failed to hide review. Please try again.');
        }
    };

    const filtered = reviews.filter(rev => 
        rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-gold)', borderBottomColor: 'var(--pat-gold)' }}></div>
            <p className="ml-4 font-bold text-brown">Synchronizing reviews...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 m-12">
            <FaExclamationCircle className="text-red-400 mx-auto mb-4" size={50} />
            <h3 className="text-2xl font-bold text-red-800 mb-2">{error}</h3>
            <p className="text-red-600 mb-6 font-medium">Please check your internet connection or admin permissions.</p>
            <button 
                onClick={fetchReviews} 
                className="bg-red-500 px-6 py-2 rounded-xl text-white font-bold hover:bg-orange-600 transition-all shadow-md"
                style={{ backgroundColor: '#D97706' }}
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="admin-reviews-page">
            <div className="admin-page-header mb-8">
                <div>
                    <h1 className="admin-main-title">Review Moderation</h1>
                    <p className="admin-subtitle">Maintain your brand quality by managing customer feedback</p>
                </div>
            </div>

            <div className="admin-controls-grid mb-6">
                <div className="admin-search-wrapper">
                    <FaSearch className="admin-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search reviews or authors..." 
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                    {filtered.map(rev => (
                        <motion.div 
                            key={rev._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="admin-review-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < rev.rating ? 'text-amber-500' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(rev._id)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg"
                                        title="Hide Review"
                                    >
                                        <FaTrashAlt size={16} />
                                    </button>
                                </div>
                                
                                <div className="relative mb-4">
                                    <FaQuoteLeft className="absolute -left-2 -top-2 text-gray-100" size={24} />
                                    <p className="text-gray-700 italic relative z-10 pl-4">
                                        {rev.comment}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                <span className="font-bold text-gray-800">{rev.name}</span>
                                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 opacity-40">
                    <FaStar size={50} className="mx-auto mb-4" />
                    <p>No reviews matching your search found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;

import React, { useEffect, useState, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrashAlt, FaStar, FaQuoteLeft, FaExclamationCircle } from 'react-icons/fa';
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
        (rev.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (rev.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--pat-brown)', borderBottomColor: 'var(--pat-brown)' }}></div>
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
                style={{ backgroundColor: '#5C4033' }}
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="admin-reviews-page">
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-main-title">Review Moderation</h1>
                    <p className="admin-subtitle">Maintain your brand quality by managing customer feedback</p>
                </div>

                <div className="admin-controls-grid">
                    <div className="admin-search-wrapper">
                        <input 
                            type="text" 
                            placeholder="Search by author or content..." 
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="admin-reviews-grid">
                <AnimatePresence>
                    {filtered.map(rev => (
                        <motion.div 
                            key={rev._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="admin-review-card"
                        >
                            <FaQuoteLeft className="admin-quote-icon" size={40} />
                            
                            <div className="admin-review-content">
                                <div className="card-header-actions">
                                    <div className="stars-wrapper">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar 
                                                key={i} 
                                                size={16} 
                                                className={i < rev.rating ? 'star-active' : 'star-inactive'} 
                                            />
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(rev._id)}
                                        className="btn-delete-icon"
                                        title="Hide Review from Public"
                                    >
                                        <FaTrashAlt size={14} />
                                    </button>
                                </div>
                                
                                <p className="admin-review-text">
                                    {rev.comment}
                                </p>
                            </div>

                            <div className="admin-review-footer">
                                <span className="admin-review-author">{rev.name}</span>
                                <span className="admin-review-date">
                                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="empty-reviews-state">
                    <div className="empty-icon-wrapper">
                        <FaStar size={80} />
                    </div>
                    <p className="empty-text">No reviews found</p>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;

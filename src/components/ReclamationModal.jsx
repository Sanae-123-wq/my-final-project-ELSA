import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationCircle } from 'react-icons/fa';
import './ReclamationModal.css';

const ReclamationModal = ({ isOpen, onClose, onSuccess, orderId, orderNumber }) => {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const res = await fetch('http://localhost:5000/api/reclamations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId, message })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Submission failed');

            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess(orderId);
                onClose();
                setSuccess(false);
                setMessage('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="reclamation-overlay">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="reclamation-modal"
                >
                    <div className="reclamation-header">
                        <div className="reclamation-header-left">
                            <div className="reclamation-header-icon">
                                <FaExclamationCircle size={20} />
                            </div>
                            <h2 className="reclamation-title">Report a Problem</h2>
                        </div>
                        <button onClick={onClose} className="reclamation-close-btn">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="reclamation-body">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="reclamation-success"
                            >
                                <span className="reclamation-success-icon">✅</span>
                                <h3 className="reclamation-success-title">Complaint Submitted</h3>
                                <p className="reclamation-success-text">We've received your message and our team will get back to you shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="reclamation-order-ref">
                                    <span>Order Reference:</span>
                                    <span className="reclamation-order-ref-bold">#{orderNumber}</span>
                                </div>

                                {error && (
                                    <div className="reclamation-error">
                                        <FaExclamationCircle className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label className="reclamation-label">
                                        What happened?
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="reclamation-textarea"
                                        placeholder="Tell us more about the issue (missing item, damaged cake, late delivery, etc.)"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="reclamation-submit-btn"
                                >
                                    {submitting ? 'Submitting...' : 'Send Complaint'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReclamationModal;

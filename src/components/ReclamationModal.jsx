import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationCircle } from 'react-icons/fa';

const ReclamationModal = ({ isOpen, onClose, orderId, orderNumber }) => {
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
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-brown-dark/20 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-brown/5 flex justify-between items-center bg-cream/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange/10 rounded-lg text-orange">
                                <FaExclamationCircle size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-brown-dark font-display">Report a Problem</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-brown/5 rounded-full text-brown/40 transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {success ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="text-5xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-brown-dark mb-2">Complaint Submitted</h3>
                                <p className="text-brown/60">We've received your message and will get back to you shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 p-4 bg-orange/5 rounded-xl border border-orange/10">
                                    <p className="text-sm text-brown/60">
                                        Order Reference: <span className="font-bold text-brown-dark">#{orderNumber}</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                                        <FaExclamationCircle className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-brown-dark mb-2 ml-1">
                                        What happened?
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full h-32 p-4 rounded-2xl border border-brown/10 focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all outline-none resize-none text-brown bg-cream-light/30"
                                        placeholder="Tell us more about the issue (missing item, damaged cake, etc.)"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-brown-dark text-white rounded-2xl font-bold hover:bg-brown transition-all shadow-lg shadow-brown/20 disabled:opacity-50"
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

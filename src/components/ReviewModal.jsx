import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { api } from '../services/api';

const ReviewModal = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await api.submitReview({ name, rating, comment });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                // Reset form
                setSuccess(false);
                setName('');
                setComment('');
                setRating(0);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                {success ? (
                    <div className="modal-success">
                        <div className="success-icon">✓</div>
                        <h2>Thank You!</h2>
                        <p>Your review has been submitted for approval. We appreciate your feedback!</p>
                    </div>
                ) : (
                    <>
                        <h2>Share Your <span className="highlight">Experience</span></h2>
                        <p>How was your ELSA pastry journey? We'd love to hear from you.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="star-rating-input">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index}>
                                            <input 
                                                type="radio" 
                                                name="rating" 
                                                value={ratingValue} 
                                                onClick={() => setRating(ratingValue)}
                                            />
                                            <FaStar 
                                                className="star" 
                                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="form-group">
                                <label>Your Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you loved..."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            {error && <p className="error-text">{error}</p>}

                            <button 
                                type="submit" 
                                className="btn-primary w-full" 
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;

import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaPen } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import ReviewModal from './ReviewModal';

const Testimonials = () => {
    const { t } = useLanguage();
    const { checkAuth } = useContext(AuthContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [liveReviews, setLiveReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const baselineTestimonials = [
        {
            id: 'b1',
            name: "Sarah Miller",
            role: "Pastry Enthusiast",
            text: "Every bite is a dream! The macarons are to die for and the delivery was incredibly professional.",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            rating: 5
        },
        {
            id: 'b2',
            name: "Karim Benali",
            role: "Food Blogger",
            text: "Best pastry in Agadir. The quality of ingredients really stands out. High quality and super fast delivery.",
            avatar: "https://i.pravatar.cc/150?u=karim",
            rating: 5
        },
        {
            id: 'b3',
            name: "Elena Rossi",
            role: "Regular Customer",
            text: "Absolutely love the croissant box. Perfect for Sunday mornings with the family. Truly authentic French taste.",
            avatar: "https://i.pravatar.cc/150?u=elena",
            rating: 5
        }
    ];

    // Combine baseline and live reviews
    const allReviews = useMemo(() => {
        const formattedLive = liveReviews.map(rev => ({
            id: rev._id,
            name: rev.name,
            role: "Customer",
            text: rev.comment,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=EDE0D4&color=7F5539`,
            rating: rev.rating
        }));
        return [...baselineTestimonials, ...formattedLive];
    }, [liveReviews]);

    // Fetch live reviews
    const fetchReviews = async () => {
        try {
            const data = await api.getReviews();
            setLiveReviews(data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (allReviews.length === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(interval);
    }, [currentIndex, allReviews.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= allReviews.length - (window.innerWidth < 768 ? 1 : 3) ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, allReviews.length - (window.innerWidth < 768 ? 1 : 3)) : prev - 1));
    };

    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="testimonials-header">
                    <h2>What Our <span className="highlight">Customers</span> Say</h2>
                    <p>Discover why ELSA is Agadir's favorite pastry destination.</p>
                </div>

                <div className="testimonials-slider-container">
                    <button className="slider-btn prev" onClick={prevSlide}>
                        <FaChevronLeft />
                    </button>

                    <div className="testimonials-track-wrapper">
                        <div 
                            className="testimonials-track" 
                            style={{ 
                                transform: `translateX(-${currentIndex * (100 / (window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3)))}%)` 
                            }}
                        >
                            {allReviews.map((review) => (
                                <div className="testimonial-card-wrapper" key={review.id}>
                                    <div className="testimonial-card">
                                        <div className="testimonial-stars">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                        </div>
                                        <p className="testimonial-text">"{review.text}"</p>
                                        <div className="testimonial-user">
                                            <img src={review.avatar} alt={review.name} />
                                            <div className="user-info">
                                                <h4>{review.name}</h4>
                                                <span>{review.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="slider-btn next" onClick={nextSlide}>
                        <FaChevronRight />
                    </button>
                </div>

                <div className="testimonial-dots">
                    {allReviews.slice(0, Math.max(1, allReviews.length - (window.innerWidth < 1024 ? 1 : 2))).map((_, idx) => (
                        <button 
                            key={idx} 
                            className={`dot ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>

                <div className="testimonials-footer">
                    <button 
                        className="btn-review" 
                        onClick={() => {
                            if (checkAuth()) {
                                setIsModalOpen(true);
                            }
                        }}
                    >
                        <FaPen style={{ marginRight: '8px', fontSize: '14px' }} /> Leave your review
                    </button>
                </div>
            </div>

            <ReviewModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    fetchReviews(); // Refresh after user submits
                }} 
            />
        </section>
    );
};


export default Testimonials;

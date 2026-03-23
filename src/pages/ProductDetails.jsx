import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const StarRating = ({ rating, setRating, interactive = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={`star-btn ${starValue <= (hover || rating) ? 'active' : ''}`}
                        onClick={() => interactive && setRating(starValue)}
                        onMouseEnter={() => interactive && setHover(starValue)}
                        onMouseLeave={() => interactive && setHover(0)}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [qty, setQty] = useState(1);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    // Review form state
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.fetchProductById(id);
                setProduct(data);
                
                // Fetch all products to filter related products (same category)
                const allProducts = await api.fetchProducts();
                const related = allProducts.filter(p => p.category === data.category && p._id !== data._id);
                setRelatedProducts(related);
                
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewName || !reviewRating || !reviewComment) {
            alert('Please fill in all fields and select a rating.');
            return;
        }

        setSubmittingReview(true);
        try {
            const newReview = await api.addReview(id, {
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment
            });

            // Update local state instantly
            setProduct(prev => ({
                ...prev,
                reviews: [newReview, ...(prev.reviews || [])]
            }));

            // Clear form
            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loader"></div>
            <p className="ml-4">Loading sweets...</p>
        </div>
    );

    if (!product) return (
        <div className="container text-center" style={{ marginTop: '4rem' }}>
            <h2>Product not found</h2>
            <Link to="/" style={{ color: 'var(--primary-color)' }}>Return Home</Link>
        </div>
    );

    const averageRating = product.reviews?.length > 0 
        ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
        : 0;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="product-details-container">
                <div className="product-gallery">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image-main"
                    />
                </div>

                <div className="detail-content">
                    <span className="category">{t.categories && t.categories[product.category] ? t.categories[product.category] : product.category}</span>
                    <h1>{product[`name_${language}`] || product.name}</h1>
                    
                    <div className="product-meta-top">
                        <div className="stars-info">
                            <StarRating rating={Math.round(averageRating)} />
                            <span className="rating-avg">{averageRating}</span>
                            <span className="review-count">({product.reviews?.length || 0} reviews)</span>
                        </div>
                    </div>

                    <p className="detail-price-main">${product.price.toFixed(2)}</p>

                    <p className="detail-description">{product[`description_${language}`] || product.description}</p>

                    <div className="add-to-cart-box-classic">
                        <div className="qty-control">
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Quantity</span>
                            <div className="qty-counter">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn">-</button>
                                <input readOnly type="number" value={qty} className="qty-input" />
                                <button onClick={() => setQty(qty + 1)} className="qty-btn">+</button>
                            </div>
                        </div>

                        <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
                            Add to Cart
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            &larr; Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            {/* Classic Reviews Section */}
            <div className="reviews-section-classic fade-in">
                <div className="reviews-header">
                    <h2>Customer Reviews ({product.reviews?.length || 0})</h2>
                    <div className="average-rating-display">
                        <span className="large-rating">{averageRating}</span>
                        <div className="stars-vertical">
                            <StarRating rating={Math.round(averageRating)} />
                            <span className="total-reviews-count">Based on {product.reviews?.length || 0} reviews</span>
                        </div>
                    </div>
                </div>

                <div className="reviews-grid">
                    <div className="review-form-column">
                        <div className="review-form-classic">
                            <h3>Write a Review</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input 
                                        type="text" 
                                        value={reviewName} 
                                        onChange={(e) => setReviewName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <StarRating 
                                        rating={reviewRating} 
                                        setRating={setReviewRating} 
                                        interactive={true} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Comment</label>
                                    <textarea 
                                        value={reviewComment} 
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    disabled={submittingReview}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="reviews-list-column">
                        <div className="reviews-list-classic">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div key={review._id} className="review-card-classic slide-up">
                                        <div className="review-card-header">
                                            <strong>{review.name}</strong>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="review-comment-classic">{review.comment}</p>
                                        <span className="review-date-classic">{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-reviews-placeholder">
                                    <p>No reviews yet. Be the first to review this pastry!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Related Desserts</h2>
                    <div className="related-products-scroll">
                        {relatedProducts.map(p => (
                            <Link to={`/product/${p._id}`} key={p._id} className="related-product-card">
                                <img src={p.image} alt={p[`name_${language}`] || p.name} className="related-product-image" />
                                <h3>{p[`name_${language}`] || p.name}</h3>
                                <p>${p.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

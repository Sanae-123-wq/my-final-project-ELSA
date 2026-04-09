import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { FaLock } from 'react-icons/fa';

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
    const { user, checkAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    // Gallery State
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [touchStart, setTouchStart] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.fetchProductById(id);
                setProduct(data);
                setActiveImgIndex(0); // Reset for new product

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

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const images = product.images || [product.image];
        if (touchStart - touchEnd > 50) {
            // Swipe Left
            setActiveImgIndex((prev) => (prev + 1) % images.length);
        } else if (touchStart - touchEnd < -50) {
            // Swipe Right
            setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const handleAddToCart = () => {
        if (!checkAuth()) return;
        
        const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
        addToCart({
            ...product,
            price: discountedPrice
        }, Number(qty));
        navigate('/cart');
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

    const rawImages = product.images?.length ? product.images : [product.image];
    const images = rawImages.map(resolveImageUrl);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="product-details-container">
                <div className="gallery-column">
                    <div
                        className="main-image-viewport"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="image-zoom-overlay"
                            style={{
                                backgroundImage: `url(${images[activeImgIndex]})`,
                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                opacity: isZooming ? 1 : 0
                            }}
                        />
                        <img
                            src={images[activeImgIndex]}
                            alt={product.name}
                            className={`main-image ${isZooming ? 'zoomed-hidden' : ''}`}
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="thumbnail-row">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail-box ${idx === activeImgIndex ? 'active' : ''}`}
                                    onClick={() => setActiveImgIndex(idx)}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="detail-content">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="category">{t.categories && t.categories[product.category] ? t.categories[product.category] : product.category}</span>
                        {product.discount > 0 && <span className="discount-badge" style={{ position: 'static' }}>-{product.discount}% OFF</span>}
                    </div>
                    <h1>{product[`name_${language}`] || product.name}</h1>

                    <p className="detail-description">{product[`description_${language}`] || product.description}</p>

                    <div className="price-container mb-6">
                        <span className={`detail-price-main ${product.discount > 0 ? 'discounted text-red-500' : ''}`} style={{ fontSize: '2rem', fontWeight: 800 }}>
                            {(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)} MAD
                        </span>
                        {product.discount > 0 && (
                            <span className="original-price" style={{ fontSize: '1.1rem', marginLeft: '12px' }}>
                                {product.price.toFixed(2)} MAD
                            </span>
                        )}
                    </div>

                    <div className="product-detail-rating">
                        <StarRating rating={product.rating || 5} />
                    </div>

                    <div className="stock-info-detail">
                        {product.stock === 0 ? (
                            <span className="stock-status out">Out of Stock</span>
                        ) : product.stock <= 10 ? (
                            <span className="stock-status low">Only {product.stock} left</span>
                        ) : (
                            <span className="stock-status in">In Stock</span>
                        )}
                    </div>

                    <div className="add-to-cart-box-classic">
                        <div className={`qty-control ${product.stock === 0 ? 'disabled' : ''}`}>
                            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantity</span>
                            <div className="qty-counter">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="qty-btn"
                                    disabled={product.stock === 0}
                                >-</button>
                                <input
                                    readOnly
                                    type="number"
                                    value={qty}
                                    className="qty-input"
                                />
                                <button
                                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                    className="qty-btn"
                                    disabled={product.stock === 0 || qty >= product.stock}
                                >+</button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`btn-primary ${product.stock === 0 ? 'disabled' : ''}`}
                            disabled={product.stock === 0}
                            style={{ width: '100%', padding: '0.8rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {!user && <FaLock size={14} />}
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/shop" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            &larr; Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{ paddingBottom: '2rem' }}></div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Related Desserts</h2>
                    <div className="related-products-scroll">
                        {relatedProducts.map(p => (
                            <Link to={`/product/${p._id}`} key={p._id} className="related-product-card">
                                <img src={resolveImageUrl(p.image)} alt={p[`name_${language}`] || p.name} className="related-product-image" />
                                <h3>{p[`name_${language}`] || p.name}</h3>
                                <p>{p.price.toFixed(2)} MAD</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

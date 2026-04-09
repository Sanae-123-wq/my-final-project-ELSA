import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import CartContext from '../context/CartContext';
import FavoritesContext from '../context/FavoritesContext';
import { resolveImageUrl } from '../utils/imageUrl';

const ProductCard = ({ product }) => {
    const { t, language } = useLanguage();
    const { addToCart } = useContext(CartContext);
    const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

    // Gallery State
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    const favored = isFavorite(product._id);
    const rawImages = product.images?.length ? product.images : [product.image];
    const images = rawImages.map(resolveImageUrl);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        if (touchStart - touchEnd > 40) {
            // Swipe Left
            setActiveImgIndex((prev) => (prev + 1) % images.length);
        } else if (touchStart - touchEnd < -40) {
            // Swipe Right
            setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const honoredPrice = (product.price * (1 - (product.discount || 0) / 100)).toFixed(2);
    const hasDiscount = product.discount > 0;

    return (
        <div className="product-card">
            <div
                className="product-image"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {product.isNew && <div className="product-badge new">New</div>}
                {hasDiscount && <div className="discount-badge">-{product.discount}%</div>}
                <button
                    className={`product-wishlist ${favored ? 'active' : ''}`}
                    aria-label={favored ? "Remove from Favorites" : "Add to Favorites"}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product._id);
                    }}
                >
                    {favored ? <FaHeart /> : <FaRegHeart />}
                </button>

                <Link to={`/product/${product._id}`}>
                    <img
                        src={images[activeImgIndex]}
                        alt={product[`name_${language}`] || product.name}
                        loading="lazy"
                        className="card-main-img"
                    />
                </Link>

                {images.length > 1 && (
                    <div className="card-thumbnails">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`card-dot ${idx === activeImgIndex ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${img})` }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveImgIndex(idx);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="product-info">
                <span className="category">{t.categories && t.categories[product.category] ? t.categories[product.category] : product.category}</span>
                <Link to={`/product/${product._id}`}>
                    <h2 className="product-title">{product[`name_${language}`] || product.name}</h2>
                </Link>

                <div className="product-card-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < Math.floor(product.rating || 5) ? 'filled' : ''}`}>★</span>
                        ))}
                    </div>
                    <span className="review-count">({product.numReviews || 0})</span>
                </div>

                <div className="product-bottom">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="price-container">
                            <span className={`price-tag ${hasDiscount ? 'discounted' : ''}`}>
                                ${honoredPrice}
                            </span>
                            {hasDiscount && (
                                <span className="original-price">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="stock-status-inline" style={{ marginTop: '0' }}>
                            {product.stock === 0 ? (
                                <span className="stock-msg out">Out of Stock</span>
                            ) : product.stock <= 10 ? (
                                <span className="stock-msg low">Only {product.stock} left</span>
                            ) : (
                                <span className="stock-msg in">In Stock</span>
                            )}
                        </div>
                    </div>

                    <button
                        className={`btn-cart ${product.stock === 0 ? 'disabled' : ''}`}
                        aria-label="Add to Cart"
                        disabled={product.stock === 0}
                        onClick={(e) => {
                            e.preventDefault();
                            if (product.stock > 0) {
                                addToCart({
                                    ...product,
                                    price: parseFloat(honoredPrice)
                                }, 1);
                            }
                        }}
                    >
                        <FaShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;

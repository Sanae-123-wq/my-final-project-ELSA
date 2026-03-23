import { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CartContext from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();
    const { addToCart } = useContext(CartContext);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.fetchProducts();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const displayedProducts = categoryQuery 
        ? products.filter(p => p.category === categoryQuery)
        : products;

    // Calculate product counts for categories
    const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const totalCount = products.length;
    const currentCount = displayedProducts.length;

    return (
        <div className="container py-12 shop-page-layout">
            <div className="shop-main-content">
                <div className="text-center mb-16">
                    <h1 className="section-title">
                        {categoryQuery ? (t.categories && t.categories[categoryQuery] ? t.categories[categoryQuery] : categoryQuery) : t.shopPage.title}
                        {!categoryQuery && <span className="highlight"> {t.shopPage.titleHighlight}</span>}
                        <span className="count-badge">({currentCount})</span>
                    </h1>
                    <p className="section-subtitle">
                        {categoryQuery ? `Browsing our ${currentCount} delicious items in ${categoryQuery}` : t.shopPage.subtitle} 
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center" style={{ height: '300px' }}>
                        <div className="loader"></div>
                        <p className="text-center ml-4">{t.common.loading}</p>
                    </div>
                ) : (
                    <div className="product-grid fade-in">
                        {displayedProducts.length > 0 ? displayedProducts.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                    <div className="price-tag">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="product-info">
                                    <span className="category">{t.categories && t.categories[product.category] ? t.categories[product.category] : product.category}</span>
                                    <Link to={`/product/${product._id}`}>
                                        <h2 className="product-title">{product[`name_${language}`] || product.name}</h2>
                                    </Link>
                                    <div className="product-rating">
                                        <span className="star">★</span>
                                        <span className="rating-value">4.8</span>
                                        <span className="rating-count">(120)</span>
                                    </div>
                                    <div className="product-bottom">
                                        <button 
                                            className="btn-cart" 
                                            aria-label="Add to Cart" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                addToCart(product, 1);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-category-state">
                                <div className="empty-icon">🍰</div>
                                <h3>No products available in this category yet.</h3>
                                <p>We're working on adding delicious new items here very soon!</p>
                                <Link to="/shop" className="btn-primary">Browse All Products</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <CartSidebar />
        </div>
    );
};

export default Shop;

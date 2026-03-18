import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import CartContext from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [qty, setQty] = useState(1);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Loading...
        </div>
    );

    if (!product) return (
        <div className="container text-center" style={{ marginTop: '4rem' }}>
            <h2>Product not found</h2>
            <Link to="/" style={{ color: 'var(--primary-color)' }}>Return Home</Link>
        </div>
    );

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
                    <span className="category">{product.category}</span>
                    <h1>{product.name}</h1>
                    <p className="detail-price">${product.price.toFixed(2)}</p>

                    <p className="detail-description">{product.description}</p>

                    <div className="add-to-cart-box">
                        <div className="qty-control">
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Quantity</span>
                            <div className="qty-counter">
                            <button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="qty-btn"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                                className="qty-input"
                            />
                            <button
                                onClick={() => setQty(qty + 1)}
                                className="qty-btn"
                            >
                                +
                            </button>
                        </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn-primary"
                            style={{ width: '100%' }}
                        >
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

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Related Desserts</h2>
                    <div className="related-products-scroll">
                        {relatedProducts.map(p => (
                            <Link to={`/product/${p._id}`} key={p._id} className="related-product-card">
                                <img src={p.image} alt={p.name} className="related-product-image" />
                                <h3>{p.name}</h3>
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

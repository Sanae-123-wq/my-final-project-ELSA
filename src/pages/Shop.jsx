import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    
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

    return (
        <div className="container py-12">
            <div className="text-center mb-16">
                <h1 className="section-title">
                    {categoryQuery ? categoryQuery : t.shopPage.title}
                    {!categoryQuery && <span className="highlight"> {t.shopPage.titleHighlight}</span>}
                </h1>
                <p className="section-subtitle">
                    {categoryQuery ? `Explore our delicious ${categoryQuery} selection` : t.shopPage.subtitle}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <p className="text-center">{t.common.loading}</p>
                </div>
            ) : (
                <div className="product-grid">
                    {displayedProducts.length > 0 ? displayedProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <div className="product-image">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />
                                <div className="price-tag">
                                    ${product.price.toFixed(2)}
                                </div>
                            </div>
                            <div className="product-info">
                                <div className="mb-4">
                                    <span className="category">{product.category}</span>
                                    <h2 className="product-title">{product.name}</h2>
                                </div>
                                <p className="product-desc">{product.description}</p>
                                <Link to={`/product/${product._id}`} className="btn-primary text-center">
                                    {t.common.viewDetails}
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center w-full" style={{ gridColumn: '1 / -1' }}>
                            <p>No products found in this category.</p>
                            <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>View All Products</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import FavoritesContext from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { FaHeart } from 'react-icons/fa';

const Favorites = () => {
    const { t } = useLanguage();
    const { favorites, clearOrphans } = useContext(FavoritesContext);
    const [favProducts, setFavProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavProducts = async () => {
            try {
                const allProducts = await api.fetchProducts();
                
                // Identify which IDs in our favorites actually exist in the DB
                const validProducts = allProducts.filter(p => favorites.includes(p._id));
                const validIds = validProducts.map(p => p._id);
                
                // If there's a mismatch, clean up the orphaned IDs from our context
                if (validIds.length !== favorites.length) {
                    clearOrphans(validIds);
                }

                setFavProducts(validProducts);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
                setLoading(false);
            }
        };

        fetchFavProducts();
    }, [favorites, clearOrphans]);

    return (
        <div className="container py-12">
            <div className="text-center mb-16">
                <h1 className="section-title">
                    My <span className="highlight">Favorites</span>
                    <span className="count-badge">({favProducts.length})</span>
                </h1>
                <p className="section-subtitle">
                    All your favorite sweet treats in one place.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <div className="loader"></div>
                </div>
            ) : favProducts.length > 0 ? (
                <div className="product-grid fade-in">
                    {favProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="empty-category-state">
                    <div className="empty-icon">
                        <FaHeart style={{ color: '#eee' }} />
                    </div>
                    <h3>No favorites yet.</h3>
                    <p>Start exploring our treats and heart your favorites!</p>
                    <Link to="/shop" className="btn-primary">Go to Shop</Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;

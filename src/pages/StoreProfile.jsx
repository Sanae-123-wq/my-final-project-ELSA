import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import CartContext from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import ProductCard from '../components/ProductCard';
import { FaMapMarkerAlt, FaPhone, FaArrowLeft, FaStore } from 'react-icons/fa';
import { resolveImageUrl } from '../utils/imageUrl';

const StoreProfile = () => {
    const { id } = useParams();
    const { t, language } = useLanguage();
    const { addToCart } = useContext(CartContext);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchStoreData = async () => {
            try {
                const data = await api.fetchStoreById(id);
                // Ensure image URLs are correct
                const formattedStore = {
                    ...data,
                    image: resolveImageUrl(data.image),
                    materials: (data.materials || []).map(p => ({
                        ...p,
                        image: resolveImageUrl(p.image)
                    }))
                };
                setStore(formattedStore);
            } catch (err) {
                console.error('Error fetching store:', err);
                setError('Store not found or connection error');
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [id]);

    if (loading) return (
        <div className="container py-20 text-center">
            <div className="loader mx-auto mb-4"></div>
            <p>{t.common?.loading || 'Loading store details...'}</p>
        </div>
    );

    if (error || !store) return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">{error || 'Store not found'}</h2>
            <Link to="/stores" className="btn-primary inline-flex items-center gap-2">
                <FaArrowLeft /> Back to Sweets Stores
            </Link>
        </div>
    );

    return (
        <div className="store-profile-page">
            {/* Store Hero Banner */}
            <section className="store-hero-section">
                <div className="container px-4">
                    <div className="store-profile-header">
                        <Link to="/stores" className="back-link mb-8 inline-flex items-center gap-2 text-primary">
                            <FaArrowLeft /> {t.storesPage?.backToStores || 'Back to Stores'}
                        </Link>
                        
                        <div className="store-header-content">
                            <div className="store-profile-image-container">
                                {store.image ? (
                                    <img src={store.image} alt={store.name} className="store-profile-img" />
                                ) : (
                                    <div className="store-profile-placeholder">
                                        <FaStore size={40} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="store-header-text">
                                <h1 className="store-title">{store.name}</h1>
                                
                                <div className="store-meta-info">
                                    <div className="meta-item">
                                        <FaMapMarkerAlt />
                                        <span>{store.location}</span>
                                    </div>
                                    {store.phone && (
                                        <div className="meta-item">
                                            <FaPhone />
                                            <span>{store.phone}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="store-header-desc">
                                    {store.description || 'Welcome to our bakery. We specialize in handcrafted sweets and traditional pastries made with love.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Store Products Section */}
            <div className="container py-16 shop-page-layout">
                <div className="shop-main-content">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="section-title text-3xl mb-0">
                            {t.storesPage?.ourProducts || "Our Sweets Collection"}
                            <span className="count-badge ml-4">({store.materials?.length || 0})</span>
                        </h2>
                        <div className="h-px bg-primary-light flex-grow ml-8 opacity-30 hidden md:block"></div>
                    </div>

                    {store.materials?.length > 0 ? (
                        <div className="product-grid">
                            {store.materials.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                            <p className="text-xl text-gray-400">No products available at this store yet.</p>
                        </div>
                    )}
                </div>
                <CartSidebar />
            </div>
        </div>
    );
};

export default StoreProfile;

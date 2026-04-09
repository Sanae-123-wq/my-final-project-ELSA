import { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaStar, FaChevronRight } from 'react-icons/fa';
import { resolveImageUrl } from '../utils/imageUrl';

const Stores = () => {
    const { t } = useLanguage();
    const { addToCart } = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadStores = async () => {
            try {
                const data = await api.fetchStores();
                // Ensure image URLs are correct
                const formattedData = data.map(store => ({
                    ...store,
                    image: resolveImageUrl(store.image),
                    materials: (store.materials || []).map(mat => ({
                        ...mat,
                        image: resolveImageUrl(mat.image)
                    }))
                }));
                setStores(formattedData);
            } catch (err) {
                console.error('Error loading stores:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStores();
    }, []);

    const filteredStores = stores.map(store => {
        // Keep all products within the store as category filtering is removed
        return {
            ...store,
            materials: store.materials || []
        };
    }).filter(store => {
        // Filter stores based on search term (store name or description)
        const matchesSearch = (store.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (store.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    if (loading) return (
        <div className="container py-20 text-center">
            <div className="loader mx-auto mb-4"></div>
            <p>{t.common?.loading || 'Loading stores...'}</p>
        </div>
    );

    const handleAddToCart = (item) => {
        addToCart({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category || (item.ingredients ? 'Pack' : 'Material')
        }, 1);
    };

    return (
        <div className="container py-12 shop-page-layout">
            <div className="shop-main-content">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="section-title">
                        {t.storesPage.title}
                        <span className="highlight">{t.storesPage.titleHighlight}</span>
                    </h1>
                    <p className="section-subtitle">
                        {t.storesPage.subtitle}
                    </p>
                </div>

                {/* Search Section */}
                <div className="search-filter-section mb-16">
                    <div className="search-container mb-0">
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder={t.storesPage.searchPlaceholder}
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Partner Stores Section */}
                <section className="stores-section">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="section-title text-2xl mb-0">{t.storesPage.allStores}</h2>
                        <div className="h-px bg-primary-light flex-grow ml-8 opacity-30 hidden md:block"></div>
                    </div>
                    <div className="stores-grid">
                        {filteredStores.length > 0 ? (
                            filteredStores.map(store => (
                                <div key={store._id} className="store-card">
                                    <div className="store-header">
                                        <div className="store-image-wrapper">
                                            <img src={store.image} alt={store.name} className="store-image" />
                                            {store.discount && (
                                                <div className="discount-badge">-{store.discount}%</div>
                                            )}
                                        </div>
                                        <div className="store-info">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="store-name text-2xl mb-0">{store.name}</h2>
                                                <div className="flex items-center gap-1 text-primary-color font-bold">
                                                    <FaStar size={14} /> <span>{store.rating || '4.5'}</span>
                                                </div>
                                            </div>
                                            <div className="store-location text-sm text-gray-500 mb-2">
                                                <FaMapMarkerAlt /> {store.location}
                                            </div>
                                            <p className="store-description text-sm text-gray-600 line-clamp-2">
                                                {store.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="store-materials-section">
                                        <h4 className="materials-title">{t.storesPage.availableProducts || 'Available Products'}</h4>
                                        <div className="materials-grid">
                                            {store.materials.slice(0, 4).map(product => (
                                                <div key={product._id} className="material-item">
                                                    <Link to={`/product/${product._id}`} className="product-thumb-container block">
                                                        <img src={product.image} alt={product.name} className="material-thumb" />
                                                        {product.discount > 0 && (
                                                             <span className="product-discount-tag">-{product.discount}%</span>
                                                        )}
                                                    </Link>
                                                    <div className="material-details">
                                                        <Link to={`/product/${product._id}`} className="material-name text-sm block hover:text-primary transition-colors">
                                                            {product.name}
                                                        </Link>
                                                        <div className="material-footer">
                                                            <span className="material-price text-sm">${product.price.toFixed(2)}</span>
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                className="add-material-btn"
                                                            >
                                                                <FaShoppingCart size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="store-card-footer mt-6">
                                        <Link 
                                            to={`/store/${store._id}`}
                                            className="view-store-btn w-full flex items-center justify-center gap-2 no-underline"
                                        >
                                            {t.storesPage.viewStore || 'View Store'} <FaChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 w-full">
                                <p className="text-xl text-gray-400">{t.storesPage.noMaterialsFound}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <CartSidebar />
        </div>
    );
};

export default Stores;

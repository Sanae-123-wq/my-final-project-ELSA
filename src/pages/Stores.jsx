import { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import CartContext from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaStar } from 'react-icons/fa';

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
                setStores(data);
            } catch (err) {
                console.error('Error loading stores:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStores();
    }, []);

    const filteredStores = stores.map(store => ({
        ...store,
        materials: (store.materials || []).filter(mat =>
            mat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(store => (store.materials || []).length > 0 || searchTerm === '');

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
            category: item.ingredients ? 'Pack' : 'Material'
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

            {/* Search Bar */}
            <div className="search-container mb-16">
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

            {/* Partner Stores Section */}
            <section className="stores-section">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="section-title text-2xl mb-0">{t.storesPage.allStores}</h2>
                    <div className="h-px bg-primary-light flex-grow ml-8 opacity-30 hidden md-block"></div>
                </div>
                <div className="stores-grid">
                    {filteredStores.length > 0 ? (
                        filteredStores.map(store => (
                            <div key={store._id} className="store-card">
                                <div className="store-header">
                                    <img src={store.image} alt={store.name} className="store-image" />
                                    <div className="store-info">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="store-name text-2xl mb-0">{store.name}</h2>
                                            <div className="flex items-center gap-1 text-primary-color font-bold">
                                                <FaStar size={14} /> <span>{store.rating}</span>
                                            </div>
                                        </div>
                                        <div className="store-location text-sm text-gray-500">
                                            <FaMapMarkerAlt /> {store.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="store-materials-section">
                                    <h4 className="materials-title">{t.storesPage.materialsSold}</h4>
                                    <div className="materials-grid">
                                        {store.materials.map(material => (
                                            <div key={material._id} className="material-item">
                                                <img src={material.image} alt={material.name} className="material-thumb" />
                                                <div className="material-details">
                                                    <div className="material-name text-sm">{material.name}</div>
                                                    <div className="material-footer">
                                                        <span className="material-price text-sm">${material.price.toFixed(2)}</span>
                                                        <button
                                                            onClick={() => handleAddToCart(material)}
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
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
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

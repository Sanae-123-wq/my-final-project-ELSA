import { useState, useContext } from 'react';
import { useLanguage } from '../context/LanguageContext';
import CartContext from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaStar } from 'react-icons/fa';

const Stores = () => {
    const { t } = useLanguage();
    const { addToCart } = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');

    const stores = [
        {
            _id: 'store_1',
            name: 'Agadir Baking Supplies',
            location: 'Hay Mohammadi, Agadir',
            image: 'https://images.unsplash.com/photo-1534433880541-1442cf397d74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=40',
            rating: 4.8,
            materials: [
                { _id: 'mat_1', name: 'Premium Dark Chocolate', price: 15.50, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_2', name: 'Silicon Cake Mold', price: 22.00, image: 'https://images.unsplash.com/photo-1591115765373-520f765ff793?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_3', name: 'Madagascar Vanilla Pods', price: 12.00, image: 'https://images.unsplash.com/photo-1509358271058-acd22caf935d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' }
            ]
        },
        {
            _id: 'store_2',
            name: 'Pâtisserie Pro Materials',
            location: 'Talborjt, Agadir',
            image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=40',
            rating: 4.9,
            materials: [
                { _id: 'mat_4', name: 'High-Gluten Flour (5kg)', price: 18.00, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_5', name: 'Professional Whisk Set', price: 30.00, image: 'https://images.unsplash.com/photo-1595273670150-db0a3d39d44c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_6', name: 'Edible Gold Leaf', price: 45.00, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' }
            ]
        },
        {
            _id: 'store_3',
            name: 'Organic Baking Grains',
            location: 'Anza, Agadir',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=40',
            rating: 4.7,
            materials: [
                { _id: 'mat_7', name: 'Whole Wheat Flour', price: 10.00, image: 'https://images.unsplash.com/photo-1508315152223-4556447c223a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_8', name: 'Organic Honey', price: 25.00, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_9', name: 'Raw Cane Sugar', price: 8.50, image: 'https://images.unsplash.com/photo-1554304899-73347d468161?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' }
            ]
        },
        {
            _id: 'store_4',
            name: 'Cake Decor Heaven',
            location: 'Cité Dakhla, Agadir',
            image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=40',
            rating: 4.6,
            materials: [
                { _id: 'mat_10', name: 'Natural Food Coloring', price: 12.00, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_11', name: 'Piping Bag Set', price: 20.00, image: 'https://images.unsplash.com/photo-1560697529-7236591c0066?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' },
                { _id: 'mat_12', name: 'Fondant Rollers', price: 18.00, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=40' }
            ]
        }
    ];

    const filteredStores = stores.map(store => ({
        ...store,
        materials: store.materials.filter(mat =>
            mat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(store => store.materials.length > 0);

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

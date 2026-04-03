import { useEffect, useState, useMemo, useContext } from 'react';
import { api } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FavoritesContext from '../context/FavoritesContext';
import CartSidebar from '../components/CartSidebar';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { FaFilter, FaSearch } from 'react-icons/fa';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { t, language } = useLanguage();
    const { favorites } = useContext(FavoritesContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category');

    // Filter state
    const [filters, setFilters] = useState({
        categories: initialCategory ? [initialCategory] : [],
        maxPrice: 100,
        storeId: '',
        isNew: false,
        isPopular: false,
        favoritesOnly: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, storesData] = await Promise.all([
                    api.fetchProducts(),
                    api.fetchStores()
                ]);
                
                setProducts(productsData);
                setStores(storesData);

                if (productsData.length > 0) {
                    const max = Math.max(...productsData.map(p => p.price || 0));
                    setFilters(prev => ({ ...prev, maxPrice: max }));
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived data for filters
    const allCategories = useMemo(() => {
        return [...new Set(products.map(p => p.category))];
    }, [products]);



    const globalMaxPrice = useMemo(() => {
        return products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 100;
    }, [products]);

    // Filtering logic
    const displayedProducts = useMemo(() => {
        const filtered = products.filter(product => {
            // Search filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = (product[`name_${language}`] || product.name).toLowerCase().includes(term);
                const categoryMatch = product.category.toLowerCase().includes(term);
                const descMatch = (product[`description_${language}`] || product.description || '').toLowerCase().includes(term);

                if (!nameMatch && !categoryMatch && !descMatch) {
                    return false;
                }
            }

            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }
            // Price filter
            if (product.price > filters.maxPrice) {
                return false;
            }
            // Store filter
            if (filters.storeId && product.storeId !== filters.storeId) {
                return false;
            }
            // Attribute: New
            if (filters.isNew && !product.isNew) {
                return false;
            }
            // Attribute: Popular
            if (filters.isPopular && !product.isPopular) {
                return false;
            }
            // Favorites filter
            if (filters.favoritesOnly && !favorites.includes(product._id)) {
                return false;
            }
            return true;
        });

        // Sort: "New" products always appear first
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }, [products, filters, favorites, searchTerm, language]);

    const handleReset = () => {
        setSearchTerm('');
        setFilters({
            categories: [],
            maxPrice: globalMaxPrice,
            storeId: '',
            isNew: false,
            isPopular: false,
            favoritesOnly: false
        });
    };

    const hasActiveFilters =
        searchTerm !== '' ||
        filters.categories.length > 0 ||
        filters.maxPrice < globalMaxPrice ||
        filters.storeId ||
        filters.isNew ||
        filters.isPopular ||
        filters.favoritesOnly;

    return (
        <div className="container py-12 shop-page-container">
            {/* Overlay Backdrop */}
            {isFilterOpen && <div className="drawer-overlay" onClick={() => setIsFilterOpen(false)} />}

            {/* Filter Drawer */}
            <ProductFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={allCategories}
                stores={stores}
                filters={filters}
                setFilters={setFilters}
                maxPrice={globalMaxPrice}
                totalProducts={products.length}
                filteredCount={displayedProducts.length}
                onReset={handleReset}
            />

            <div className="shop-page-layout">
                <div className="shop-main-content">
                    <div className="shop-header-actions">
                        <div className="shop-title-group">
                            <h1 className="shop-title">
                                {t.shopPage?.title || 'Our Collection'}
                                <span className="count-badge">({displayedProducts.length})</span>
                            </h1>
                        </div>

                        <div className="shop-actions-right">
                            <div className="shop-search-wrapper">
                                <FaSearch className="search-icon-inline" />
                                <input
                                    type="text"
                                    placeholder={t.shopPage?.searchPlaceholder || 'Search for desserts...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="shop-search-input"
                                />
                            </div>

                            <button
                                className={`filter-toggle-btn ${hasActiveFilters ? 'active' : ''}`}
                                onClick={() => setIsFilterOpen(true)}
                                aria-label="Open filters"
                            >
                                <FaFilter />
                                <span>{t.common?.filters || 'Filters'}</span>
                                {hasActiveFilters && <span className="active-dot"></span>}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center" style={{ height: '300px' }}>
                            <div className="loader"></div>
                            <p className="text-center ml-4">{t.common?.loading || 'Loading...'}</p>
                        </div>
                    ) : (
                        <div className="product-grid fade-in">
                            {displayedProducts.length > 0 ? displayedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            )) : (
                                <div className="empty-category-state">
                                    <div className="empty-icon">🍰</div>
                                    <h3>{t.shopPage?.noProducts || 'No products match your filters.'}</h3>
                                    <p>{t.shopPage?.tryReset || 'Try adjusting your selection or resetting all filters.'}</p>
                                    <button onClick={handleReset} className="btn-primary">
                                        {t.common?.showAll || 'Show All Products'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <CartSidebar />
            </div>
        </div>
    );
};

export default Shop;

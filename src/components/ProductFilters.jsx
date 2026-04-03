import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ProductFilters = ({ 
    isOpen,
    onClose,
    categories, 
    stores, 
    filters, 
    setFilters, 
    maxPrice,
    totalProducts,
    filteredCount,
    onReset
}) => {
    const { t } = useLanguage();

    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const handleAttributeChange = (attr) => {
        setFilters({ ...filters, [attr]: !filters[attr] });
    };

    return (
        <aside className={`shop-sidebar-drawer ${isOpen ? 'open' : ''}`}>
            <div className="filter-header">
                <div className="filter-header-main">
                    <h3>{t.common?.filters || 'Filters'}</h3>
                    <button className="close-drawer-btn" onClick={onClose} aria-label="Close filters">
                        &times;
                    </button>
                </div>
                <button className="reset-btn-minimal" onClick={onReset}>
                    {t.common?.reset || 'Reset All'}
                </button>
            </div>

            <div className="filter-scroll-area">
                <div className="filter-stats-mini">
                    <span>{filteredCount} {t.common?.results || 'results'}</span>
                </div>

                {/* Categories */}
                <div className="filter-section">
                    <h4>{t.common?.categories || 'Categories'}</h4>
                    <div className="filter-options">
                        {categories.map(cat => (
                            <label key={cat} className={`filter-checkbox-item ${filters.categories.includes(cat) ? 'active' : ''}`}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.categories.includes(cat)}
                                    onChange={() => handleCategoryChange(cat)}
                                />
                                <span className="checkbox-label">{t.categories && t.categories[cat] ? t.categories[cat] : cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="filter-section">
                    <h4>{t.common?.priceRange || 'Price Range'}</h4>
                    <div className="price-slider-container">
                        <input 
                            type="range" 
                            min="0" 
                            max={maxPrice} 
                            value={filters.maxPrice} 
                            onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
                            className="price-slider"
                        />
                        <div className="price-labels">
                            <span>$0</span>
                            <span className="current-price-badge">${filters.maxPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Stores Selector (Custom Dropdown) */}
                <div className="filter-section">
                    <h4>{t.common?.stores || 'Stores'}</h4>
                    <div className="custom-store-select-container">
                        <button 
                            className="custom-store-trigger" 
                            onClick={(e) => {
                                e.stopPropagation();
                                const isOpen = e.currentTarget.nextElementSibling.classList.contains('show');
                                document.querySelectorAll('.custom-options-list').forEach(l => l.classList.remove('show'));
                                if (!isOpen) e.currentTarget.nextElementSibling.classList.add('show');
                            }}
                        >
                            <span>
                                {filters.storeId 
                                    ? stores.find(s => s._id === filters.storeId)?.name || 'Unknown Store'
                                    : (t.common?.allStores || 'All Stores')}
                            </span>
                            <span className="dropdown-arrow-icon">▼</span>
                        </button>
                        <div className="custom-options-list">
                            <div 
                                className={`custom-option ${!filters.storeId ? 'selected' : ''}`}
                                onClick={() => {
                                    setFilters({ ...filters, storeId: '' });
                                    document.querySelectorAll('.custom-options-list').forEach(l => l.classList.remove('show'));
                                }}
                            >
                                {t.common?.allStores || 'All Stores'}
                            </div>
                            {stores.map(store => (
                                <div 
                                    key={store._id} 
                                    className={`custom-option ${filters.storeId === store._id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setFilters({ ...filters, storeId: store._id });
                                        document.querySelectorAll('.custom-options-list').forEach(l => l.classList.remove('show'));
                                    }}
                                >
                                    {store.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attributes */}
                <div className="filter-section">
                    <h4>{t.common?.attributes || 'Attributes'}</h4>
                    <div className="filter-options">
                        <label className={`filter-checkbox-item ${filters.isNew ? 'active' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={filters.isNew}
                                onChange={() => handleAttributeChange('isNew')}
                            />
                            <span className="checkbox-label">{t.common?.newItems || 'New Arrivals'}</span>
                        </label>
                        <label className={`filter-checkbox-item ${filters.isPopular ? 'active' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={filters.isPopular}
                                onChange={() => handleAttributeChange('isPopular')}
                            />
                            <span className="checkbox-label">{t.common?.popular || 'Popular'}</span>
                        </label>
                        <label className={`filter-checkbox-item favorites-filter-item ${filters.favoritesOnly ? 'active' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={filters.favoritesOnly}
                                onChange={() => handleAttributeChange('favoritesOnly')}
                            />
                            <span className="checkbox-label">❤️ {t.common?.myFavorites || 'My Favorites'}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="drawer-footer">
                <button className="apply-filters-btn" onClick={onClose}>
                    {t.common?.showResults || 'Show Results'}
                </button>
            </div>
        </aside>
    );
};

export default ProductFilters;

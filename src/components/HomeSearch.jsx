import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaSearch, FaTimes, FaUtensils, FaBoxOpen, FaBirthdayCake } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const HomeSearch = () => {
    const { t, language } = useLanguage();
    const { checkAuth } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [results, setResults] = useState({ products: [], packs: [], recipes: [] });
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);

    // Fetch products once on mount
    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setAllProducts(data.map(p => ({
                ...p,
                image: p.image?.startsWith('http') ? p.image : `http://localhost:5000${p.image}`
            }))))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const lowerQuery = query.toLowerCase();

            const filteredProducts = allProducts.filter(p =>
                p.name?.toLowerCase().includes(lowerQuery) ||
                p.category?.toLowerCase().includes(lowerQuery)
            );

            // Show AI kitchen link for recipe-related keywords
            const recipeKeywords = ['recipe', 'cake', 'bread', 'pastry', 'kika', 'tart', 'macaron', 'recette', 'وصفة'];
            const showRecipe = recipeKeywords.some(k => k.includes(lowerQuery) || lowerQuery.includes(k));

            setResults({
                products: filteredProducts,
                packs: [],
                recipes: showRecipe ? [{ id: 'ai-gen', name: t.navbar?.aiKitchen || 'AI Kitchen', icon: <FaUtensils /> }] : []
            });
            setIsOpen(true);
        } else {
            setResults({ products: [], packs: [], recipes: [] });
            setIsOpen(false);
        }
    }, [query, t, language, allProducts]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clearSearch = () => {
        setQuery('');
        setResults({ products: [], packs: [], recipes: [] });
        setIsOpen(false);
    };

    const hasResults = results.products.length > 0 || results.packs.length > 0 || results.recipes.length > 0;

    return (
        <div className="home-search-container" ref={searchRef}>
            <div className="search-bar-main">
                <FaSearch className="search-icon-left" />
                <input
                    type="text"
                    placeholder={t.homeSearch.placeholder}
                    value={query}
                    onChange={(e) => {
                        if (checkAuth()) {
                            setQuery(e.target.value);
                        }
                    }}
                    onFocus={() => {
                        if (checkAuth() && query.length > 1) {
                            setIsOpen(true);
                        }
                    }}
                />
                {query && (
                    <button className="clear-btn" onClick={clearSearch}>
                        <FaTimes />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="search-results-dropdown shadow-lg">
                    {hasResults ? (
                        <div className="results-scroll">
                            {/* Products Section */}
                            {results.products.length > 0 && (
                                <div className="result-category">
                                    <h4 className="flex items-center gap-2"><FaBirthdayCake /> {t.homeSearch.products}</h4>
                                    {results.products.map(p => (
                                        <Link key={p._id} to={`/product/${p._id}`} className="result-item" onClick={() => setIsOpen(false)}>
                                            <img src={p.image} alt={p.name} />
                                            <span>{p.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Packs Section */}
                            {results.packs.length > 0 && (
                                <div className="result-category">
                                    <h4 className="flex items-center gap-2"><FaBoxOpen /> {t.homeSearch.packs}</h4>
                                    {results.packs.map(p => {
                                        const name = language === 'ar' ? p.name_ar : (language === 'fr' ? p.name_fr : p.name);
                                        return (
                                            <Link key={p._id} to="/stores" className="result-item" onClick={() => setIsOpen(false)}>
                                                <div className="pack-thumb-small"><FaBoxOpen /></div>
                                                <span>{name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Recipes Section */}
                            {results.recipes.length > 0 && (
                                <div className="result-category">
                                    <h4 className="flex items-center gap-2"><FaUtensils /> {t.homeSearch.recipes}</h4>
                                    {results.recipes.map(r => (
                                        <Link key={r.id} to="/ai-recipe" className="result-item" onClick={() => setIsOpen(false)}>
                                            <div className="recipe-thumb-small">{r.icon}</div>
                                            <span>{r.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-results p-6 text-center text-gray-500">
                            {t.homeSearch.noResults}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomeSearch;

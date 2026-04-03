import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaTrashAlt, FaClock, FaFire, FaArrowLeft, FaChevronDown, FaChevronUp, FaUtensils, FaListOl } from 'react-icons/fa';

const RecipeHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});
    const [deletingId, setDeletingId] = useState(null);

    // Fetch recipe history on mount
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await api.fetchRecipeHistory();
            setHistory(data);
        } catch (err) {
            setError(err.message || 'Failed to load recipe history');
        } finally {
            setLoading(false);
        }
    };

    // Toggle card expand/collapse
    const toggleExpand = (id) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Delete a recipe from history
    const handleDelete = async (id, recipeName) => {
        if (!window.confirm(`Delete "${recipeName}" from your history?`)) return;

        try {
            setDeletingId(id);
            await api.deleteRecipeHistoryItem(id);
            setHistory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert('Failed to delete recipe: ' + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // Format date nicely
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className="rh-header">
                    <Link to="/ai-recipe" className="rh-back-link">
                        <FaArrowLeft /> Back to AI Kitchen
                    </Link>
                    <h1>Recipe <span className="highlight">History</span></h1>
                    <p>Your culinary creations, beautifully preserved.</p>
                </div>
                <div className="rh-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rh-card rh-skeleton">
                            <div className="rh-skeleton-line rh-skeleton-title"></div>
                            <div className="rh-skeleton-line rh-skeleton-text"></div>
                            <div className="rh-skeleton-line rh-skeleton-text short"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {/* Header */}
            <div className="rh-header">
                <Link to="/ai-recipe" className="rh-back-link">
                    <FaArrowLeft /> Back to AI Kitchen
                </Link>
                <h1>Recipe <span className="highlight">History</span></h1>
                <p>Your culinary creations, beautifully preserved.</p>
                {history.length > 0 && (
                    <span className="rh-count">{history.length} recipe{history.length !== 1 ? 's' : ''} saved</span>
                )}
            </div>

            {/* Error state */}
            {error && (
                <div className="rh-error">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchHistory} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!error && history.length === 0 && (
                <div className="rh-empty">
                    <div className="rh-empty-icon">🧁</div>
                    <h3>No recipes yet</h3>
                    <p>Start creating delicious recipes with our AI pastry chef!</p>
                    <Link to="/ai-recipe" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                        Create Your First Recipe
                    </Link>
                </div>
            )}

            {/* Recipe cards grid */}
            {history.length > 0 && (
                <div className="rh-grid">
                    {history.map((item) => {
                        const isExpanded = expandedCards[item._id];
                        const isDeleting = deletingId === item._id;

                        return (
                            <div
                                key={item._id}
                                className={`rh-card ${isExpanded ? 'rh-card-expanded' : ''} ${isDeleting ? 'rh-card-deleting' : ''}`}
                            >
                                {/* Card Header */}
                                <div className="rh-card-header">
                                    <div className="rh-card-title-group">
                                        <h3 className="rh-card-title">{item.recipe?.name || 'Untitled Recipe'}</h3>
                                        <span className="rh-card-date">{formatDate(item.createdAt)}</span>
                                    </div>
                                    <button
                                        className="rh-delete-btn"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id, item.recipe?.name); }}
                                        disabled={isDeleting}
                                        title="Delete recipe"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>

                                {/* Prompt badge */}
                                <div className="rh-prompt-badge">
                                    <span className="rh-prompt-label">Prompt:</span>
                                    <span className="rh-prompt-text">"{item.prompt}"</span>
                                </div>

                                {/* Time badges */}
                                <div className="rh-meta">
                                    {item.recipe?.prepTime && (
                                        <span className="rh-meta-badge">
                                            <FaClock /> {item.recipe.prepTime}
                                        </span>
                                    )}
                                    {item.recipe?.bakingTime && (
                                        <span className="rh-meta-badge rh-meta-baking">
                                            <FaFire /> {item.recipe.bakingTime}
                                        </span>
                                    )}
                                </div>

                                {/* Expand/Collapse toggle */}
                                <button
                                    className="rh-expand-btn"
                                    onClick={() => toggleExpand(item._id)}
                                >
                                    {isExpanded ? (
                                        <><FaChevronUp /> Hide Details</>
                                    ) : (
                                        <><FaChevronDown /> Show Details</>
                                    )}
                                </button>

                                {/* Expandable content */}
                                {isExpanded && (
                                    <div className="rh-card-details">
                                        {/* Ingredients */}
                                        {item.recipe?.ingredients?.length > 0 && (
                                            <div className="rh-section">
                                                <h4 className="rh-section-title">
                                                    <FaUtensils /> Ingredients
                                                </h4>
                                                <ul className="rh-ingredients-list">
                                                    {item.recipe.ingredients.map((ing, idx) => (
                                                        <li key={idx}>
                                                            <span className="rh-bullet">•</span>
                                                            {ing}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Steps */}
                                        {item.recipe?.steps?.length > 0 && (
                                            <div className="rh-section">
                                                <h4 className="rh-section-title">
                                                    <FaListOl /> Instructions
                                                </h4>
                                                <ol className="rh-steps-list">
                                                    {item.recipe.steps.map((step, idx) => (
                                                        <li key={idx}>
                                                            <span className="rh-step-num">{idx + 1}</span>
                                                            <p>{step}</p>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecipeHistory;

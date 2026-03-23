import { useState } from 'react';
import { api } from '../services/api';

const AiRecipe = () => {
    const [prompt, setPrompt] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateRecipe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const data = await api.generateRecipe(prompt);
            setRecipe(data);
        } catch (err) {
            const msg = err.message || err.response?.data?.message || 'Something went wrong generating the recipe.';
            setError(
                msg.includes('fetch') || msg.includes('Failed to fetch')
                    ? 'Cannot connect to AI server. Please make sure the backend is running on port 5000.'
                    : msg
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="hero" style={{ paddingTop: '0' }}>
                <h1>AI <span className="highlight">Pastry Chef</span></h1>
                <p>Describe your dream dessert, and watch the magic happen.</p>
            </div>

            <form onSubmit={generateRecipe}>
                <div className="recipe-form-container">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. 'Gluten-free dark chocolate truffle cake with raspberry coulis'"
                        className="recipe-input"
                        required
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ minWidth: '200px' }}
                    >
                        {loading ? 'Creating...' : 'Generate Recipe'}
                    </button>
                </div>
            </form>

            {error && <div style={{ maxWidth: '800px', margin: '0 auto 2rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', textAlign: 'center' }}>{error}</div>}

            {recipe && (
                <div className="recipe-result">
                    <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{recipe.name}</h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', color: '#666' }}>
                        {recipe.prepTime && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⏲️ Prep:</span>
                                <strong>{recipe.prepTime}</strong>
                            </div>
                        )}
                        {recipe.bakingTime && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>🔥 Baking:</span>
                                <strong>{recipe.bakingTime}</strong>
                            </div>
                        )}
                    </div>

                    <div className="recipe-grid">
                        <div>
                            <h3 style={{ color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '2px', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Ingredients</h3>
                            <ul className="ingredient-list">
                                {recipe.ingredients.map((ing, idx) => (
                                    <li key={idx}>
                                        <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>•</span>
                                        <span>{ing}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '2px', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Instructions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {recipe.steps.map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                                        <span style={{ background: 'var(--secondary-color)', color: 'var(--primary-dark)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</span>
                                        <p style={{ lineHeight: '1.6', color: '#444' }}>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiRecipe;

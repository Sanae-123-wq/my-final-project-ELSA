import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import heroPastry from '../assets/hero_pastry.png';
import { useLanguage } from '../context/LanguageContext';
import HomeSearch from '../components/HomeSearch';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.fetchProducts();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Extract unique categories for displaying category cards
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).map(category => {
        return {
            name: category,
            image: products.find(p => p.category === category)?.image
        };
    });

    return (
        <div className="container">
            <div className="pt-8 pb-4">
                <HomeSearch />
            </div>

            <section className="hero container text-center" style={{ padding: '3rem 0', flexDirection: 'column' }}>
                <div className="hero-content" style={{ margin: '0 auto', maxWidth: '800px' }}>
                    <h1>
                        {t.hero.title} <span className="highlight">{t.hero.titleHighlight}</span>
                    </h1>
                    <p>
                        {t.hero.subtitle}
                    </p>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <p className="text-center">{t.common.loading}</p>
                </div>
            ) : (
                <div style={{ paddingBottom: '4rem' }}>
                    <h2 className="text-center" style={{ marginBottom: '2.5rem', fontSize: '2.2rem', color: 'var(--dark-color)' }}>
                        Our Dessert Categories
                    </h2>
                    <div className="category-grid">
                        {uniqueCategories.map((cat, idx) => (
                            <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} key={idx} className="category-card">
                                <div className="category-image">
                                    <img src={cat.image} alt={cat.name} />
                                </div>
                                <div className="category-info">
                                    <h3>{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

import { useLanguage } from '../context/LanguageContext';
import HomeSearch from '../components/HomeSearch';
import CategoriesSection from '../components/CategoriesSection';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div className="container">
            <div className="pt-8 pb-4">
                <HomeSearch />
            </div>

            <section className="hero-text-only">
                <h1 className="hero-banner-title">
                    Taste the Art of <em>Sweetness</em>
                </h1>
                <p className="hero-banner-subtitle">
                    Discover the finest traditional delights and modern pastries,<br />
                    handcrafted with love and precision.
                </p>
                <a href="/shop" className="hero-banner-btn">SHOP NOW</a>
            </section>

            <CategoriesSection />
        </div>
    );
};

export default Home;

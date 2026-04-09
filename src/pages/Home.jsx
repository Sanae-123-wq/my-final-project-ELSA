import { useLanguage } from '../context/LanguageContext';
import HomeSearch from '../components/HomeSearch';
import CategoriesSection from '../components/CategoriesSection';
import HeroSlider from '../components/HeroSlider';
import Testimonials from '../components/Testimonials';
import AboutUs from '../components/AboutUs';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div>
            <HeroSlider />
            
            <section className="search-section">
                <div className="container">
                    <div className="pt-8 pb-4">
                        <HomeSearch />
                    </div>
                </div>
            </section>

            <CategoriesSection />

            <AboutUs />
            
            <WhyChooseUs />

            <Testimonials />
        </div>
    );
};

export default Home;

import { useLanguage } from '../context/LanguageContext';
import HomeSearch from '../components/HomeSearch';
import CategoriesSection from '../components/CategoriesSection';
import HeroSlider from '../components/HeroSlider';
import Testimonials from '../components/Testimonials';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div>
            <HeroSlider />

            <div className="container">
                <div className="pt-8 pb-4">
                    <HomeSearch />
                </div>

                <CategoriesSection />
            </div>

            <Testimonials />
        </div>
    );
};

export default Home;

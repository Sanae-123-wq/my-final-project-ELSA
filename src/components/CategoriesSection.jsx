import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Import local category images
import cakesImg from '../assets/categories profiles/cakes.jpg';
import cheesecakesImg from '../assets/categories profiles/chessecakes.jpg';
import chocolatesImg from '../assets/categories profiles/chocolates.jpg';
import cookiesImg from '../assets/categories profiles/cookies.brownies.jpg';
import cupcakesImg from '../assets/categories profiles/cupcakes.jpg';
import donutsImg from '../assets/categories profiles/donuts.jpg';
import macaronsImg from '../assets/categories profiles/macarons.jpg';
import moroccanSweetsImg from '../assets/categories profiles/moroccan sweets.jpg';
import tartsImg from '../assets/categories profiles/tarts.jpg';
import tiramisuImg from '../assets/categories profiles/tiramisu.jpg';
import viennoiseriesImg from '../assets/categories profiles/viennoiseries.jpg';

const CategoriesSection = () => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'cakes',
            name: 'Cakes',
            displayName: 'Cakes',
            description: 'Elegant artisanal cakes for every celebration.',
            image: cakesImg,
            popular: true
        },
        {
            id: 'cheesecakes',
            name: 'Cheesecakes',
            displayName: 'Cheesecakes',
            description: 'Rich and creamy cheesecakes in various flavors.',
            image: cheesecakesImg,
            popular: false
        },
        {
            id: 'chocolates',
            name: 'Chocolates',
            displayName: 'Chocolates',
            description: 'Handcrafted chocolates and gourmet candies.',
            image: chocolatesImg,
            popular: false
        },
        {
            id: 'cookies-brownies',
            name: 'Cookies/Brownies',
            displayName: 'Cookies/Brownies',
            description: 'Crunchy and buttery delights baked to perfection.',
            image: cookiesImg,
            popular: true
        },
        {
            id: 'cupcakes',
            name: 'Cupcakes',
            displayName: 'Cupcakes',
            description: 'Sweet little bites of joy in various flavors.',
            image: cupcakesImg,
            popular: false
        },
        {
            id: 'donuts',
            name: 'Donuts',
            displayName: 'Donuts',
            description: 'Freshly baked glazed and filled donuts.',
            image: donutsImg,
            popular: true
        },
        {
            id: 'macarons',
            name: 'Macarons',
            displayName: 'Macarons',
            description: 'Delicate french macarons with rich fillings.',
            image: macaronsImg,
            popular: true
        },
        {
            id: 'moroccan-sweets',
            name: 'Moroccan Sweets',
            displayName: 'Moroccan Sweets',
            description: 'Traditional heritage in every bite.',
            image: moroccanSweetsImg,
            popular: true
        },
        {
            id: 'tarts',
            name: 'Tarts',
            displayName: 'Tarts',
            description: 'Sweet and buttery tarts filled with fresh ingredients.',
            image: tartsImg,
            popular: false
        },
        {
            id: 'tiramisu',
            name: 'Tiramisu',
            displayName: 'Tiramisu',
            description: 'Classic italian coffee-flavored dessert.',
            image: tiramisuImg,
            popular: false
        },
        {
            id: 'viennoiseries',
            name: 'Viennoiseries',
            displayName: 'Viennoiseries',
            description: 'Flaky croissants and puff pastries.',
            image: viennoiseriesImg,
            popular: false
        }
    ];

    return (
        <section className="categories-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Discover Our World</span>
                    <h2 className="section-title">Shop by Category</h2>
                    <p className="section-description">
                        Explore our curated selection of premium pastries and desserts,
                        handcrafted with love and the finest ingredients.
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link 
                            to={`/shop?category=${encodeURIComponent(category.name)}`} 
                            key={category.id} 
                            className="enhanced-category-card"
                        >
                            {category.popular && (
                                <span className="best-seller-badge">Best Seller</span>
                            )}
                            <div className="card-image-wrapper">
                                <img src={category.image} alt={category.displayName} loading="lazy" />
                                <div className="card-overlay">
                                    <span className="explore-btn">Explore</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{category.displayName}</h3>
                                <p>{category.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;

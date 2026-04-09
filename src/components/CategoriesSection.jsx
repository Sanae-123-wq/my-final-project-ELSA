import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CategoriesSection = () => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'cakes',
            name: 'Cakes',
            displayName: 'Cakes',
            description: 'Elegant artisanal cakes for every celebration.',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'cheesecakes',
            name: 'Cheesecakes',
            displayName: 'Cheesecakes',
            description: 'Rich and creamy cheesecakes in various flavors.',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'chocolates',
            name: 'Chocolates',
            displayName: 'Chocolates',
            description: 'Handcrafted chocolates and gourmet candies.',
            image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'cookies-brownies',
            name: 'Cookies/Brownies',
            displayName: 'Cookies/Brownies',
            description: 'Crunchy and buttery delights baked to perfection.',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'cupcakes',
            name: 'Cupcakes',
            displayName: 'Cupcakes',
            description: 'Sweet little bites of joy in various flavors.',
            image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'donuts',
            name: 'Donuts',
            displayName: 'Donuts',
            description: 'Freshly baked glazed and filled donuts.',
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'macarons',
            name: 'Macarons',
            displayName: 'Macarons',
            description: 'Delicate french macarons with rich fillings.',
            image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'moroccan-sweets',
            name: 'Moroccan Sweets',
            displayName: 'Moroccan Sweets',
            description: 'Traditional heritage in every bite.',
            image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc2fe3a?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'tarts',
            name: 'Tarts',
            displayName: 'Tarts',
            description: 'Sweet and buttery tarts filled with fresh ingredients.',
            image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'tiramisu',
            name: 'Tiramisu',
            displayName: 'Tiramisu',
            description: 'Classic italian coffee-flavored dessert.',
            image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'viennoiseries',
            name: 'Viennoiseries',
            displayName: 'Viennoiseries',
            description: 'Flaky croissants and puff pastries.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
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

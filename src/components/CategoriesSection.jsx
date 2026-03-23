import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CategoriesSection = () => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'cakes',
            name: 'Cakes',
            description: 'Elegant artisanal cakes for every celebration.',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'cupcakes',
            name: 'Cupcakes',
            description: 'Sweet little bites of joy in various flavors.',
            image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'cookies',
            name: 'Cookies & Biscuits',
            description: 'Crunchy and buttery delights baked to perfection.',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'viennoiseries',
            name: 'Viennoiseries',
            description: 'Flaky croissants and puff pastries.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'desserts',
            name: 'Individual Desserts',
            description: 'Miniature masterpieces of taste and design.',
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'moroccan',
            name: 'Moroccan Sweets',
            description: 'Traditional heritage in every bite.',
            image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc2fe3a?auto=format&fit=crop&q=80&w=800',
            popular: true
        },
        {
            id: 'chocolates',
            name: 'Chocolates & Candies',
            description: 'Handcrafted chocolates and gourmet candies.',
            image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'healthy',
            name: 'Healthy Options',
            description: 'Sugar-free, gluten-free, and vegan treats.',
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800',
            popular: false
        },
        {
            id: 'boxes',
            name: 'Event Boxes',
            description: 'Curated sets for your special moments.',
            image: 'https://images.unsplash.com/photo-1513201099705-a9a44eeef9a2?auto=format&fit=crop&q=80&w=800',
            popular: true
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
                                <img src={category.image} alt={category.name} loading="lazy" />
                                <div className="card-overlay">
                                    <span className="explore-btn">Explore</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{t.categories[category.name] || category.name}</h3>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import slideChocCake from '../assets/slide_choc_cake.jpg';
import slideBread from '../assets/slide_bread.jpg';
import slideWhiteCake from '../assets/slide_white_cake.jpg';
import slideCookies from '../assets/slide_cookies.jpg';

const slides = [
    { src: slideChocCake,  bgPos: 'center 30%' },
    { src: slideBread,     bgPos: 'center center' },
    { src: slideWhiteCake, bgPos: 'center 20%' },
    { src: slideCookies,   bgPos: 'center center' },
];

const HeroSlider = () => {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % slides.length);
                setFading(false);
            }, 600);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleDotClick = (i) => {
        if (i === current) return;
        setFading(true);
        setTimeout(() => {
            setCurrent(i);
            setFading(false);
        }, 600);
    };

    return (
        <section className="hero-slider">
            {/* Slides */}
            {slides.map((slide, i) => (
                <div
                    key={i}
                    className={`hero-slide ${i === current ? (fading ? 'hero-slide--fading-out' : 'hero-slide--active') : ''}`}
                    style={{ backgroundImage: `url(${slide.src})`, backgroundPosition: slide.bgPos }}
                />
            ))}

            {/* Dark overlay */}
            <div className="hero-overlay" />

            {/* Content */}
            <div className="hero-content">
                <p className="hero-eyebrow">✦ ELSA Pastry</p>
                <h1 className="hero-title">
                    {t.hero.title} <em>{t.hero.titleHighlight}</em>
                </h1>
                <p className="hero-subtitle">{t.hero.subtitle}</p>
                <Link to="/shop" className="hero-cta-btn">
                    {t.hero.shopNow}
                </Link>
            </div>

            {/* Dot indicators */}
            <div className="hero-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`}
                        onClick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;

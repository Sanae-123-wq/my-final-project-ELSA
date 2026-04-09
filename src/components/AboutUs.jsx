import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <section className="about-section">
            <div className="container">
                <div className="about-inner">
                    {/* Left: Image collage */}
                    <div className="about-visual">
                        <div className="about-img-grid">
                            <div className="about-img-main">
                                <img src="/assets/cakes/b1.jpg" alt="Fresh pastries" />
                            </div>
                            <div className="about-img-secondary">
                                <img src="/assets/macarons/m1.jpg" alt="Macarons" />
                                <img src="/assets/viennoiseries/mi1.jpg" alt="Viennoiseries" />
                            </div>
                        </div>
                        <div className="about-badge">
                            <span className="about-badge-number">11+</span>
                            <span className="about-badge-text">Sweet Categories</span>
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="about-content">
                        <span className="section-subtitle">Our Story</span>
                        <h2 className="section-title about-title">
                            Crafted With <span className="highlight">Passion</span>, Delivered With Love
                        </h2>
                        <p className="about-paragraph">
                            ELSA Patisserie is Agadir's premier pastry marketplace — a curated destination 
                            connecting dessert lovers with the finest local artisan patisseries. From cloud-soft 
                            macarons to golden Moroccan sweets, every product is made with the freshest 
                            ingredients and time-honored recipes.
                        </p>
                        <p className="about-paragraph">
                            We believe that great pastry is more than a treat — it's a moment of joy, 
                            a celebration of craft, and a connection to culture. Our platform empowers 
                            trusted local vendors to share their art while giving you access to a world 
                            of handcrafted sweetness, delivered right to your door.
                        </p>
                        <div className="about-stats">
                            <div className="about-stat">
                                <strong>26+</strong>
                                <span>Local Vendors</span>
                            </div>
                            <div className="about-stat-divider" />
                            <div className="about-stat">
                                <strong>480+</strong>
                                <span>Products</span>
                            </div>
                            <div className="about-stat-divider" />
                            <div className="about-stat">
                                <strong>100%</strong>
                                <span>Fresh Daily</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;

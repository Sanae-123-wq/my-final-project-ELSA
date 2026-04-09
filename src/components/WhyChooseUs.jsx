import React from 'react';
import { FaMedal, FaLeaf, FaStore, FaBolt } from 'react-icons/fa';
import './WhyChooseUs.css';

const features = [
    {
        icon: <FaMedal />,
        title: 'High Quality Products',
        description: 'Every item on our platform is curated for quality. From premium ingredients to artisan craftsmanship, we only offer the best.'
    },
    {
        icon: <FaLeaf />,
        title: 'Fresh Daily',
        description: 'Products are made fresh every day by our local vendors. No preservatives, no shortcuts — just pure, wholesome goodness.'
    },
    {
        icon: <FaStore />,
        title: 'Trusted Local Stores',
        description: 'We partner exclusively with certified, reviewed, and approved patisseries from Agadir. Every store is verified for quality and trust.'
    },
    {
        icon: <FaBolt />,
        title: 'Fast Delivery',
        description: 'Our dedicated delivery network ensures your treats arrive quickly and in perfect condition, ready to be enjoyed.'
    }
];

const WhyChooseUs = () => {
    return (
        <section className="why-section">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-subtitle">Why ELSA</span>
                    <h2 className="section-title">
                        What Makes Us <span className="highlight">Different</span>
                    </h2>
                    <p className="section-description">
                        We don't just sell pastries — we deliver an experience built on quality, trust, and a love for fine confections.
                    </p>
                </div>

                <div className="why-grid">
                    {features.map((feature, index) => (
                        <div className="why-card" key={index}>
                            <div className="why-icon-wrap">
                                {feature.icon}
                            </div>
                            <h3 className="why-title">{feature.title}</h3>
                            <p className="why-desc">{feature.description}</p>
                            <div className="why-card-line" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

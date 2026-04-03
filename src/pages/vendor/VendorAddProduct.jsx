import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';
import './VendorAddProduct.css';

// ─── Aligned with Home page CategoriesSection + Product.js enum ──────────────
const CATEGORIES = [
    { value: 'Cake', label: '🎂 Cake', hint: 'Birthday, wedding, layer cakes' },
    { value: 'Pastry', label: '🥐 Pastry', hint: 'Croissants, puff pastry, viennoiseries' },
    { value: 'Bread', label: '🍞 Bread', hint: 'Baguettes, loaves, brioche' },
    { value: 'Traditional', label: '🍡 Traditional', hint: 'Maamoul, chebakia, Moroccan sweets' },
    { value: 'Cookies', label: '🍪 Cookies', hint: 'Shortbread, biscuits, macarons' },
    { value: 'Chocolate', label: '🍫 Chocolate', hint: 'Truffles, ganache, pralines' },
    { value: 'Healthy', label: '🥗 Healthy', hint: 'Sugar-free, vegan, gluten-free' },
    { value: 'Pack', label: '📦 Gift Pack', hint: 'Event boxes, gift sets, assortments' },
];

// ─── Category auto-suggest based on name/description keywords ────────────────
const CATEGORY_KEYWORDS = {
    Cake: ['cake', 'birthday', 'wedding', 'layer', 'gateau', 'anniversary', 'celebration'],
    Pastry: ['croissant', 'pastry', 'puff', 'brioche', 'viennoiserie', 'tart', 'quiche', 'eclair'],
    Bread: ['bread', 'baguette', 'loaf', 'pain', 'sourdough', 'roll', 'miche'],
    Traditional: ['moroccan', 'traditional', 'maamoul', 'chebakia', 'briouate', 'ghriba', 'cornes', 'kaab'],
    Cookies: ['cookie', 'biscuit', 'shortbread', 'macaron', 'sable', 'biscotti', 'cracker'],
    Chocolate: ['chocolate', 'truffle', 'ganache', 'praline', 'bonbon', 'fudge', 'cocoa'],
    Healthy: ['vegan', 'healthy', 'gluten', 'sugar-free', 'organic', 'keto', 'protein'],
    Pack: ['box', 'pack', 'gift', 'event', 'assortment', 'set', 'bundle'],
};

const suggestCategory = (name, description) => {
    const text = `${name} ${description}`.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw))) return cat;
    }
    return null;
};

const VendorAddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '', name_fr: '', name_ar: '',
        price: '', stock: '1',
        isNew: false,
        category: 'Pastry',
        description: '', description_fr: '', description_ar: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updated = { ...formData, [name]: type === 'checkbox' ? checked : value };

        // Auto-assign on name or description change
        if (name === 'name' || name === 'description') {
            const suggested = suggestCategory(updated.name, updated.description);
            if (suggested && suggested !== updated.category) {
                updated.category = suggested;
                setSuggestion(suggested);
            }
        }
        setFormData(updated);
    };

    const handleImageFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleImageInput = (e) => handleImageFile(e.target.files[0]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageFile(e.dataTransfer.files[0]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please upload a product image.');
        if (parseFloat(formData.price) <= 0) return alert('Price must be greater than 0.');
        if (parseInt(formData.stock) < 0) return alert('Stock cannot be negative.');

        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append('image', image);
            data.append('approvalStatus', 'approved');

            await api.addProduct(data);

            setSuccessMessage('Product added successfully! It is now live in the shop.');
            setTimeout(() => navigate('/vendor/products'), 1800);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to submit product. Please check all required fields.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="vap-container inner-admin-page">
            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: 'fixed', top: '2rem', right: '2rem', zIndex: 9999,
                    background: '#5C4033', color: 'white',
                    padding: '1rem 1.5rem', borderRadius: '16px',
                    boxShadow: '0 15px 35px -10px rgba(62,39,35,0.4)',
                    fontWeight: '700', fontSize: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    ✅ {successMessage}
                </div>
            )}

            <div className="vap-header">
                <div>
                    <h1 className="vap-title">
                        <span style={{ fontSize: '1.8rem' }}>➕</span> Add New Product
                    </h1>
                    <p className="vap-subtitle">List a new culinary masterpiece in your patisserie catalog</p>
                </div>
            </div>

            <div className="vap-card">
                <form onSubmit={handleSubmit}>

                    {/* ── Section 1: Essentials ────────────────────────────────── */}
                    <div className="vap-section">
                        <div className="vap-section-header">
                            <div className="vap-section-icon">📋</div>
                            <div className="vap-section-title">Basic Information</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="premium-form-group">
                                <label>Product Name (English) *</label>
                                <input type="text" className="premium-form-input" name="name" value={formData.name}
                                    onChange={handleChange} required placeholder="e.g. Almond Croissant" />
                            </div>
                            <div className="premium-form-group">
                                <label>Price (MAD) *</label>
                                <input type="number" step="0.01" min="0.01" className="premium-form-input"
                                    name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 35" />
                            </div>
                            <div className="premium-form-group">
                                <label>Stock / Quantity *</label>
                                <input type="number" min="0" className="premium-form-input"
                                    name="stock" value={formData.stock} onChange={handleChange} required placeholder="e.g. 20" />
                            </div>
                            <div className="premium-form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                <label style={{ marginBottom: '0.75rem' }}>Product Badge</label>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    background: formData.isNew ? 'rgba(16, 185, 129, 0.08)' : '#f9fafb',
                                    border: `2px solid ${formData.isNew ? '#10b981' : '#e5e7eb'}`,
                                    borderRadius: '12px', padding: '0.9rem 1.2rem',
                                    cursor: 'pointer', transition: 'all 0.2s ease', userSelect: 'none'
                                }}>
                                    <input
                                        type="checkbox"
                                        name="isNew"
                                        checked={formData.isNew}
                                        onChange={handleChange}
                                        style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '700', color: formData.isNew ? '#059669' : '#374151', fontSize: '0.95rem' }}>
                                            ✨ Mark as New Arrival
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                            Shows a "New" badge on the product card
                                        </div>
                                    </div>
                                    {formData.isNew && (
                                        <span style={{
                                            marginLeft: 'auto', background: 'linear-gradient(135deg, #10B981, #059669)',
                                            color: 'white', fontSize: '0.7rem', fontWeight: '800',
                                            padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px'
                                        }}>NEW</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Category with Auto-Suggest ───────────────── */}
                    <div className="vap-section">
                        <div className="vap-section-header">
                            <div className="vap-section-icon">🗂️</div>
                            <div className="vap-section-title">Category Assignment</div>
                        </div>

                        {/* Auto-assigned chip */}
                        {suggestion && (
                            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.9rem', color: '#D97706', fontWeight: 'bold' }}>✨ Auto-assigned instantly:</span>
                                <div style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>
                                    {CATEGORIES.find(c => c.value === suggestion)?.label}
                                </div>
                            </div>
                        )}

                        <div className="vap-category-grid">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                    className={`vap-category-btn ${formData.category === cat.value ? 'selected' : ''}`}
                                >
                                    <span className="vap-category-label">{cat.label}</span>
                                    <span className="vap-category-hint">{cat.hint}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Section 3: Image Upload ──────────────────────────────── */}
                    <div className="vap-section">
                        <div className="vap-section-header">
                            <div className="vap-section-icon">📸</div>
                            <div className="vap-section-title">Product Image <span style={{ color: '#DC2626' }}>*</span></div>
                        </div>
                        <div
                            className={`vap-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            {imagePreview ? (
                                <div className="vap-preview-container">
                                    <img src={imagePreview} alt="Preview" className="vap-preview-img" />
                                    <button type="button"
                                        onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                                        className="vap-preview-remove">
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <span className="vap-dropzone-icon">📷</span>
                                    <p className="vap-dropzone-text">Drag & drop your breathtaking image here</p>
                                    <p className="vap-dropzone-subtext">Supported formats: JPG, PNG, WEBP. High quality recommended.</p>
                                    <label className="vap-file-btn">
                                        Choose Local File
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageInput} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Section 4: Descriptions ──────────────────────────────── */}
                    <div className="vap-section">
                        <div className="vap-section-header">
                            <div className="vap-section-icon">📝</div>
                            <div className="vap-section-title">Multilingual Descriptions</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="premium-form-group">
                                <label>🇬🇧 Description (English) *</label>
                                <textarea className="premium-form-input premium-form-textarea" name="description" value={formData.description}
                                    onChange={handleChange} rows={4} required placeholder="Describe your product beautifully in English..." />
                            </div>
                            <div className="premium-form-group">
                                <label>🇫🇷 Description (French) *</label>
                                <textarea className="premium-form-input premium-form-textarea" name="description_fr" value={formData.description_fr}
                                    onChange={handleChange} rows={4} required placeholder="Décrivez fièrement votre création en français..." />
                            </div>
                            <div className="premium-form-group">
                                <label>🇲🇦 الوصف (Arabic) *</label>
                                <textarea className="premium-form-input premium-form-textarea" dir="rtl" name="description_ar" value={formData.description_ar}
                                    onChange={handleChange} rows={4} required placeholder="صف أصالة وجمال منتجك بالعربية..." />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 5: Translations ──────────────────────────────── */}
                    <div className="vap-section">
                        <div className="vap-section-header">
                            <div className="vap-section-icon">🌐</div>
                            <div className="vap-section-title">Name Translations</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="premium-form-group">
                                <label>🇫🇷 Nom (French)</label>
                                <input type="text" className="premium-form-input" name="name_fr" value={formData.name_fr}
                                    onChange={handleChange} placeholder="e.g. Croissant Magnifique aux Amandes" />
                            </div>
                            <div className="premium-form-group">
                                <label>🇲🇦 الاسم (Arabic)</label>
                                <input type="text" className="premium-form-input" dir="rtl" name="name_ar" value={formData.name_ar}
                                    onChange={handleChange} placeholder="مثال: كرواسان باللوز الأصيل" />
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ──────────────────────────────────────────────── */}
                    <div className="vap-actions">
                        <button type="button" className="vap-btn-cancel" onClick={() => navigate('/vendor/products')}>
                            Cancel
                        </button>
                        <button type="submit" className="vap-btn-submit" disabled={submitting}>
                            {submitting ? '⏳ Adding...' : '✅ Confirm & Add to Catalog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorAddProduct;



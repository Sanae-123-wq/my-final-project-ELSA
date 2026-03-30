import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

// ─── Aligned with Home page CategoriesSection + Product.js enum ──────────────
const CATEGORIES = [
    { value: 'Cake',        label: '🎂 Cake',              hint: 'Birthday, wedding, layer cakes' },
    { value: 'Pastry',      label: '🥐 Pastry',            hint: 'Croissants, puff pastry, viennoiseries' },
    { value: 'Bread',       label: '🍞 Bread',             hint: 'Baguettes, loaves, brioche' },
    { value: 'Traditional', label: '🍡 Traditional',       hint: 'Maamoul, chebakia, Moroccan sweets' },
    { value: 'Cookies',     label: '🍪 Cookies',           hint: 'Shortbread, biscuits, macarons' },
    { value: 'Chocolate',   label: '🍫 Chocolate',         hint: 'Truffles, ganache, pralines' },
    { value: 'Healthy',     label: '🥗 Healthy',           hint: 'Sugar-free, vegan, gluten-free' },
    { value: 'Pack',        label: '📦 Gift Pack',         hint: 'Event boxes, gift sets, assortments' },
];

// ─── Category auto-suggest based on name/description keywords ────────────────
const CATEGORY_KEYWORDS = {
    Cake:        ['cake', 'birthday', 'wedding', 'layer', 'gateau', 'anniversary', 'celebration'],
    Pastry:      ['croissant', 'pastry', 'puff', 'brioche', 'viennoiserie', 'tart', 'quiche', 'eclair'],
    Bread:       ['bread', 'baguette', 'loaf', 'pain', 'sourdough', 'roll', 'miche'],
    Traditional: ['moroccan', 'traditional', 'maamoul', 'chebakia', 'briouate', 'ghriba', 'cornes', 'kaab'],
    Cookies:     ['cookie', 'biscuit', 'shortbread', 'macaron', 'sable', 'biscotti', 'cracker'],
    Chocolate:   ['chocolate', 'truffle', 'ganache', 'praline', 'bonbon', 'fudge', 'cocoa'],
    Healthy:     ['vegan', 'healthy', 'gluten', 'sugar-free', 'organic', 'keto', 'protein'],
    Pack:        ['box', 'pack', 'gift', 'event', 'assortment', 'set', 'bundle'],
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
        category: 'Pastry',
        description: '', description_fr: '', description_ar: '',
    });

    const handleChange = (e) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        setFormData(updated);

        // Auto-suggest on name or description change
        if (e.target.name === 'name' || e.target.name === 'description') {
            const suggested = suggestCategory(updated.name, updated.description);
            setSuggestion(suggested && suggested !== formData.category ? suggested : null);
        }
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
        <div className="admin-page">
            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: 'fixed', top: '2rem', right: '2rem', zIndex: 9999,
                    background: 'var(--pat-brown)', color: 'white',
                    padding: '1rem 1.5rem', borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(139,94,60,0.3)',
                    fontWeight: '700', fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    animation: 'slideInRight 0.3s ease'
                }}>
                    ✅ {successMessage}
                </div>
            )}

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--pat-brown)' }}>
                        ➕ Add New Product
                    </h1>
                    <p className="admin-page-subtitle">List a new creation in your patisserie catalog</p>
                </div>
            </div>

            <div className="admin-card" style={{ borderRadius: 'var(--pat-radius)', boxShadow: 'var(--pat-shadow)' }}>
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>

                    {/* ── Section 1: Essentials ────────────────────────────────── */}
                    <div className="vendor-form-section">
                        <div className="vendor-form-section-title">📋 Basic Information</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                            <div className="form-group-admin">
                                <label>Product Name (English) *</label>
                                <input type="text" className="admin-input" name="name" value={formData.name}
                                    onChange={handleChange} required placeholder="e.g. Almond Croissant" />
                            </div>
                            <div className="form-group-admin">
                                <label>Price (MAD) *</label>
                                <input type="number" step="0.01" min="0.01" className="admin-input"
                                    name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 35" />
                            </div>
                            <div className="form-group-admin">
                                <label>Stock / Quantity *</label>
                                <input type="number" min="0" className="admin-input"
                                    name="stock" value={formData.stock} onChange={handleChange} required placeholder="e.g. 20" />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Category with Auto-Suggest ───────────────── */}
                    <div className="vendor-form-section">
                        <div className="vendor-form-section-title">🗂️ Category</div>

                        {/* Auto-suggest chip */}
                        {suggestion && (
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>💡 Suggested:</span>
                                <button type="button" className="category-suggest-chip"
                                    onClick={() => { setFormData({ ...formData, category: suggestion }); setSuggestion(null); }}>
                                    {CATEGORIES.find(c => c.value === suggestion)?.label} — Apply
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                    className={`category-select-card ${formData.category === cat.value ? 'selected' : ''}`}
                                >
                                    <span className="cat-label">{cat.label}</span>
                                    <span className="cat-hint">{cat.hint}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Section 3: Image Upload ──────────────────────────────── */}
                    <div className="vendor-form-section">
                        <div className="vendor-form-section-title">📸 Product Image *</div>
                        <div
                            className={`image-drop-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            {imagePreview ? (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={imagePreview} alt="Preview"
                                        style={{ width: '180px', height: '180px', borderRadius: '16px', objectFit: 'cover', border: '3px solid var(--pat-beige)' }} />
                                    <button type="button"
                                        onClick={() => { setImage(null); setImagePreview(null); }}
                                        style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Drag & drop your image here</p>
                                    <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>or click to browse</p>
                                    <label style={{ cursor: 'pointer', background: 'var(--pat-brown)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700' }}>
                                        Choose File
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageInput} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Section 4: Descriptions ──────────────────────────────── */}
                    <div className="vendor-form-section">
                        <div className="vendor-form-section-title">📝 Descriptions (Multilingual)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                            <div className="form-group-admin">
                                <label>🇬🇧 Description (English) *</label>
                                <textarea className="admin-input" name="description" value={formData.description}
                                    onChange={handleChange} rows={3} required placeholder="Describe your product in English..." />
                            </div>
                            <div className="form-group-admin">
                                <label>🇫🇷 Description (French) *</label>
                                <textarea className="admin-input" name="description_fr" value={formData.description_fr}
                                    onChange={handleChange} rows={3} required placeholder="Décrivez votre produit en français..." />
                            </div>
                            <div className="form-group-admin">
                                <label>🇲🇦 الوصف (Arabic) *</label>
                                <textarea className="admin-input" dir="rtl" name="description_ar" value={formData.description_ar}
                                    onChange={handleChange} rows={3} required placeholder="صف منتجك بالعربية..." />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 5: Translations ──────────────────────────────── */}
                    <div className="vendor-form-section">
                        <div className="vendor-form-section-title">🌐 Product Name Translations</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                            <div className="form-group-admin">
                                <label>🇫🇷 Nom (French)</label>
                                <input type="text" className="admin-input" name="name_fr" value={formData.name_fr}
                                    onChange={handleChange} placeholder="e.g. Croissant aux Amandes" />
                            </div>
                            <div className="form-group-admin">
                                <label>🇲🇦 الاسم (Arabic)</label>
                                <input type="text" className="admin-input" dir="rtl" name="name_ar" value={formData.name_ar}
                                    onChange={handleChange} placeholder="مثال: كرواسان باللوز" />
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ──────────────────────────────────────────────── */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--pat-beige)', paddingTop: '1.5rem' }}>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/vendor/products')}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={submitting}
                            style={{ minWidth: '180px', background: 'var(--pat-brown)', borderRadius: '12px', fontWeight: '800' }}
                        >
                            {submitting ? '⏳ Adding Product...' : '✅ Add to Catalog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorAddProduct;

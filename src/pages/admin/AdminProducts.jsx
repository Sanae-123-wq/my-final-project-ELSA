import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [formData, setFormData] = useState({
        name: '', name_fr: '', name_ar: '',
        description: '', description_fr: '', description_ar: '',
        price: '', category: 'Pastry', image: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        setLoading(true);
        try { setProducts(await api.fetchProducts()); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setCurrentProduct(null);
        setFormData({ name: '', name_fr: '', name_ar: '', description: '', description_fr: '', description_ar: '', price: '', category: 'Pastry', image: '' });
        setShowModal(true);
    };

    const openEdit = (p) => {
        setCurrentProduct(p);
        setFormData(p);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try { await api.deleteProduct(id); loadProducts(); }
        catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentProduct) {
                await api.updateProduct(currentProduct._id, { ...formData, price: parseFloat(formData.price) });
            } else {
                await api.addProduct({ ...formData, price: parseFloat(formData.price) });
            }
            setShowModal(false);
            loadProducts();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const categories = ['All', 'Pastry', 'Cake', 'Traditional'];

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === 'All' || p.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    const categoryColors = { Pastry: 'badge-primary', Cake: 'badge-success', Traditional: 'badge-info' };

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading products...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Manage Products</h1>
                    <p className="admin-page-subtitle">{products.length} products in catalog</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    + Add New Product
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters-row">
                <div className="admin-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
                <div className="admin-filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`admin-filter-tab ${filterCategory === cat ? 'active' : ''}`}
                            onClick={() => setFilterCategory(cat)}
                        >{cat}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Translations</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="admin-table-empty">No products found.</td></tr>
                            ) : filtered.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-cell">
                                            <img src={product.image} alt={product.name} className="product-thumb" />
                                            <div>
                                                <div className="product-cell-name">{product.name}</div>
                                                <div className="product-cell-desc">{product.description?.slice(0, 50)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${categoryColors[product.category] || 'badge-neutral'}`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="price-cell">${Number(product.price).toFixed(2)}</td>
                                    <td>
                                        <div className="langs-cell">
                                            <span className="lang-flag" title="French">🇫🇷</span>
                                            <span className="lang-flag" title="Arabic">🇲🇦</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="admin-actions">
                                            <button className="admin-action-btn action-edit" onClick={() => openEdit(product)}>
                                                ✏️ Edit
                                            </button>
                                            <button className="admin-action-btn action-delete" onClick={() => handleDelete(product._id)}>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {currentProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                            </h2>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-modal-body">
                            <div className="form-section-title">Basic Information</div>
                            <div className="admin-form-grid">
                                <div className="form-group-admin">
                                    <label>Name (EN) *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admin-input" />
                                </div>
                                <div className="form-group-admin">
                                    <label>Image URL *</label>
                                    <input type="text" name="image" value={formData.image} onChange={handleChange} required className="admin-input" />
                                </div>
                                <div className="form-group-admin">
                                    <label>Price (MAD) *</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="admin-input" />
                                </div>
                                <div className="form-group-admin">
                                    <label>Category *</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                                        <option value="Pastry">Pastry</option>
                                        <option value="Cake">Cake</option>
                                        <option value="Traditional">Traditional</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-section-title">Multilingual Names</div>
                            <div className="admin-form-grid">
                                <div className="form-group-admin">
                                    <label>🇫🇷 Name (French)</label>
                                    <input type="text" name="name_fr" value={formData.name_fr || ''} onChange={handleChange} className="admin-input" />
                                </div>
                                <div className="form-group-admin">
                                    <label>🇲🇦 Name (Arabic)</label>
                                    <input type="text" name="name_ar" value={formData.name_ar || ''} onChange={handleChange} className="admin-input" dir="rtl" />
                                </div>
                            </div>

                            <div className="form-section-title">Descriptions</div>
                            <div className="form-group-admin">
                                <label>Description (EN)</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="admin-input admin-textarea" />
                            </div>
                            <div className="admin-form-grid">
                                <div className="form-group-admin">
                                    <label>🇫🇷 Description (French)</label>
                                    <textarea name="description_fr" value={formData.description_fr || ''} onChange={handleChange} className="admin-input admin-textarea-sm" />
                                </div>
                                <div className="form-group-admin">
                                    <label>🇲🇦 Description (Arabic)</label>
                                    <textarea name="description_ar" value={formData.description_ar || ''} onChange={handleChange} className="admin-input admin-textarea-sm" dir="rtl" />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : currentProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;

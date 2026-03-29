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
                    <h1 className="admin-page-title">Manage Products (Moderation)</h1>
                    <p className="admin-page-subtitle">{products.length} products in catalog</p>
                </div>
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
                                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="product-thumb" />
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
        </div>
    );
};

export default AdminProducts;

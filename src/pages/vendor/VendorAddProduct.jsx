import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

const CATEGORIES = ['Pastry', 'Cake', 'Traditional', 'Bread', 'Pack'];

const VendorAddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        name_fr: '',
        name_ar: '',
        price: '',
        category: 'Pastry',
        description: '',
        description_fr: '',
        description_ar: '',
        image: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const productToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                vendorId: user?._id,
                approvalStatus: 'pending', // Implicitly or explicitly set to pending
            };

            await api.addProduct(productToSubmit);
            
            // Record activity log simulating submission
            if (api.getActivityLog) {
                // Not calling explicitly but assuming backend handles it or similar to AdminActivity
            }
            
            alert('Product submitted successfully! It is now pending approval from an ELSA admin.');
            navigate('/vendor/products');
        } catch (err) {
            console.error(err);
            alert('Failed to submit product.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">➕ Add New Product</h1>
                    <p className="admin-page-subtitle">Submit a new creation for approval by ELSA Administration</p>
                </div>
            </div>

            <div className="admin-alert admin-alert-warning" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⏳</span>
                <div>
                    <strong>Approval Required</strong><br />
                    Products added here will not be visible on the public shop until approved by an ELSA Administrator. Ensure images and descriptions meet quality standards.
                </div>
            </div>

            <div className="admin-card">
                <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
                    
                    {/* Basic Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>Product Name (English) *</label>
                            <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>Price (MAD) *</label>
                            <input type="number" step="0.01" className="admin-input" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>Category *</label>
                            <select className="admin-input" name="category" value={formData.category} onChange={handleChange} required>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Translations */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>Nom du Produit (French) *</label>
                            <input type="text" className="admin-input" name="name_fr" value={formData.name_fr} onChange={handleChange} required />
                        </div>
                        <div className="form-group-admin" style={{ marginBottom: 0 }}>
                            <label>اسم المنتج (Arabic) *</label>
                            <input type="text" className="admin-input" dir="rtl" name="name_ar" value={formData.name_ar} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="form-group-admin" style={{ marginBottom: '1.5rem' }}>
                        <label>Image URL *</label>
                        <input type="url" className="admin-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." required />
                        {formData.image && (
                            <div style={{ marginTop: '1rem', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E6D5C3' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                            </div>
                        )}
                    </div>

                    {/* Descriptions */}
                    <div className="form-group-admin">
                        <label>Description (English) *</label>
                        <textarea className="admin-input" name="description" value={formData.description} onChange={handleChange} rows={3} required></textarea>
                    </div>
                    <div className="form-group-admin">
                        <label>Description (French) *</label>
                        <textarea className="admin-input" name="description_fr" value={formData.description_fr} onChange={handleChange} rows={3} required></textarea>
                    </div>
                    <div className="form-group-admin">
                        <label>الوصف (Arabic) *</label>
                        <textarea className="admin-input" dir="rtl" name="description_ar" value={formData.description_ar} onChange={handleChange} rows={3} required></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #F0EBE3', paddingTop: '1.5rem' }}>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/vendor/products')}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorAddProduct;

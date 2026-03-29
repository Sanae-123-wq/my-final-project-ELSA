import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

const CATEGORIES = ['Pastry', 'Cake', 'Traditional', 'Bread', 'Pack'];

const VendorAddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        name_fr: '',
        name_ar: '',
        price: '',
        category: 'Pastry',
        description: '',
        description_fr: '',
        description_ar: ''
    });

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setImage(e.target.files[0]);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please upload a product image.');
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append('image', image);
            data.append('vendorId', user?._id);
            data.append('approvalStatus', 'pending');

            await api.addProduct(data);
            
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

                    {/* Image Upload */}
                    <div className="form-group-admin" style={{ marginBottom: '1.5rem' }}>
                        <label>Product Image (File) *</label>
                        <input type="file" accept="image/*" className="admin-input" name="image" onChange={handleChange} required />
                        {image && (
                            <div style={{ marginTop: '1rem', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E6D5C3' }}>
                                <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

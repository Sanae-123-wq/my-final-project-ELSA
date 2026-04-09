import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveImageUrl } from '../../utils/imageUrl';

const VendorProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '', price: '', stock: '', category: '', discount: '0'
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadMyProducts();
    }, [user]);

    const loadMyProducts = async () => {
        setLoading(true);
        try {
            const allProducts = await api.fetchProducts();
            const myProds = allProducts.filter(p =>
                p.vendorId?.toString() === user?._id?.toString()
            );
            setProducts(myProds);
        } catch (err) {
            console.error('Error fetching vendor products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (product) => {
        setCurrentProduct(product);
        setEditFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            discount: product.discount || 0
        });
        setShowEditModal(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await api.updateProduct(currentProduct._id, {
                ...editFormData,
                price: parseFloat(editFormData.price),
                stock: parseInt(editFormData.stock),
                discount: parseInt(editFormData.discount)
            });
            setShowEditModal(false);
            loadMyProducts();
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Failed to update product');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await api.deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete. Please try again.');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'all' || p.approvalStatus === filterStatus)
    );

    const getStatusBadge = (status) => {
        const statusClass = status === 'approved' ? 'status-delivered' :
            status === 'rejected' ? 'status-pending' :
                'status-preparing';

        const label = status === 'approved' ? 'Approved' :
            status === 'rejected' ? 'Rejected' :
                'Pending Review';

        return <span className={`order-status-badge ${statusClass}`}>{label}</span>;
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div><p>Loading your catalog...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">🥐 My Products</h1>
                    <p className="admin-page-subtitle">Manage your pastry catalog and view approval statuses</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-filters-row">
                    <input
                        type="text"
                        placeholder="Search your products..."
                        className="admin-input"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="admin-input"
                        style={{ width: 'auto' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending Review</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table admin-table-full">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <motion.tbody>
                            <AnimatePresence>
                                {filteredProducts.map((product, index) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        style={{ opacity: product.approvalStatus === 'rejected' ? 0.6 : 1 }}
                                    >
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="product-image-cell">
                                                    <img src={resolveImageUrl(product.image)} alt={product.name} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#3D2314' }}>{product.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>ID: {product._id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td style={{ fontWeight: '600' }}>{product.price.toFixed(2)} MAD</td>
                                        <td>
                                            {product.discount > 0 ? (
                                                <span className="order-status-badge status-ready" style={{ background: '#FEE2E2', color: '#EF4444', fontWeight: '700' }}>
                                                    -{product.discount}%
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>None</span>
                                            )}
                                        </td>
                                        <td>
                                            {getStatusBadge(product.approvalStatus)}
                                            {product.approvalStatus === 'rejected' && (
                                                <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px' }}>Incomplete details</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                {product.approvalStatus !== 'rejected' && (
                                                    <button 
                                                        className="admin-action-btn action-edit" 
                                                        title="Edit Product"
                                                        onClick={() => handleOpenEdit(product)}
                                                    >✏️</button>
                                                )}
                                                <button
                                                    className="admin-action-btn action-delete"
                                                    title="Delete Product"
                                                    onClick={() => handleDelete(product._id)}
                                                >🗑️</button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="admin-empty-state">
                                            <p>No products found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <>
                        <motion.div 
                            className="admin-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            style={{
                                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                                background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <motion.div 
                                className="admin-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'white', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '500px',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                                }}
                            >
                                <h2 style={{ marginBottom: '1.5rem', color: '#3D2314', fontFamily: 'Playfair Display, serif' }}>✏️ Edit Product</h2>
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="premium-form-group" style={{ marginBottom: '1.25rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Name</label>
                                        <input 
                                            type="text" name="name" className="admin-input" style={{ width: '100%' }}
                                            value={editFormData.name} onChange={handleUpdateChange} required
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                        <div className="premium-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (MAD)</label>
                                            <input 
                                                type="number" step="0.01" name="price" className="admin-input" style={{ width: '100%' }}
                                                value={editFormData.price} onChange={handleUpdateChange} required
                                            />
                                        </div>
                                        <div className="premium-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Discount (%)</label>
                                            <input 
                                                type="number" min="0" max="100" name="discount" className="admin-input" style={{ width: '100%' }}
                                                value={editFormData.discount} onChange={handleUpdateChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="premium-form-group" style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock</label>
                                        <input 
                                            type="number" name="stock" className="admin-input" style={{ width: '100%' }}
                                            value={editFormData.stock} onChange={handleUpdateChange} required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="button" className="vap-btn-cancel" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Cancel</button>
                                        <button type="submit" className="vap-btn-submit" style={{ flex: 1 }} disabled={updating}>
                                            {updating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorProducts;

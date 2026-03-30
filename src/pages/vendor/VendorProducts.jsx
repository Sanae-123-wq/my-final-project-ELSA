import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const VendorProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadMyProducts();
    }, [user]);

    const loadMyProducts = async () => {
        setLoading(true);
        try {
            const allProducts = await api.fetchProducts();
            
            // Filter products belonging to this vendor
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
                          'status-preparing'; // for pending review
        
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id} style={{ opacity: product.approvalStatus === 'rejected' ? 0.6 : 1 }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="product-image-cell">
                                                <img src={product.image} alt={product.name} />
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
                                        {getStatusBadge(product.approvalStatus)}
                                        {product.approvalStatus === 'rejected' && (
                                            <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px' }}>Incomplete details</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            {product.approvalStatus !== 'rejected' && (
                                                <button className="admin-action-btn action-edit" title="Edit Product">✏️</button>
                                            )}
                                            <button 
                                                className="admin-action-btn action-delete" 
                                                title="Delete Product"
                                                onClick={() => handleDelete(product._id)}
                                            >🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="admin-empty-state">
                                            <p>No products found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorProducts;

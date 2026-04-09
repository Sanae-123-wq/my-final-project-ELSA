import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaStore, FaMotorcycle, FaArrowLeft, FaCheck, FaCamera } from 'react-icons/fa';
import '../auth.css';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    
    // Common Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Role-specific Fields
    const [address, setAddress] = useState('');
    const [shopName, setShopName] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [vehicleType, setVehicleType] = useState('bike');

    const { user, register, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'vendor') navigate('/vendor');
            else if (user.role === 'delivery') navigate('/delivery');
            else navigate('/');
        }
    }, [user, authLoading, navigate]);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!name || !email || !password) return "Please fill out all basic fields";
        if (password.length < 6) return "Password must be at least 6 characters";
        
        if (role === 'client' && !address) return "Address is required";
        if (role === 'vendor') {
            if (!shopName) return "Store Name is mandatory";
            if (!city) return "Store Location (City) is mandatory";
            if (!description) return "Store Description is mandatory";
            if (!image) return "Store Profile Image is mandatory";
            if (!phone) return "Phone number is mandatory";
        }
        if (role === 'delivery' && (!phone || !vehicleType)) return "Please fill all delivery details";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);

        if (role === 'client') {
            formData.append('address', address);
        } else if (role === 'vendor') {
            formData.append('shopName', shopName);
            formData.append('city', city);
            formData.append('phone', phone);
            formData.append('description', description);
            formData.append('image', image);
        } else if (role === 'delivery') {
            formData.append('phone', phone);
            formData.append('vehicleType', vehicleType);
        }

        try {
            // Note: register in AuthContext now accepts FormData
            await register(formData);
            if (role === 'vendor') navigate('/vendor');
            else if (role === 'delivery') navigate('/delivery');
            else navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'client', title: 'Client', icon: <FaUser />, desc: 'Discover and order delicious pastries' },
        { id: 'vendor', title: 'Pastry Chef', icon: <FaStore />, desc: 'Sell your sweet creations' },
        { id: 'delivery', title: 'Delivery Person', icon: <FaMotorcycle />, desc: 'Deliver smiles and treats' },
    ];

    return (
        <div className="auth-page-container">
            <div className="auth-main-card">
                
                <div className="auth-header">
                    <h2>Join ELSA</h2>
                    <p>{step === 1 ? 'Choose your journey in our pastry marketplace' : 'Complete your profile details'}</p>
                    
                    <div className="auth-timeline">
                        <div className="timeline-line"></div>
                        <div className="timeline-progress" style={{ width: step === 2 ? '100%' : '0%' }}></div>
                        
                        <div className="node-wrapper" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <div className={`timeline-node ${step >= 1 ? 'node-active' : 'node-inactive'}`}>
                                {step > 1 ? <FaCheck size={14} /> : '1'}
                            </div>
                            <span className="node-label">Role</span>
                        </div>

                        <div className="node-wrapper" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <div className={`timeline-node ${step >= 2 ? 'node-active' : 'node-inactive'}`}>
                                2
                            </div>
                            <span className="node-label">Details</span>
                        </div>
                    </div>
                </div>

                <div className="auth-body">
                    {error && (
                        <div className="auth-error-banner">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="fade-enter">
                            <div className="role-grid">
                                {roles.map((r) => (
                                    <div 
                                        key={r.id}
                                        onClick={() => handleRoleSelect(r.id)}
                                        className={`role-card ${role === r.id ? 'selected' : ''}`}
                                    >
                                        <div className="role-icon">
                                            {r.icon}
                                        </div>
                                        <div className="role-title">{r.title}</div>
                                        <div className="role-desc">{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="auth-footer">
                                Already have an account? <Link to="/login">Login here</Link>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-enter">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="auth-back-btn"
                            >
                                <FaArrowLeft style={{ marginRight: '8px' }} /> Back to roles
                            </button>

                            <form onSubmit={handleSubmit}>
                                {role === 'vendor' && (
                                    <div className="image-upload-wrapper fade-enter">
                                        <div className="image-preview-container">
                                            {preview ? (
                                                <img src={preview} alt="Store Preview" className="image-preview" />
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <FaCamera size={24} />
                                                    <span>Store Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <label htmlFor="store-image" className="file-input-label">
                                            {preview ? 'Change Store Photo' : 'Upload Store Photo'}
                                        </label>
                                        <input 
                                            id="store-image"
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden-file-input"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">* Mandatory Store Image</p>
                                    </div>
                                )}

                                <div className="auth-form-row auth-form-group">
                                    <div>
                                        <label className="auth-label">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="auth-input"
                                            placeholder="Jane Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="auth-label">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="auth-input"
                                            placeholder="jane@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="auth-form-group">
                                    <label className="auth-label">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input"
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                </div>

                                {role === 'client' && (
                                    <div className="auth-form-group fade-enter">
                                        <label className="auth-label">Delivery Address</label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="auth-textarea"
                                            placeholder="123 Sweet Street, Bakery City"
                                            required
                                        ></textarea>
                                    </div>
                                )}

                                {role === 'vendor' && (
                                    <div className="dynamic-section fade-enter">
                                        <div className="dynamic-section-title">Store Details</div>
                                        <div className="auth-form-row auth-form-group">
                                            <div>
                                                <label className="auth-label">Store Name *</label>
                                                <input
                                                    type="text"
                                                    value={shopName}
                                                    onChange={(e) => setShopName(e.target.value)}
                                                    className="auth-input"
                                                    placeholder="ELSA Bakery"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="auth-label">Location (City) *</label>
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="auth-input"
                                                    placeholder="Agadir"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="auth-form-group">
                                            <label className="auth-label">Phone Number *</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="auth-input"
                                                placeholder="+212 6... "
                                                required
                                            />
                                        </div>
                                        <div className="auth-form-group">
                                            <label className="auth-label">Store Description *</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="auth-textarea"
                                                placeholder="Briefly describe your delicious offerings..."
                                                required
                                                rows="2"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {role === 'delivery' && (
                                    <div className="dynamic-section fade-enter">
                                        <div className="dynamic-section-title">Delivery Details</div>
                                        <div className="auth-form-group">
                                            <label className="auth-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="auth-input"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                        <div className="auth-form-group">
                                            <label className="auth-label">Vehicle Type</label>
                                            <div className="radio-group">
                                                {['bike', 'scooter', 'car'].map(type => (
                                                    <label key={type} className={`radio-btn ${vehicleType === type ? 'selected' : ''}`}>
                                                        <input 
                                                            type="radio" 
                                                            name="vehicle" 
                                                            className="radio-input-hidden" 
                                                            value={type}
                                                            checked={vehicleType === type}
                                                            onChange={(e) => setVehicleType(e.target.value)}
                                                        />
                                                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" disabled={loading} className="auth-submit-btn">
                                    {loading ? <div className="spinner"></div> : 'Create Store Account'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;

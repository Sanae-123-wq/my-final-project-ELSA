import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await register(name, email, password, role);
            if (userData.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join ELSA</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Start your culinary adventure today</p>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="min 6 characters"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <label style={{ flex: 1, cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="client" 
                                    checked={role === 'client'} 
                                    onChange={() => setRole('client')} 
                                    style={{ marginRight: '8px' }}
                                />
                                Client
                            </label>
                            <label style={{ flex: 1, cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="vendor" 
                                    checked={role === 'vendor'} 
                                    onChange={() => setRole('vendor')}
                                    style={{ marginRight: '8px' }}
                                />
                                Patissier
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

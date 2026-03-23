import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(email, password);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'delivery') {
                navigate('/delivery');
            } else if (userData.role === 'vendor') {
                // If there is a vendor dashboard, redirect there, else home
                navigate('/');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Login to continue your sweet journey</p>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="test@example.com"
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
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

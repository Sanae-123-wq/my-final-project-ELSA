import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../auth.css';

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
            if (userData.role === 'admin') navigate('/admin');
            else if (userData.role === 'vendor') navigate('/vendor');
            else if (userData.role === 'delivery') navigate('/delivery');
            else navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-main-card" style={{ maxWidth: '480px' }}>
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to continue your sweet journey</p>
                </div>

                <div className="auth-body">
                    {/* Error display */}
                    {error && (
                        <div className="auth-error-banner">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                placeholder="test@example.com"
                                required
                            />
                        </div>
                        <div className="auth-form-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? <div className="spinner"></div> : 'Login'}
                        </button>

                        <div className="auth-footer">
                            <p>
                                Don't have an account? <Link to="/signup">Sign Up</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

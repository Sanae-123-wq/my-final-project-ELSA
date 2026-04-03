import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(email, password);
            
            // Redirect based on role
            const origin = location.state?.from?.pathname || (
                userData.role === 'admin' ? '/admin' :
                userData.role === 'vendor' ? '/vendor' :
                userData.role === 'delivery' ? '/delivery' : '/'
            );
            
            navigate(origin);
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

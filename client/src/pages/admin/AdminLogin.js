import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(email, password);

            if (response.success) {
                navigate('/admin/dashboard');
            } else {
                setError(response.message || 'Login failed. Please check your credentials.');
            }
        } catch (submitError) {
            setError('An error occurred while logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="admin-login-page">
            <div className="admin-login-bg admin-login-bg--one" aria-hidden="true" />
            <div className="admin-login-bg admin-login-bg--two" aria-hidden="true" />

            <div className="admin-login-shell">
                <aside className="admin-login-showcase">
                    <span className="admin-login-pill">
                        <Sparkles size={14} />
                        Enterprise-grade portal
                    </span>
                    <h1>Secure Admin Access</h1>
                    <p>
                        Centralized control for services, tenders, enquiries, and users with production-ready performance and governance.
                    </p>

                    <ul>
                        <li><ShieldCheck size={16} /> Role-based access architecture</li>
                        <li><ShieldCheck size={16} /> Streamlined content workflows</li>
                        <li><ShieldCheck size={16} /> Fast and responsive on every screen</li>
                    </ul>
                </aside>

                <div className="admin-login-card">
                    <div className="admin-login-card__head">
                        <span className="brand__badge">G</span>
                        <div>
                            <h2>Admin Login</h2>
                            <p>Government e-Marketplace Services</p>
                        </div>
                    </div>

                    {error && (
                        <div className="admin-login-error" role="alert">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={15} />
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="form-control"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={15} />
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="form-control"
                                required
                                disabled={loading}
                            />
                        </div>

                        <label className="checkbox-row" htmlFor="remember">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                            />
                            <span>Keep me signed in on this device</span>
                        </label>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner" />
                                    Logging in...
                                </span>
                            ) : (
                                'Login to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="admin-login-links">
                        <p>
                            Need access? <Link to="/contact">Contact Support</Link>
                        </p>
                        <p>
                            Lost password? <Link to="/contact">Reset Password</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    FileBox,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, logout } = useAuth();

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { title: 'Pages', icon: FileText, path: '/admin/pages' },
        { title: 'Services', icon: Briefcase, path: '/admin/services' },
        { title: 'Tenders', icon: FileBox, path: '/admin/tenders' },
        { title: 'Blogs', icon: FileText, path: '/admin/blogs' },
        { title: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
        { title: 'Users', icon: Users, path: '/admin/users' },
        { title: 'Settings', icon: Settings, path: '/admin/settings' }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-shell">
            <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <div className="admin-sidebar__head">
                    <h2>Admin Console</h2>
                    <p>Welcome, {admin?.name || 'Admin'}</p>
                </div>

                <nav className="admin-sidebar__nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-sidebar__link ${isActive(item.path) ? 'is-active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon size={18} />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar__footer">
                    <button type="button" onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="admin-content-wrap">
                <header className="admin-topbar">
                    <button
                        type="button"
                        className="admin-menu-btn"
                        onClick={() => setSidebarOpen((open) => !open)}
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="admin-profile">
                        <span className="admin-profile__avatar">{admin?.name?.charAt(0) || 'A'}</span>
                        <span className="admin-profile__meta">
                            <strong>{admin?.name || 'Admin'}</strong>
                            <small>{admin?.role || 'Administrator'}</small>
                        </span>
                    </div>
                </header>

                <main className="admin-main">{children}</main>
            </div>

            {sidebarOpen && <button type="button" aria-label="Close sidebar overlay" className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
};

export default AdminLayout;

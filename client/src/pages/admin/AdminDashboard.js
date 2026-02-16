import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Briefcase, FileBox, MessageSquare, Users, Clock } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTenders: 0,
        activeTenders: 0,
        pendingEnquiries: 0,
        totalUsers: 0,
        premiumUsers: 0,
        totalServices: 0,
        activeServices: 0,
        totalBlogs: 0,
        publishedBlogs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tendersRes, usersRes, servicesRes, enquiriesRes, blogsRes] = await Promise.all([
                    api.get('/tenders'),
                    api.get('/users'),
                    api.get('/services'),
                    api.get('/enquiries'),
                    api.get('/blogs')
                ]);

                const tenders = Array.isArray(tendersRes.data) ? tendersRes.data : [];
                const users = Array.isArray(usersRes.data) ? usersRes.data : [];
                const services = Array.isArray(servicesRes.data) ? servicesRes.data : [];
                const enquiries = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
                const blogs = Array.isArray(blogsRes.data) ? blogsRes.data : [];

                setStats({
                    totalTenders: tenders.length,
                    activeTenders: tenders.filter((t) => t.enabled !== false).length,
                    pendingEnquiries: enquiries.filter((e) => ['new', 'pending'].includes(String(e.status || '').toLowerCase())).length,
                    totalUsers: users.length,
                    premiumUsers: users.filter((u) => String(u.role || '').toLowerCase() === 'premium').length,
                    totalServices: services.length,
                    activeServices: services.filter((s) => s.enabled !== false).length,
                    totalBlogs: blogs.length,
                    publishedBlogs: blogs.filter((b) => b.enabled !== false).length
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Tenders', value: stats.totalTenders, icon: FileBox, color: '#007bff', bgColor: '#e3f2fd' },
        { title: 'Active Tenders', value: stats.activeTenders, icon: Clock, color: '#28a745', bgColor: '#d4edda' },
        { title: 'Pending Enquiries', value: stats.pendingEnquiries, icon: MessageSquare, color: '#ffc107', bgColor: '#fff3cd' },
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#17a2b8', bgColor: '#d1ecf1' },
        { title: 'Premium Users', value: stats.premiumUsers, icon: Briefcase, color: '#15803d', bgColor: '#dcfce7' },
        { title: 'Total Services', value: stats.totalServices, icon: FileText, color: '#fd7e14', bgColor: '#fff3e0' },
        { title: 'Active Services', value: stats.activeServices, icon: BarChart3, color: '#20c997', bgColor: '#d1fae5' },
        { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: '#6f42c1', bgColor: '#efe8ff' },
        { title: 'Published Blogs', value: stats.publishedBlogs, icon: Briefcase, color: '#198754', bgColor: '#dcfce7' }
    ];

    const quickActions = [
        { title: 'Manage Tenders', path: '/admin/tenders', color: '#007bff', icon: FileBox },
        { title: 'Manage Services', path: '/admin/services', color: '#28a745', icon: FileText },
        { title: 'Manage Blogs', path: '/admin/blogs', color: '#ffc107', icon: FileText },
        { title: 'View Enquiries', path: '/admin/enquiries', color: '#dc3545', icon: MessageSquare }
    ];

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2c3e50' }}>Dashboard</h1>
                <div style={{ backgroundColor: '#e3f2fd', color: '#007bff', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15 }}>
                                    <div>
                                        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: 5 }}>{stat.title}</p>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50' }}>{stat.value}</h3>
                                    </div>
                                    <div style={{ width: 50, height: 50, backgroundColor: stat.bgColor, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                        <Icon style={{ width: 24, height: 24 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2c3e50' }}>Quick Actions</h3>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15 }}>
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.path}
                                    onClick={() => navigate(action.path)}
                                    style={{
                                        padding: '18px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Icon style={{ width: 28, height: 28, color: action.color, marginBottom: 8 }} />
                                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#2c3e50' }}>
                                        {action.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyForm = {
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    date: '',
    enabled: true
};

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            slug: (form.slug || form.title).toLowerCase().trim().replace(/\s+/g, '-'),
            date: form.date || new Date().toISOString().slice(0, 10)
        };

        try {
            if (editingId) {
                await api.put(`/blogs/${editingId}`, payload);
            } else {
                await api.post('/blogs', payload);
            }
            resetForm();
            fetchBlogs();
        } catch (error) {
            console.error('Error saving blog:', error);
        }
    };

    const handleEdit = (blog) => {
        setEditingId(blog._id);
        setForm({
            ...emptyForm,
            ...blog,
            date: blog.date ? String(blog.date).slice(0, 10) : ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleToggleStatus = async (blog) => {
        try {
            await api.put(`/blogs/${blog._id}`, {
                enabled: !Boolean(blog.enabled)
            });
            fetchBlogs();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="loading">Loading blogs...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Manage Blogs</h1>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                    <h2 className="section-title title-sm">{editingId ? 'Edit Blog' : 'Add Blog'}</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required /></div>
                        <div className="form-group"><label>Slug</label><input className="form-control" value={form.slug} onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))} placeholder="auto from title" /></div>
                        <div className="form-group"><label>Category</label><input className="form-control" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))} /></div>
                        <div className="form-group"><label>Date</label><input type="date" className="form-control" value={form.date} onChange={(e) => setForm((v) => ({ ...v, date: e.target.value }))} /></div>
                    </div>
                    <div className="form-group"><label>Excerpt</label><textarea rows={2} className="form-control" value={form.excerpt} onChange={(e) => setForm((v) => ({ ...v, excerpt: e.target.value }))} /></div>
                    <div className="form-group"><label>Content</label><textarea rows={4} className="form-control" value={form.content} onChange={(e) => setForm((v) => ({ ...v, content: e.target.value }))} /></div>
                    <div className="cta-row">
                        <button className="btn btn-primary" type="submit">{editingId ? 'Update Blog' : 'Create Blog'}</button>
                        {editingId ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancel Edit</button> : null}
                    </div>
                </div>
            </form>

            <div className="card">
                <div className="card-body" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px' }}>{blog.title}</td>
                                    <td style={{ padding: '10px' }}>{blog.category || '-'}</td>
                                    <td style={{ padding: '10px' }}>{blog.date ? new Date(blog.date).toLocaleDateString() : '-'}</td>
                                    <td style={{ padding: '10px' }}>{blog.enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleEdit(blog)}>Edit</button>
                                        <button className="btn btn-light" type="button" onClick={() => handleToggleStatus(blog)}>{blog.enabled ? 'Disable' : 'Enable'}</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleDelete(blog._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogs;

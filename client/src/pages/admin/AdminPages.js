import { useEffect, useState } from 'react';
import api from '../../services/api';
import { pageTemplates, pageTemplateKeys } from '../../config/pageTemplates';

const emptyForm = {
    pageName: '',
    title: '',
    content: '',
    enabled: true
};

const mediaConfigExamples = {
    home: '{\n  "title": "GeM Services India",\n  "kicker": "Enterprise Procurement Enablement",\n  "lead": "Your hero lead text",\n  "heroPrimaryImage": "https://.../image-left.jpg",\n  "heroSecondaryImage": "https://.../image-right.jpg",\n  "showcaseImages": [\n    "https://.../showcase-1.jpg",\n    "https://.../showcase-2.jpg",\n    "https://.../showcase-3.jpg"\n  ]\n}',
    about: '{\n  "title": "About Us",\n  "lead": "Your lead",\n  "heroImage": "https://.../about-hero.jpg",\n  "sections": []\n}',
    why_choose_us: '{\n  "title": "Why Choose Us",\n  "lead": "Your lead",\n  "heroImage": "https://.../why-hero.jpg",\n  "items": [\n    {\n      "title": "Specialized Procurement Team",\n      "text": "Description",\n      "imageUrl": "https://.../item-image.jpg"\n    }\n  ]\n}'
};

const AdminPages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const fetchPages = async () => {
        try {
            const response = await api.get('/pages');
            setPages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/pages/${editingId}`, form);
            } else {
                await api.post('/pages', form);
            }
            resetForm();
            fetchPages();
        } catch (error) {
            console.error('Error saving page:', error);
        }
    };

    const handleEdit = (page) => {
        setEditingId(page._id);
        setForm({
            pageName: page.pageName || '',
            title: page.title || '',
            content: page.content || '',
            enabled: Boolean(page.enabled ?? true)
        });
    };

    const applyTemplate = (pageName) => {
        if (!pageName || !pageTemplates[pageName]) return;
        const template = pageTemplates[pageName];
        setForm((prev) => ({
            ...prev,
            pageName,
            title: template.title || prev.title || pageName,
            content: JSON.stringify(template, null, 2)
        }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this page?')) return;
        try {
            await api.delete(`/pages/${id}`);
            fetchPages();
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    };

    const handleToggleStatus = async (page) => {
        try {
            await api.put(`/pages/${page._id}`, {
                enabled: !Boolean(page.enabled)
            });
            fetchPages();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="loading">Loading pages...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Manage Pages</h1>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                    <h2 className="section-title title-sm">{editingId ? 'Edit Page' : 'Add Page'}</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="form-group">
                            <label>Page Name</label>
                            <input list="page-template-keys" className="form-control" value={form.pageName} onChange={(e) => setForm((v) => ({ ...v, pageName: e.target.value }))} required />
                            <datalist id="page-template-keys">
                                {pageTemplateKeys.map((key) => (
                                    <option value={key} key={key} />
                                ))}
                            </datalist>
                        </div>
                        <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required /></div>
                    </div>
                    <div className="cta-row mt-0">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => applyTemplate(form.pageName)}
                            disabled={!form.pageName}
                        >
                            Load Template JSON
                        </button>
                    </div>
                    <div className="form-group">
                        <label>Content (JSON recommended)</label>
                        <textarea rows={10} className="form-control" value={form.content} onChange={(e) => setForm((v) => ({ ...v, content: e.target.value }))} />
                    </div>
                    {mediaConfigExamples[form.pageName] ? (
                        <div className="notice mt-0">
                            <strong>Image Fields for `{form.pageName}`</strong>
                            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, fontSize: '0.85rem' }}>{mediaConfigExamples[form.pageName]}</pre>
                        </div>
                    ) : null}
                    <div className="cta-row">
                        <button className="btn btn-primary" type="submit">{editingId ? 'Update Page' : 'Create Page'}</button>
                        {editingId ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancel Edit</button> : null}
                    </div>
                </div>
            </form>

            <div className="card">
                <div className="card-body" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Page Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => (
                                <tr key={page._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px' }}>{page.pageName || '-'}</td>
                                    <td style={{ padding: '10px' }}>{page.title}</td>
                                    <td style={{ padding: '10px' }}>{page.enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleEdit(page)}>Edit</button>
                                        <button className="btn btn-light" type="button" onClick={() => handleToggleStatus(page)}>{page.enabled ? 'Disable' : 'Enable'}</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleDelete(page._id)}>Delete</button>
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

export default AdminPages;

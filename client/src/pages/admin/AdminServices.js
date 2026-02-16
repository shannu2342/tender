import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyForm = {
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    enabled: true
};

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            slug: (form.slug || form.title).toLowerCase().trim().replace(/\s+/g, '-')
        };

        try {
            if (editingId) {
                await api.put(`/services/${editingId}`, payload);
            } else {
                await api.post('/services', payload);
            }
            resetForm();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setForm({
            title: service.title || '',
            slug: service.slug || '',
            description: service.description || '',
            imageUrl: service.imageUrl || '',
            enabled: Boolean(service.enabled ?? true)
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            window.alert('Please upload an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setForm((v) => ({ ...v, imageUrl: String(reader.result || '') }));
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleToggleStatus = async (service) => {
        try {
            await api.put(`/services/${service._id}`, {
                enabled: !Boolean(service.enabled)
            });
            fetchServices();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading services...</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Manage Services</h1>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                    <h2 className="section-title title-sm">{editingId ? 'Edit Service' : 'Add Service'}</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="form-group">
                            <label>Title</label>
                            <input className="form-control" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input className="form-control" value={form.slug} onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))} placeholder="auto from title" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} />
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="form-group">
                            <label>Image URL</label>
                            <input className="form-control" value={form.imageUrl} onChange={(e) => setForm((v) => ({ ...v, imageUrl: e.target.value }))} placeholder="https://...image.jpg" />
                        </div>
                        <div className="form-group">
                            <label>Upload Image</label>
                            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                        </div>
                    </div>
                    {form.imageUrl ? (
                        <img src={form.imageUrl} alt="Service preview" className="media-cover media-cover--sm" style={{ borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.35)' }} />
                    ) : null}
                    <div className="cta-row">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update Service' : 'Create Service'}</button>
                        {editingId ? <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel Edit</button> : null}
                    </div>
                </div>
            </form>

            <div className="card">
                <div className="card-body" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Slug</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Image</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px' }}>{service.slug || '-'}</td>
                                    <td style={{ padding: '10px' }}>{service.title}</td>
                                    <td style={{ padding: '10px' }}>{service.imageUrl ? 'Added' : 'Not Added'}</td>
                                    <td style={{ padding: '10px' }}>{service.enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button type="button" className="btn btn-secondary" onClick={() => handleEdit(service)}>Edit</button>
                                        <button type="button" className="btn btn-light" onClick={() => handleToggleStatus(service)}>{service.enabled ? 'Disable' : 'Enable'}</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => handleDelete(service._id)}>Delete</button>
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

export default AdminServices;

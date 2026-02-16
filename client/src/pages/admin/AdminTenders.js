import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyForm = {
    title: '',
    department: '',
    tenderNumber: '',
    governmentType: 'state',
    state: '',
    district: '',
    category: '',
    description: '',
    lastDate: '',
    openingDate: '',
    estimatedValue: '',
    currency: 'INR',
    isPaidContent: false,
    enabled: true,
    documentName: '',
    documentUrl: ''
};

const AdminTenders = () => {
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const fetchTenders = async () => {
        try {
            const response = await api.get('/tenders');
            setTenders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching tenders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenders();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const documents = [];
        if (form.documentUrl.trim()) {
            documents.push({
                name: form.documentName.trim() || 'Tender Document',
                url: form.documentUrl.trim(),
                type: 'application/pdf'
            });
        }

        const payload = {
            ...form,
            estimatedValue: Number(form.estimatedValue || 0),
            documents
        };

        try {
            if (editingId) {
                await api.put(`/tenders/${editingId}`, payload);
            } else {
                await api.post('/tenders', payload);
            }
            resetForm();
            fetchTenders();
        } catch (error) {
            console.error('Error saving tender:', error);
        }
    };

    const handleEdit = (tender) => {
        const firstDoc = Array.isArray(tender.documents) ? tender.documents.find((doc) => doc?.url) : null;
        setEditingId(tender._id);
        setForm({
            ...emptyForm,
            ...tender,
            lastDate: tender.lastDate ? String(tender.lastDate).slice(0, 10) : '',
            openingDate: tender.openingDate ? String(tender.openingDate).slice(0, 10) : '',
            documentName: firstDoc?.name || '',
            documentUrl: firstDoc?.url || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tender?')) return;
        try {
            await api.delete(`/tenders/${id}`);
            fetchTenders();
        } catch (error) {
            console.error('Error deleting tender:', error);
        }
    };

    const handleToggleStatus = async (tender) => {
        try {
            await api.put(`/tenders/${tender._id}`, {
                enabled: !Boolean(tender.enabled)
            });
            fetchTenders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="loading">Loading tenders...</div>;

    const handlePdfUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            window.alert('Please upload a PDF file only.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setForm((v) => ({
                ...v,
                documentName: file.name,
                documentUrl: String(reader.result || '')
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Manage Tenders</h1>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                    <h2 className="section-title title-sm">{editingId ? 'Edit Tender' : 'Add Tender'}</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required /></div>
                        <div className="form-group"><label>Department</label><input className="form-control" value={form.department} onChange={(e) => setForm((v) => ({ ...v, department: e.target.value }))} required /></div>
                        <div className="form-group"><label>Tender Number</label><input className="form-control" value={form.tenderNumber} onChange={(e) => setForm((v) => ({ ...v, tenderNumber: e.target.value }))} /></div>
                        <div className="form-group"><label>Category</label><input className="form-control" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))} /></div>
                        <div className="form-group"><label>State</label><input className="form-control" value={form.state} onChange={(e) => setForm((v) => ({ ...v, state: e.target.value }))} /></div>
                        <div className="form-group"><label>District</label><input className="form-control" value={form.district} onChange={(e) => setForm((v) => ({ ...v, district: e.target.value }))} /></div>
                        <div className="form-group"><label>Last Date</label><input type="date" className="form-control" value={form.lastDate} onChange={(e) => setForm((v) => ({ ...v, lastDate: e.target.value }))} /></div>
                        <div className="form-group"><label>Estimated Value</label><input type="number" className="form-control" value={form.estimatedValue} onChange={(e) => setForm((v) => ({ ...v, estimatedValue: e.target.value }))} /></div>
                        <div className="form-group"><label>PDF Name</label><input className="form-control" value={form.documentName} onChange={(e) => setForm((v) => ({ ...v, documentName: e.target.value }))} placeholder="Tender Document.pdf" /></div>
                        <div className="form-group"><label>PDF URL (optional)</label><input className="form-control" value={form.documentUrl} onChange={(e) => setForm((v) => ({ ...v, documentUrl: e.target.value }))} placeholder="https://.../tender.pdf" /></div>
                    </div>
                    <div className="form-group">
                        <label>Upload PDF</label>
                        <input type="file" accept="application/pdf" className="form-control" onChange={handlePdfUpload} />
                        <p className="section-subtitle">You can upload a PDF or provide a direct PDF URL.</p>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={Boolean(form.isPaidContent)}
                                onChange={(e) => setForm((v) => ({ ...v, isPaidContent: e.target.checked }))}
                            />
                            Mark as Premium Tender
                        </label>
                    </div>
                    <div className="form-group"><label>Description</label><textarea rows={3} className="form-control" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} /></div>
                    <div className="cta-row">
                        <button className="btn btn-primary" type="submit">{editingId ? 'Update Tender' : 'Create Tender'}</button>
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
                                <th style={{ textAlign: 'left', padding: '10px' }}>Department</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Access</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Last Date</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenders.map((tender) => (
                                <tr key={tender._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px' }}>{tender.title}</td>
                                    <td style={{ padding: '10px' }}>{tender.department}</td>
                                    <td style={{ padding: '10px' }}>{tender.isPaidContent ? 'Premium' : 'Open'}</td>
                                    <td style={{ padding: '10px' }}>{tender.lastDate ? new Date(tender.lastDate).toLocaleDateString() : '-'}</td>
                                    <td style={{ padding: '10px' }}>{tender.enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleEdit(tender)}>Edit</button>
                                        <button className="btn btn-light" type="button" onClick={() => handleToggleStatus(tender)}>{tender.enabled ? 'Disable' : 'Enable'}</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleDelete(tender._id)}>Delete</button>
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

export default AdminTenders;

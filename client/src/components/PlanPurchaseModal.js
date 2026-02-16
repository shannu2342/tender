import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { enquiriesService } from '../services/api';

const PlanPurchaseModal = ({ open, onClose, plan }) => {
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: ''
    });

    const summary = useMemo(() => {
        if (!plan) return '';
        return [
            `Plan: ${plan.name}`,
            `Price: ${plan.price}${plan.frequency || ''}`,
            `Sample timeline: ${plan.sampleTimeline || 'As discussed'}`
        ].join(' | ');
    }, [plan]);

    if (!open || !plan) return null;

    const close = () => {
        setBusy(false);
        setDone(false);
        setError('');
        setForm({ name: '', email: '', phone: '', company: '', notes: '' });
        onClose?.();
    };

    const submit = async () => {
        if (!form.name || !form.email || !form.phone) {
            setError('Name, email and phone are required.');
            return;
        }

        try {
            setBusy(true);
            setError('');
            await enquiriesService.createEnquiry({
                name: form.name.trim(),
                email: form.email.trim(),
                mobile: form.phone.trim(),
                service: `Plan Purchase - ${plan.name}`,
                subject: `Purchase request for ${plan.name}`,
                message: [
                    summary,
                    `Company: ${form.company || '-'}`,
                    `Selected sample: ${(plan.sampleDeliverables || []).join(', ') || '-'}`,
                    `Notes: ${form.notes || '-'}`
                ].join('\n')
            });
            setDone(true);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to submit purchase request right now.');
        } finally {
            setBusy(false);
        }
    };

    const content = (
        <div className="premium-modal" role="dialog" aria-modal="true" aria-label="Plan purchase">
            <button type="button" className="premium-modal__backdrop" aria-label="Close plan purchase" onClick={close} />
            <div className="premium-modal__panel pricing-modal__panel">
                <div className="premium-modal__head">
                    <div className="chip-row">
                        <span className="chip chip--premium"><Sparkles size={14} /> Purchase Plan</span>
                    </div>
                    <button type="button" className="mobile-nav__close" onClick={close} aria-label="Close plan purchase">X</button>
                </div>

                <div className="premium-modal__body">
                    <h3 className="section-title title-sm">{plan.name}</h3>
                    <p className="section-subtitle">{plan.description}</p>
                    <div className="premium-price">{plan.price} <span>{plan.frequency || ''}</span></div>

                    <div className="notice mt-12">
                        <strong>Sample Deliverables You Will Receive</strong>
                        <ul className="list-clean list-check mt-10">
                            {(plan.sampleDeliverables || []).map((item) => <li key={item}>{item}</li>)}
                        </ul>
                        <p className="section-subtitle mt-10">
                            <ShieldCheck size={14} style={{ verticalAlign: 'middle' }} /> Expected start timeline: {plan.sampleTimeline}
                        </p>
                    </div>

                    {done ? (
                        <div className="notice notice--success mt-14">
                            <strong>Purchase request submitted.</strong>
                            <p>Our team will contact you with final proposal and payment link.</p>
                            <button type="button" className="btn btn-primary mt-12" onClick={close}>
                                Done <CheckCircle2 size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-8 mt-14">
                            <div className="form-group">
                                <label>Name *</label>
                                <input className="form-control" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input className="form-control" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input className="form-control" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input className="form-control" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea className="form-control" rows="3" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
                            </div>
                            {error ? <div className="notice notice--error">{error}</div> : null}
                            <button type="button" className="btn btn-success" disabled={busy} onClick={submit}>
                                {busy ? 'Submitting...' : 'Proceed to Purchase'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default PlanPurchaseModal;


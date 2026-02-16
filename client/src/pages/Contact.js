import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock3, MessageCircle } from 'lucide-react';
import { enquiriesService } from '../services/api';
import { useManagedPage } from '../hooks/useManagedPage';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Contact = () => {
    const location = useLocation();
    const siteData = useSiteSettings();
    const managed = useManagedPage('contact', {
        title: 'Talk to Our Team',
        lead: 'Share your requirement and we will respond with scope, timeline, documentation needs, and the best support model.'
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ kind: 'idle', message: '' });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const subject = params.get('subject');
        if (!subject) return;
        setFormData((prev) => ({ ...prev, subject }));
    }, [location.search]);

    const serviceOptions = useMemo(
        () => [
            { value: '', label: 'Select a service (optional)' },
            { value: 'GeM Registration', label: 'GeM Registration' },
            { value: 'Catalogue Enablement', label: 'Catalogue Enablement' },
            { value: 'Bid Participation', label: 'Bid Participation' },
            { value: 'Tender Tracking', label: 'Tender Tracking' },
            { value: 'Enterprise SLA Support', label: 'Enterprise SLA Support' },
            { value: 'Other', label: 'Other' }
        ],
        []
    );

    const handleChange = (e) => {
        if (status.kind !== 'idle') setStatus({ kind: 'idle', message: '' });
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus({ kind: 'loading', message: '' });
            await enquiriesService.createEnquiry({
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.phone.trim(),
                service: formData.serviceType || 'General enquiry',
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                source: 'contact_form',
                website: siteData.domain
            });
            setStatus({ kind: 'success', message: 'Thanks. Your enquiry is received. Our team will contact you shortly.' });
            setFormData({ name: '', email: '', phone: '', serviceType: '', subject: '', message: '' });
        } catch (error) {
            setStatus({
                kind: 'error',
                message:
                    error?.response?.data?.message ||
                    'Unable to submit right now. Please try again or contact us through phone/email.'
            });
        }
    };

    return (
        <div className="page">
            <div className="container">
                <section className="hero-panel">
                    <span className="kicker"><MessageCircle size={14} /> Contact Us</span>
                    <h1 className="page__title mt-12">{managed.title}</h1>
                    <p className="page__lead">{managed.lead}</p>
                </section>

                <div className="split-layout mt-24">
                    <aside className="card">
                        <div className="card-body">
                            <h2 className="section-title title-sm">Contact Details</h2>
                            <ul className="list-clean mt-12">
                                <li><Phone size={15} /> <a href={`tel:${siteData.contact.phoneTel}`}>{siteData.contact.phoneDisplay}</a></li>
                                <li><Mail size={15} /> <a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a></li>
                                <li><MapPin size={15} /> {siteData.contact.addressLine}</li>
                                <li><Clock3 size={15} /> {siteData.contact.hours}</li>
                            </ul>
                            <div className="cta-row mt-14">
                                <a href={`https://wa.me/${siteData.contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">
                                    <MessageCircle size={16} /> WhatsApp Support
                                </a>
                            </div>
                        </div>
                    </aside>

                    <section className="card" aria-label="Contact form">
                        <div className="card-body">
                            <h2 className="section-title title-sm">Send an Enquiry</h2>
                            <p className="section-subtitle">Please provide basic details and our team will revert with next steps.</p>

                            {status.kind === 'success' ? <div className="notice notice--success">{status.message}</div> : null}
                            {status.kind === 'error' ? <div className="notice notice--error">{status.message}</div> : null}

                            <form onSubmit={handleSubmit} className="mt-14">
                                <div className="form-group">
                                    <label htmlFor="contact-name">Name *</label>
                                    <input id="contact-name" className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email">Email *</label>
                                    <input id="contact-email" className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-phone">Phone *</label>
                                    <input id="contact-phone" className="form-control" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-service">Service</label>
                                    <select id="contact-service" className="form-control" name="serviceType" value={formData.serviceType} onChange={handleChange}>
                                        {serviceOptions.map((opt) => (
                                            <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-subject">Subject</label>
                                    <input id="contact-subject" className="form-control" type="text" name="subject" value={formData.subject} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-message">Message *</label>
                                    <textarea id="contact-message" className="form-control" name="message" rows={5} value={formData.message} onChange={handleChange} required />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block" disabled={status.kind === 'loading'}>
                                    {status.kind === 'loading' ? (
                                        <span className="btn-loading"><span className="spinner" /> Sending...</span>
                                    ) : (
                                        'Send Enquiry'
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Contact;

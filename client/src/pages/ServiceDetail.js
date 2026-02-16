import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { serviceCatalog } from '../data/siteContent';
import { servicesService } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';

const ServiceDetail = () => {
    const { slug } = useParams();
    const site = useSiteSettings();
    const [remoteServices, setRemoteServices] = useState([]);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await servicesService.getServices();
                if (Array.isArray(response.data)) {
                    setRemoteServices(response.data);
                }
            } catch (error) {
                // Keep fallback data.
            }
        };

        loadServices();
    }, []);

    const source = remoteServices.length ? remoteServices : serviceCatalog;

    const service = useMemo(() => {
        return (
            source.find((item) => String(item.slug || item.id || item._id) === String(slug)) ||
            source[0]
        );
    }, [source, slug]);

    const features = service.features || [
        'Business requirement assessment',
        'Compliance-first workflow',
        'Dedicated implementation support'
    ];

    const benefits = service.benefits || [
        'Faster execution timelines',
        'Lower compliance risk',
        'Clear process ownership'
    ];

    const process = service.process || [
        { step: '01', title: 'Discovery', description: 'Scope and readiness evaluation.' },
        { step: '02', title: 'Planning', description: 'Execution plan with milestones.' },
        { step: '03', title: 'Implementation', description: 'Hands-on delivery and QA.' },
        { step: '04', title: 'Support', description: 'Continuous optimization and support.' }
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="split-layout">
                    <article className="legal-card prose">
                        {service.imageUrl ? (
                            <img src={service.imageUrl} alt={service.title} className="media-cover media-cover--md" style={{ borderRadius: 14 }} />
                        ) : null}
                        <span className="chip chip--sky">{service.price || 'Custom Engagement'}</span>
                        <h1 className="page__title mt-14">{service.title}</h1>
                        <p className="page__lead mt-12">{service.longDescription || service.description}</p>

                        <h2>Key Features</h2>
                        <ul>
                            {features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>

                        <h2>Business Benefits</h2>
                        <ul>
                            {benefits.map((benefit) => (
                                <li key={benefit}>{benefit}</li>
                            ))}
                        </ul>

                        <h2>Delivery Workflow</h2>
                        {process.map((step, index) => (
                            <div key={`${step.step || index}-${step.title}`} className="notice">
                                <strong>{step.step || String(index + 1).padStart(2, '0')} - {step.title}</strong>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </article>

                    <aside className="card">
                        <div className="card-body">
                            <h2 className="section-title title-sm">Get Expert Assistance</h2>
                            <p className="section-subtitle">Connect with our team for timeline, scope, and pricing discussion.</p>

                            <div className="cta-row mt-16">
                                <a href={`tel:${site.contact.phoneTel}`} className="btn btn-primary">
                                    <Phone size={16} /> Call Us
                                </a>
                                <a href={`mailto:${site.contact.email}`} className="btn btn-secondary">
                                    <Mail size={16} /> Email
                                </a>
                                <a
                                    href={`https://wa.me/${site.contact.whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success"
                                >
                                    <MessageCircle size={16} /> WhatsApp
                                </a>
                            </div>

                            <div className="notice mt-18">
                                <strong>Prefer bundled support?</strong>
                                <p>We can combine this with bid participation and compliance workflows in one engagement.</p>
                            </div>

                            <div className="cta-row mt-14">
                                <Link to="/contact" className="btn btn-light">Request Proposal</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;

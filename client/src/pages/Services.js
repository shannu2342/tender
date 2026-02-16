import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceCatalog } from '../data/siteContent';
import { servicesService } from '../services/api';

const Services = () => {
    const [services, setServices] = useState(serviceCatalog);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await servicesService.getServices();
                if (Array.isArray(response.data) && response.data.length) {
                    setServices(response.data);
                }
            } catch (error) {
                // Keep fallback data for UI continuity.
            }
        };

        loadServices();
    }, []);

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">Our Services</h1>
                    <p className="page__lead">
                        Enterprise-grade services for GeM onboarding, catalogue quality, bid participation, and tender operations.
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const slug = service.slug || service.id || service._id;
                        return (
                            <article key={service._id || slug} className="card">
                                {service.imageUrl ? (
                                    <img
                                        src={service.imageUrl}
                                        alt={service.title}
                                        className="media-cover media-cover--md"
                                        loading="lazy"
                                    />
                                ) : null}
                                <div className="card-body">
                                    <div className="service-price-box">
                                        <span className="service-price__label">Starting Price</span>
                                        <p className="service-price">{service.price || 'Enterprise Support'}</p>
                                    </div>
                                    <h2 className="section-title title-md mt-12">{service.title}</h2>
                                    <p className="section-subtitle">{service.shortDescription || service.description}</p>
                                    <ul className="list-clean list-check mt-14">
                                        {(service.features || [
                                            'Documentation and compliance checks',
                                            'Structured execution workflow',
                                            'Dedicated support and guidance'
                                        ]).slice(0, 3).map((feature) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                    </ul>
                                    <div className="cta-row">
                                        <Link to={`/services/${slug}`} className="btn btn-primary">Explore Service</Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="hero-panel mt-30">
                    <h2 className="section-title">Need a Custom Engagement?</h2>
                    <p className="section-subtitle">We can design a blended support model based on your volume, team structure, and SLA expectations.</p>
                    <div className="cta-row">
                        <Link to="/contact" className="btn btn-primary">Talk to Our Team</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Clock3, ShieldCheck, BriefcaseBusiness } from 'lucide-react';
import { servicesService, tendersService } from '../services/api';
import { serviceCatalog, tenderRecords } from '../data/siteContent';
import { useManagedPage } from '../hooks/useManagedPage';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Home = () => {
    const site = useSiteSettings();
    const managed = useManagedPage('home', {
        kicker: 'Enterprise Procurement Enablement',
        title: site.name,
        lead: 'Built for serious teams that need predictable support for GeM onboarding, catalogue execution, bid participation, and tender delivery timelines.'
    });
    const [services, setServices] = useState([]);
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typedTitle, setTypedTitle] = useState("");
    const [typedLead, setTypedLead] = useState("");
    const showcaseImages = Array.isArray(managed.showcaseImages) && managed.showcaseImages.length
        ? managed.showcaseImages.slice(0, 3)
        : [
            'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80'
        ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, tendersRes] = await Promise.all([
                    servicesService.getServices({ limit: 6 }),
                    tendersService.getTenders({ limit: 3, featured: true })
                ]);
                setServices(servicesRes.data?.length ? servicesRes.data : serviceCatalog);
                setTenders(tendersRes.data?.length ? tendersRes.data : tenderRecords.slice(0, 3));
            } catch (error) {
                setServices(serviceCatalog);
                setTenders(tenderRecords.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const heroTitle = managed.title || site.name || "";
        const heroLead = managed.lead || "";

        setTypedTitle("");
        setTypedLead("");

        if (!heroTitle && !heroLead) return;

        let cancelled = false;
        const timeouts = [];
        let titleIndex = 0;
        let leadIndex = 0;

        const schedule = (fn, delay) => {
            const id = setTimeout(() => {
                if (!cancelled) fn();
            }, delay);
            timeouts.push(id);
        };

        const resetAndRestart = () => {
            titleIndex = 0;
            leadIndex = 0;
            setTypedTitle("");
            setTypedLead("");
            schedule(typeTitle, 260);
        };

        const typeLead = () => {
            if (!heroLead) {
                schedule(resetAndRestart, 1200);
                return;
            }

            leadIndex += 1;
            setTypedLead(heroLead.slice(0, leadIndex));

            if (leadIndex < heroLead.length) {
                schedule(typeLead, 14);
                return;
            }

            schedule(resetAndRestart, 1800);
        };

        const typeTitle = () => {
            if (!heroTitle) {
                schedule(typeLead, 120);
                return;
            }

            titleIndex += 1;
            setTypedTitle(heroTitle.slice(0, titleIndex));

            if (titleIndex < heroTitle.length) {
                schedule(typeTitle, 60);
                return;
            }

            schedule(typeLead, 120);
        };

        schedule(typeTitle, 120);

        return () => {
            cancelled = true;
            timeouts.forEach((id) => clearTimeout(id));
        };
    }, [managed.title, managed.lead, site.name]);

    if (loading) {
        return (
            <div className="loading">
                <div className="btn-loading btn btn-primary">
                    <span className="spinner" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="page page--tight-top">
            <div className="container">
                <section
                    className="hero-panel home-hero-panel"
                    aria-label={site.home.heroImageAlt || 'Home hero section'}
                >
                    <div className="home-hero-layout">
                        <div className="home-hero-copy">
                            <span className="kicker">{managed.kicker}</span>
                            <h1 className="page__title mt-14 home-hero__typed-title">{typedTitle}</h1>
                            <p className="page__lead home-hero__lead--light home-hero__typed-lead">{typedLead}</p>
                            <div className="cta-row">
                                <Link to="/services" className="btn btn-primary">
                                    Explore Services <ArrowRight size={16} />
                                </Link>
                                <Link to="/tenders" className="btn btn-secondary">
                                    Active Tenders <Clock3 size={16} />
                                </Link>
                                <a href={`https://wa.me/${site.contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">
                                    WhatsApp Desk <MessageCircle size={16} />
                                </a>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-box">
                                    <strong>10+ Years</strong>
                                    <span>Procurement and compliance operations</span>
                                </div>
                                <div className="stat-box">
                                    <strong>Pan-India</strong>
                                    <span>Support across sectors and states</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="page">
                <div className="container">
                    <header className="page__header">
                        <h2 className="section-title">Core Services</h2>
                        <p className="section-subtitle">Execution-focused services designed for measurable procurement outcomes.</p>
                    </header>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.slice(0, 6).map((service) => {
                            const slug = service.slug || service.id;
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
                                        <div className="chip-row mb-0">
                                            <span className="chip chip--sky"><BriefcaseBusiness size={14} /> Service</span>
                                        </div>
                                        <h3 className="section-title title-md">{service.title}</h3>
                                        <p className="section-subtitle">{service.description || service.shortDescription}</p>
                                        <div className="cta-row">
                                            <Link to={`/services/${slug}`} className="btn btn-primary">View Details</Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="page page--no-top">
                <div className="container">
                    <div className="hero-panel">
                        <header className="page__header mb-12">
                            <h2 className="section-title">Execution Highlights</h2>
                            <p className="section-subtitle">Interactive snapshots from enterprise procurement workflows.</p>
                        </header>
                        <div className="image-showcase-grid">
                            {showcaseImages.map((image, index) => (
                                <figure
                                    key={`${image}-${index}`}
                                    className={`image-showcase-card image-showcase-card--${index + 1}`}
                                >
                                    <img src={image} alt={`Execution highlight ${index + 1}`} className="media-cover media-cover--md" loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="page page--no-top">
                <div className="container">
                    <header className="page__header">
                        <h2 className="section-title">Featured Tenders</h2>
                        <p className="section-subtitle">Curated opportunities with essential context for faster bid decisions.</p>
                    </header>
                    <div className="table-like">
                        {tenders.map((tender, index) => (
                            <article
                                key={tender._id || tender.id}
                                className={`table-like__row home-tender-row ${index % 2 === 0 ? 'home-tender-row--left' : 'home-tender-row--right'}`}
                            >
                                <div className="chip-row">
                                    <span className={`chip ${tender.isPaidContent ? 'chip--premium' : 'chip--sky'}`}>
                                        {tender.isPaidContent ? 'Premium Access' : 'Open Access'}
                                    </span>
                                    <span className="chip">{tender.governmentType === 'central' ? 'Central Govt' : 'State Govt'}</span>
                                </div>
                                <h3 className="section-title title-sm">{tender.title}</h3>
                                <p className="section-subtitle">{tender.department}</p>
                                <div className="table-like__meta">
                                    <div>
                                        <strong>Location</strong>
                                        <span>{tender.state || 'India'}</span>
                                    </div>
                                    <div>
                                        <strong>Last Date</strong>
                                        <span>{new Date(tender.lastDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link to={`/tenders/${tender._id || tender.id}`} className="btn btn-primary">Open Tender</Link>
                            </article>
                        ))}
                    </div>
                    <div className="cta-row mt-24">
                        <Link to="/tenders" className="btn btn-primary">See All Tenders</Link>
                    </div>
                </div>
            </section>

            <section className="page page--no-top">
                <div className="container">
                    <div className="hero-panel home-why-panel">
                        <h2 className="section-title">Why Teams Choose Us</h2>
                        <div className="grid gap-8 md:grid-cols-3 mt-14 home-why-grid">
                            <div className="home-why-item">
                                <span className="chip chip--sky"><ShieldCheck size={14} /> Compliance First</span>
                                <p className="section-subtitle mt-10">Structured checks reduce submission risks and documentation gaps.</p>
                            </div>
                            <div className="home-why-item">
                                <span className="chip chip--sky"><Clock3 size={14} /> Faster Execution</span>
                                <p className="section-subtitle mt-10">Defined workflows and ownership keep milestones on schedule.</p>
                            </div>
                            <div className="home-why-item">
                                <span className="chip chip--sky"><BriefcaseBusiness size={14} /> Enterprise Model</span>
                                <p className="section-subtitle mt-10">Scalable support for multi-team and multi-location operations.</p>
                            </div>
                        </div>
                        <div className="cta-row mt-24">
                            <Link to="/contact" className="btn btn-primary">Book a Consultation</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

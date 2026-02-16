import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { servicesService } from '../services/api';

const quickLinks = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Tenders', path: '/tenders' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
];

const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Cancellation Policy', path: '/cancellation-policy' },
    { name: 'Disclaimer', path: '/disclaimer' },
    { name: 'Sitemap', path: '/sitemap' }
];

const Footer = () => {
    const site = useSiteSettings();
    const [serviceTitles, setServiceTitles] = useState([]);
    const socialLinks = [
        { key: 'facebook', href: site.social.facebook, label: 'Facebook', icon: <Facebook size={16} />, className: 'social-btn social-btn--facebook' },
        { key: 'instagram', href: site.social.instagram, label: 'Instagram', icon: <Instagram size={16} />, className: 'social-btn social-btn--instagram' },
        { key: 'youtube', href: site.social.youtube, label: 'YouTube', icon: <Youtube size={16} />, className: 'social-btn social-btn--youtube' }
    ].filter((item) => Boolean(item.href));

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await servicesService.getServices();
                if (Array.isArray(response.data) && response.data.length) {
                    setServiceTitles(
                        response.data
                            .filter((item) => item?.enabled !== false)
                            .map((item) => item.title)
                            .filter(Boolean)
                            .slice(0, 6)
                    );
                }
            } catch {
                setServiceTitles([]);
            }
        };

        loadServices();
    }, []);

    return (
        <footer className="site-footer">
            <div className="container site-footer__grid">
                <section>
                    <div className="brand brand--footer">
                        {site.branding.logoUrl ? (
                            <img src={site.branding.logoUrl} alt={site.branding.logoAlt || site.name} className="brand__logo" />
                        ) : (
                            <span className="brand__badge">G</span>
                        )}
                        <span className="brand__text">
                            <strong>{site.name}</strong>
                            <small>{site.tagline}</small>
                        </span>
                    </div>
                    <p className="site-footer__text">
                        {site.footer.blurb}
                    </p>
                    {socialLinks.length ? (
                        <div className="site-footer__socials">
                            {socialLinks.map((item) => (
                                <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className={item.className}>
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    ) : null}
                </section>

                <section>
                    <h3 className="site-footer__title">Navigation</h3>
                    <ul className="site-footer__list">
                        {quickLinks.map((link) => (
                            <li key={link.path}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="site-footer__title">Core Solutions</h3>
                    <ul className="site-footer__list">
                        {(serviceTitles.length ? serviceTitles : site.footer.solutions).map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="site-footer__title">Contact</h3>
                    <ul className="site-footer__contact-list">
                        <li>
                            <MapPin size={16} />
                            <span>{site.contact.addressLine}</span>
                        </li>
                        <li>
                            <Phone size={16} />
                            <a href={`tel:${site.contact.phoneTel}`}>{site.contact.phoneDisplay}</a>
                        </li>
                        <li>
                            <Mail size={16} />
                            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                        </li>
                        <li>
                            <MessageCircle size={16} />
                            <a href={`https://wa.me/${site.contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                WhatsApp Support
                            </a>
                        </li>
                    </ul>
                </section>
            </div>

            <div className="container site-footer__bottom">
                <div className="site-footer__legal-links">
                    {legalLinks.map((item) => (
                        <Link key={item.path} to={item.path}>
                            {item.name}
                        </Link>
                    ))}
                </div>
                <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
                <p>This website is not affiliated with or endorsed by the Government of India.</p>
            </div>
        </footer>
    );
};

export default Footer;

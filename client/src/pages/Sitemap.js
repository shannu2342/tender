import { Link } from 'react-router-dom';
import { useManagedPage } from '../hooks/useManagedPage';

const groups = [
    {
        title: 'Main Pages',
        links: [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Why Choose Us', path: '/why-choose-us' },
            { name: 'How It Works', path: '/how-it-works' },
            { name: 'Services', path: '/services' },
            { name: 'Tenders', path: '/tenders' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'Testimonials', path: '/testimonials' },
            { name: 'FAQ', path: '/faq' },
            { name: 'Contact', path: '/contact' },
            { name: 'Blog', path: '/blog' }
        ]
    },
    {
        title: 'Legal',
        links: [
            { name: 'Privacy Policy', path: '/privacy-policy' },
            { name: 'Terms & Conditions', path: '/terms-conditions' },
            { name: 'Refund Policy', path: '/refund-policy' },
            { name: 'Cancellation Policy', path: '/cancellation-policy' },
            { name: 'Disclaimer', path: '/disclaimer' },
            { name: 'Tender Disclaimer', path: '/tender-disclaimer' },
            { name: 'Service Agreement', path: '/service-agreement' },
            { name: 'Compliance', path: '/compliance' }
        ]
    },
    {
        title: 'Admin',
        links: [
            { name: 'Admin Login', path: '/admin/login' },
            { name: 'Dashboard', path: '/admin/dashboard' },
            { name: 'Pages', path: '/admin/pages' },
            { name: 'Services', path: '/admin/services' },
            { name: 'Tenders', path: '/admin/tenders' }
        ]
    }
];

const Sitemap = () => {
    const managed = useManagedPage('sitemap', {
        title: 'Sitemap',
        lead: 'Quick access to all major sections of the website.'
    });

    return (
        <div className="page">
            <div className="container page__narrow">
                <header className="page__header">
                    <h1 className="page__title">{managed.title}</h1>
                    <p className="page__lead">{managed.lead}</p>
                </header>

                <div className="grid gap-8 md:grid-cols-3">
                    {groups.map((group) => (
                        <section key={group.title} className="card">
                            <div className="card-body">
                                <h2 className="section-title title-sm">{group.title}</h2>
                                <ul className="list-clean">
                                    {group.links.map((item) => (
                                        <li key={item.path}>
                                            <Link to={item.path} className="btn btn-secondary link-list-btn">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;

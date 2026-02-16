import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Mail, Phone, ArrowUpRight, Crown, LogOut } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import PremiumAccessModal from './PremiumAccessModal';

const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Tenders', path: '/tenders' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'Services', path: '/services' },
    { title: 'About', path: '/about' },
    { title: 'Why Choose Us', path: '/why-choose-us' },
    { title: 'Blog', path: '/blog' },
    { title: 'Contact', path: '/contact' }
];

const Header = () => {
    const headerRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const site = useSiteSettings();
    const { user, isPremium, isLoggedIn, logout } = useCustomerAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const className = 'mobile-nav-open';
        document.body.classList.toggle(className, isMenuOpen);
        return () => document.body.classList.remove(className);
    }, [isMenuOpen]);

    useEffect(() => {
        const setHeaderOffset = () => {
            if (!headerRef.current) return;
            const height = headerRef.current.offsetHeight || 0;
            document.documentElement.style.setProperty('--header-offset', `${height}px`);
        };

        setHeaderOffset();
        window.addEventListener('resize', setHeaderOffset);
        return () => window.removeEventListener('resize', setHeaderOffset);
    }, []);

    const isActive = (path) => location.pathname === path;
    const handlePremiumClick = () => {
        if (!isLoggedIn) {
            setPremiumModalOpen(true);
            return;
        }
        navigate('/pricing?upgrade=premium');
    };

    return (
        <header ref={headerRef} className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
            <div className="site-header__topbar">
                <div className="container site-header__topbar-inner">
                    <div className="site-header__contact-group">
                        <a href={`tel:${site.contact.phoneTel}`} className="site-header__contact-link">
                            <Phone size={14} />
                            {site.contact.phoneDisplay}
                        </a>
                        <a href={`mailto:${site.contact.email}`} className="site-header__contact-link">
                            <Mail size={14} />
                            {site.contact.email}
                        </a>
                    </div>
                    <Link to="/contact" className="site-header__top-cta">
                        Enterprise Consultation <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="container site-header__main">
                <Link to="/" className="brand" aria-label="Go to home page">
                    {site.branding.logoUrl ? (
                        <img src={site.branding.logoUrl} alt={site.branding.logoAlt || site.name} className="brand__logo" />
                    ) : (
                        <span className="brand__badge">G</span>
                    )}
                    <span className="brand__text">
                        <strong>{site.name}</strong>
                        <small>{site.tagline}</small>
                    </span>
                </Link>

                <nav className="site-nav" aria-label="Main navigation">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`site-nav__link ${isActive(item.path) ? 'is-active' : ''}`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="site-header__actions">
                    {site.premium.enabled ? (
                        <button
                            type="button"
                            className={`site-header__premium-btn ${isPremium ? 'is-active' : ''}`}
                            onClick={handlePremiumClick}
                        >
                            <Crown size={16} />
                            {isPremium ? 'Premium Active' : 'Premium Access'}
                        </button>
                    ) : null}
                    {isLoggedIn ? (
                        <button type="button" className="site-header__logout-btn" onClick={logout} aria-label="Logout">
                            <LogOut size={16} />
                            <span>{user?.name?.split(' ')[0] || 'Logout'}</span>
                        </button>
                    ) : null}
                </div>

                <button
                    type="button"
                    className="site-header__menu-btn"
                    onClick={() => setIsMenuOpen((v) => !v)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-nav"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div
                id="mobile-nav"
                className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <button
                    type="button"
                    className="mobile-nav__backdrop"
                    aria-label="Close navigation"
                    onClick={() => setIsMenuOpen(false)}
                />

                <div className="mobile-nav__panel">
                    <div className="mobile-nav__head">
                        <Link to="/" className="brand" aria-label="Go to home page">
                            {site.branding.logoUrl ? (
                                <img src={site.branding.logoUrl} alt={site.branding.logoAlt || site.name} className="brand__logo" />
                            ) : (
                                <span className="brand__badge">G</span>
                            )}
                            <span className="brand__text">
                                <strong>{site.name}</strong>
                                <small>{site.tagline}</small>
                            </span>
                        </Link>

                        <button
                            type="button"
                            className="mobile-nav__close"
                            aria-label="Close menu"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {site.premium.enabled ? (
                        <div className="mobile-nav__quick" aria-label="Quick actions">
                            <button
                                type="button"
                            className="mobile-nav__quick-btn mobile-nav__quick-btn--primary"
                                onClick={handlePremiumClick}
                            >
                                <Crown size={16} />
                                {isPremium ? 'Premium Active' : 'Premium Access'}
                            </button>
                        </div>
                    ) : null}

                    <div className="mobile-nav__links">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-nav__link ${isActive(item.path) ? 'is-active' : ''}`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {site.premium.enabled ? (
                <PremiumAccessModal
                    open={premiumModalOpen}
                    onClose={() => setPremiumModalOpen(false)}
                    authOnly
                    onAuthenticated={() => navigate('/pricing?upgrade=premium')}
                />
            ) : null}
        </header>
    );
};

export default Header;

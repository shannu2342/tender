import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Crown, Lock } from 'lucide-react';
import { tenderRecords } from '../data/siteContent';
import { tendersService } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import PremiumAccessModal from '../components/PremiumAccessModal';

const upCities = [
    'Agra', 'Aligarh', 'PrayagRaj', 'Ambedkar Nagar', 'Amroha', 'Auraiya', 'Azamgarh', 'Badaun', 'Bahraich',
    'Ballia', 'Balrampur', 'Banda District', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Bulandshahr',
    'Chandauli(Varanasi Dehat)', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur',
    'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
    'Hapur District', 'Hardoi', 'Hathras', 'Jaunpur District', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar',
    'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
    'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Rae Bareli', 'Rampur', 'Saharanpur', 'Sant Kabir Nagar', 'Sant Ravidas Nagar', 'Sambhal', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi (Kashi)',
    'Allahabad', 'Amethi', 'Bagpat'
];

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const getGovernmentCategory = (tender) => {
    const state = normalize(tender.state);
    if (state === 'uttarpradesh' || state === 'up') {
        return 'uttarpradesh';
    }
    return 'india';
};

const getTenderCity = (tender) => tender.district || tender.city || tender.location?.city || '';
const maskTenderNumber = (value, isPremium) => (isPremium ? (value || '-') : 'XXXXX');

const Tenders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [governmentCategory, setGovernmentCategory] = useState('all');
    const [city, setCity] = useState('all');
    const [tenders, setTenders] = useState(tenderRecords);
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);
    const site = useSiteSettings();
    const navigate = useNavigate();
    const { isPremium, isLoggedIn } = useCustomerAuth();
    const handlePremiumAction = () => {
        if (isPremium) return;
        if (isLoggedIn) {
            navigate('/pricing?upgrade=premium');
            return;
        }
        setPremiumModalOpen(true);
    };

    useEffect(() => {
        const loadTenders = async () => {
            try {
                const response = await tendersService.getTenders();
                if (Array.isArray(response.data) && response.data.length) {
                    setTenders(response.data);
                }
            } catch (error) {
                // Keep fallback data.
            }
        };

        loadTenders();
    }, []);

    const filtered = tenders.filter((tender) => {
        const matchesSearch =
            (tender.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tender.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tender.department || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGov = governmentCategory === 'all' || getGovernmentCategory(tender) === governmentCategory;
        const matchesCity = city === 'all' || normalize(getTenderCity(tender)) === normalize(city);
        return matchesSearch && matchesGov && matchesCity;
    });

    const visibleTenders = useMemo(() => {
        if (isPremium || !site.premium.enabled) return filtered;

        const openTenders = filtered
            .filter((item) => !item.isPaidContent)
            .slice(0, Number(site.premium.freeVisibleTenders || 5));
        const premiumPreview = filtered
            .filter((item) => item.isPaidContent)
            .slice(0, Number(site.premium.premiumPreviewTenders || 2));

        return [...openTenders, ...premiumPreview];
    }, [filtered, isPremium, site.premium.enabled, site.premium.freeVisibleTenders, site.premium.premiumPreviewTenders]);

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">Tenders</h1>
                    <p className="page__lead">
                        Search and evaluate government opportunities with structured data and clear eligibility context.
                    </p>
                </header>

                {!isPremium && site.premium.enabled ? (
                    <section className="premium-banner mb-24">
                        <div>
                            <span className="chip chip--premium"><Crown size={14} /> Premium Access</span>
                            <h2 className="section-title title-sm mt-12">Unlock all premium tenders</h2>
                            <p className="section-subtitle">Login with mobile and password, then complete payment to access all paid opportunities.</p>
                        </div>
                        <button type="button" className="btn btn-success btn-glass" onClick={handlePremiumAction}>
                            <Crown size={16} /> Activate Premium
                        </button>
                    </section>
                ) : null}

                <section className="hero-panel mb-24">
                    {!isPremium && site.premium.enabled ? (
                        <p className="section-subtitle mb-12">
                            Showing {site.premium.freeVisibleTenders} open tenders and {site.premium.premiumPreviewTenders} premium previews.
                        </p>
                    ) : null}
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="form-group">
                            <label htmlFor="tender-search">Search</label>
                            <div className="search-wrap">
                                <Search size={16} className="search-wrap__icon" />
                                <input
                                    id="tender-search"
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Title, department, keywords"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gov-type">Government Category</label>
                            <select
                                id="gov-type"
                                className="form-control"
                                value={governmentCategory}
                                onChange={(e) => setGovernmentCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="india">Central</option>
                                <option value="uttarpradesh">Uttar Pradesh</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <select id="city" className="form-control" value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="all">All Cities</option>
                                {upCities.map((cityName) => (
                                    <option key={cityName} value={cityName}>
                                        {cityName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="table-like">
                    {visibleTenders.map((tender) => (
                        <article key={tender.id || tender._id} className="table-like__row">
                            <div className="chip-row">
                                <span className={`chip ${tender.isPaidContent ? 'chip--premium' : 'chip--sky'}`}>
                                    {tender.isPaidContent ? 'Premium' : 'Open'}
                                </span>
                                <span className="chip">{getGovernmentCategory(tender) === 'uttarpradesh' ? 'Uttar Pradesh' : 'Central'}</span>
                                <span className="chip">{getTenderCity(tender) || 'City Not Specified'}</span>
                            </div>
                            <h2 className="section-title title-md">{tender.title}</h2>
                            <p className="section-subtitle">
                                {tender.isPaidContent && !isPremium
                                    ? 'Premium tender preview. Activate premium for complete details and full scope.'
                                    : tender.description}
                            </p>
                            <div className="table-like__meta">
                                <div>
                                    <strong>Department</strong>
                                    <span>{tender.department || 'Not specified'}</span>
                                </div>
                                <div>
                                    <strong>Tender No.</strong>
                                    <span>{maskTenderNumber(tender.tenderNumber, isPremium)}</span>
                                </div>
                                <div>
                                    <strong>Location</strong>
                                    <span>{[tender.state, tender.district].filter(Boolean).join(', ') || 'India'}</span>
                                </div>
                                <div>
                                    <strong>Last Date</strong>
                                    <span>{tender.lastDate ? new Date(tender.lastDate).toLocaleDateString() : '-'}</span>
                                </div>
                            </div>
                            <div className="cta-row">
                                <Link to={`/tenders/${tender.id || tender._id}`} className="btn btn-primary">
                                    {tender.isPaidContent && !isPremium ? <><Lock size={16} /> Preview</> : 'View Details'}
                                </Link>
                                {tender.isPaidContent && !isPremium ? (
                                    <button type="button" className="btn btn-primary btn-glass" onClick={handlePremiumAction}>
                                        <Crown size={16} /> Premium Access
                                    </button>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
                <PremiumAccessModal
                    open={premiumModalOpen}
                    onClose={() => setPremiumModalOpen(false)}
                    authOnly
                    onAuthenticated={() => navigate('/pricing?upgrade=premium')}
                />
            </div>
        </div>
    );
};

export default Tenders;

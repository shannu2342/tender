import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Mail, MapPin, MessageCircle, Phone, Crown, Lock } from 'lucide-react';
import { tenderRecords } from '../data/siteContent';
import { tendersService } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import PremiumAccessModal from '../components/PremiumAccessModal';

const TenderDetail = () => {
    const { id } = useParams();
    const site = useSiteSettings();
    const navigate = useNavigate();
    const { isPremium, isLoggedIn } = useCustomerAuth();
    const [remoteTender, setRemoteTender] = useState(null);
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    useEffect(() => {
        const loadTender = async () => {
            try {
                const response = await tendersService.getTenderById(id);
                if (response.data) {
                    setRemoteTender(response.data);
                }
            } catch (error) {
                // Keep fallback record.
            }
        };

        loadTender();
    }, [id]);

    const tender = useMemo(() => {
        return remoteTender || tenderRecords.find((item) => item.id === id || item._id === id) || tenderRecords[0];
    }, [id, remoteTender]);
    const isLocked = Boolean(tender.isPaidContent && site.premium.enabled && !isPremium);
    const maskedTenderNumber = isPremium ? (tender.tenderNumber || '-') : 'XXXXX';
    const handlePremiumAction = () => {
        if (isLoggedIn) {
            navigate('/pricing?upgrade=premium');
            return;
        }
        setPremiumModalOpen(true);
    };

    const firstDoc = tender.documents?.find((doc) => doc.url && doc.url !== '#');
    const related = tenderRecords.filter((item) => (item.id || item._id) !== (tender.id || tender._id)).slice(0, 3);

    return (
        <div className="page">
            <div className="container">
                <div className="split-layout">
                    <article className="legal-card prose">
                        <div className="chip-row">
                            <span className={`chip ${tender.isPaidContent ? 'chip--premium' : 'chip--sky'}`}>
                                {tender.isPaidContent ? 'Premium' : 'Open'}
                            </span>
                            <span className="chip">{tender.governmentType || 'general'}</span>
                            <span className="chip">{tender.category || 'misc'}</span>
                        </div>

                        <h1 className="page__title mt-12">{tender.title}</h1>
                        <p className="page__lead">
                            {isLocked
                                ? 'This is a premium tender. Activate premium access to view full details, documents, and complete eligibility requirements.'
                                : (tender.details || tender.description)}
                        </p>

                        <div className="table-like__meta mt-12">
                            <div>
                                <strong>Department</strong>
                                <span>{tender.department || 'Not specified'}</span>
                            </div>
                            <div>
                                <strong>Tender Number</strong>
                                <span>{maskedTenderNumber}</span>
                            </div>
                            <div>
                                <strong>Estimated Value</strong>
                                <span>{tender.currency || 'INR'} {Number(tender.estimatedValue || 0).toLocaleString()}</span>
                            </div>
                            <div>
                                <strong>Last Date</strong>
                                <span>{tender.lastDate ? new Date(tender.lastDate).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>

                        <h2>Eligibility</h2>
                        <p>{isLocked ? 'Premium members can view full eligibility and compliance checkpoints.' : (tender.eligibilityCriteria || 'Eligibility details available in tender documents.')}</p>

                        <h2>Required Documents</h2>
                        <ul>
                            {(isLocked
                                ? ['Premium access required to view full checklist']
                                : (tender.documentsRequired || ['Valid business registration', 'Tax and statutory documents'])
                            ).map((doc) => (
                                <li key={doc}>{doc}</li>
                            ))}
                        </ul>

                        <h2>Location</h2>
                        <p>
                            {tender.location?.address || ''} {[tender.location?.city || tender.city, tender.location?.state || tender.state, tender.location?.pinCode].filter(Boolean).join(', ')}
                        </p>

                        <h2>Tags</h2>
                        <div className="chip-row">
                            {(tender.tags || ['Government Tender']).map((tag) => (
                                <span key={tag} className="chip">{tag}</span>
                            ))}
                        </div>
                    </article>

                    <aside className="card">
                        <div className="card-body">
                            <h2 className="section-title title-sm">Quick Actions</h2>
                            {isLocked ? (
                                <div className="notice">
                                    <strong><Lock size={14} /> Premium tender content</strong>
                                    <p>Login with mobile and password, then activate premium to unlock this tender.</p>
                                </div>
                            ) : null}
                            <div className="cta-row">
                                {isLocked ? (
                                    <button type="button" className="btn btn-success btn-glass" onClick={handlePremiumAction}>
                                        <Crown size={16} /> Premium Access
                                    </button>
                                ) : (
                                    <Link
                                        to={`/contact?subject=${encodeURIComponent(`Tender enquiry: ${tender.title}`)}`}
                                        className="btn btn-primary"
                                    >
                                        Apply for Tender
                                    </Link>
                                )}
                                {!isLocked && firstDoc ? (
                                    <a href={firstDoc.url} download={firstDoc.name || 'tender-document.pdf'} className="btn btn-secondary btn-glass" target="_blank" rel="noopener noreferrer">
                                        <Download size={16} /> Download PDF
                                    </a>
                                ) : (
                                    <Link
                                        to={`/contact?subject=${encodeURIComponent(`Document request: ${tender.title}`)}`}
                                        className="btn btn-secondary btn-glass"
                                        title={isLocked ? 'Premium required' : 'Request documents'}
                                    >
                                        <Download size={16} /> {isLocked ? 'Premium Required' : 'Request Documents'}
                                    </Link>
                                )}
                            </div>

                            <div className="notice mt-18">
                                <strong>Contact Authority</strong>
                                <p><Phone size={14} /> {tender.contact?.phone || site.contact.phoneDisplay}</p>
                                <p><Mail size={14} /> {tender.contact?.email || site.contact.email}</p>
                                <p><MapPin size={14} /> {[tender.state, tender.district].filter(Boolean).join(', ') || 'India'}</p>
                            </div>

                            <div className="cta-row mt-12">
                                <a href={`tel:${tender.contact?.phone || site.contact.phoneTel}`} className="btn btn-light"><Phone size={16} /> Call</a>
                                <a href={`mailto:${tender.contact?.email || site.contact.email}`} className="btn btn-light"><Mail size={16} /> Email</a>
                                {tender.contact?.whatsapp ? (
                                    <a href={`https://wa.me/${String(tender.contact.whatsapp).replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">
                                        <MessageCircle size={16} /> WhatsApp
                                    </a>
                                ) : (
                                    <a href={`https://wa.me/${site.contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">
                                        <MessageCircle size={16} /> WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                <section className="page page--no-bottom">
                    <h2 className="section-title">Related Tenders</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {related.map((item) => (
                            <article key={item.id || item._id} className="card">
                                <div className="card-body">
                                    <h3 className="section-title title-sm">{item.title}</h3>
                                    <p className="section-subtitle">{item.department}</p>
                                    <div className="cta-row">
                                        <Link to={`/tenders/${item.id || item._id}`} className="btn btn-secondary">Open</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
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

export default TenderDetail;

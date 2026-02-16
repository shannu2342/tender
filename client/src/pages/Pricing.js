import { Link, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Crown } from 'lucide-react';
import { pricingPlans } from '../data/siteContent';
import { useManagedPage } from '../hooks/useManagedPage';
import { pageTemplates } from '../config/pageTemplates';
import PlanPurchaseModal from '../components/PlanPurchaseModal';
import PremiumAccessModal from '../components/PremiumAccessModal';

const Pricing = () => {
    const location = useLocation();
    const content = useManagedPage('pricing', pageTemplates.pricing);
    const plans = content.plans || pricingPlans;
    const [activePlan, setActivePlan] = useState(null);
    const [premiumPaymentOpen, setPremiumPaymentOpen] = useState(false);
    const shouldShowUpgrade = useMemo(() => new URLSearchParams(location.search).get('upgrade') === 'premium', [location.search]);

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">{content.title}</h1>
                    <p className="page__lead">{content.lead}</p>
                </header>

                {shouldShowUpgrade ? (
                    <section className="premium-banner mb-24">
                        <div>
                            <span className="chip chip--premium"><Crown size={14} /> Premium Upgrade</span>
                            <h2 className="section-title title-sm mt-12">Complete Premium Access Payment</h2>
                            <p className="section-subtitle">You are logged in. Continue to payment to unlock premium tenders.</p>
                        </div>
                        <button type="button" className="btn btn-success" onClick={() => setPremiumPaymentOpen(true)}>
                            <Crown size={16} /> Continue Payment
                        </button>
                    </section>
                ) : null}

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <article key={plan.name} className="card pricing-card pricing-card--featured">
                            <div className="card-body">
                                <div className="pricing-card__head pricing-card__head--featured">
                                    {plan.featured ? <span className="chip chip--premium">Most Popular</span> : null}
                                    <h2 className="section-title mt-10">{plan.name}</h2>
                                    <p className="section-subtitle">{plan.description || 'Enterprise-ready procurement support.'}</p>
                                </div>
                                <div className="pricing-card__price-box">
                                    <p className="plan-price">
                                        {plan.price}
                                        <span className="plan-price__freq">{plan.frequency || ''}</span>
                                    </p>
                                </div>
                                <ul className="list-clean list-check mt-14">
                                    {(plan.points || []).map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>
                                <div className="notice mt-10">
                                    <strong>Sample Includes</strong>
                                    <ul className="list-clean mt-10">
                                        {(plan.sampleDeliverables || []).map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                    <p className="section-subtitle mt-10">Timeline: {plan.sampleTimeline || 'As per scope'}</p>
                                </div>
                                <div className="cta-row">
                                    <button type="button" onClick={() => setActivePlan(plan)} className="btn btn-primary pricing-card__select-btn">
                                        Select Plan
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="hero-panel mt-30">
                    <h2 className="section-title">Need a Custom Commercial Model?</h2>
                    <p className="section-subtitle">For high-volume teams, we support retainer and SLA-backed pricing structures.</p>
                    <div className="cta-row">
                        <Link to="/contact" className="btn btn-primary">Book Pricing Discussion</Link>
                    </div>
                </div>
            </div>
            <PlanPurchaseModal open={Boolean(activePlan)} plan={activePlan} onClose={() => setActivePlan(null)} />
            <PremiumAccessModal open={premiumPaymentOpen} onClose={() => setPremiumPaymentOpen(false)} />
        </div>
    );
};

export default Pricing;

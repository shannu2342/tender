import { SearchCheck, FileCheck2, Send, BarChart3 } from 'lucide-react';
import { useManagedPage } from '../hooks/useManagedPage';
import { pageTemplates } from '../config/pageTemplates';

const icons = [SearchCheck, FileCheck2, Send, BarChart3];

const HowItWorks = () => {
    const content = useManagedPage('how_it_works', pageTemplates.how_it_works);

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">{content.title}</h1>
                    <p className="page__lead">{content.lead}</p>
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    {(content.items || []).map((step, index) => {
                        const Icon = icons[index % icons.length];
                        return (
                            <article className="card" key={step.title}>
                                <div className="card-body">
                                    <span className="chip">Step {index + 1}</span>
                                    <h2 className="section-title mt-12">{step.title}</h2>
                                    <p className="section-subtitle">{step.text}</p>
                                    <div className="chip-row mt-12">
                                        <span className="chip chip--sky"><Icon size={14} /> Structured Delivery</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;

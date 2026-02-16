import { Link } from 'react-router-dom';
import { testimonials as fallbackTestimonials } from '../data/siteContent';
import { useManagedPage } from '../hooks/useManagedPage';
import { pageTemplates } from '../config/pageTemplates';

const Testimonials = () => {
    const content = useManagedPage('testimonials', pageTemplates.testimonials);
    const testimonials = content.items || fallbackTestimonials;

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">{content.title}</h1>
                    <p className="page__lead">{content.lead}</p>
                </header>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((item) => (
                        <article className="card" key={item.name}>
                            <div className="card-body">
                                <p className="section-subtitle">"{item.text}"</p>
                                <div className="notice mt-14">
                                    <strong>{item.name}</strong>
                                    <p>{item.role}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="hero-panel mt-30">
                    <h2 className="section-title">Let’s Build Your Procurement Engine</h2>
                    <p className="section-subtitle">Discuss your process gaps and we will recommend an execution model tailored to your team.</p>
                    <div className="cta-row">
                        <Link to="/contact" className="btn btn-primary">Speak With Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;

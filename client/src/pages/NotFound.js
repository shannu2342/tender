import { Link } from 'react-router-dom';
import { useManagedPage } from '../hooks/useManagedPage';

const NotFound = () => {
    const managed = useManagedPage('not_found', {
        title: 'Page Not Found',
        lead: 'The page you requested is unavailable or may have moved. Use the actions below to continue.'
    });

    return (
        <div className="page">
            <div className="container page__narrow">
                <section className="hero-panel text-center">
                    <span className="kicker">404</span>
                    <h1 className="page__title mt-12">{managed.title}</h1>
                    <p className="page__lead mx-auto">{managed.lead}</p>
                    <div className="cta-row cta-row--center">
                        <Link to="/" className="btn btn-primary">Go to Homepage</Link>
                        <Link to="/contact" className="btn btn-secondary">Contact Support</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default NotFound;


import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';

const PublicRoute = ({ element, isAdminRoute = false }) => {
    const { admin, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (isAdminRoute) return;

        const targets = Array.from(
            document.querySelectorAll(
                'main .hero-panel, main .card, main .table-like__row, main .legal-card, main .premium-banner'
            )
        );
        if (!targets.length) return;

        targets.forEach((node, index) => {
            node.classList.add('reveal');
            node.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach((node) => observer.observe(node));
        const fallbackTimer = window.setTimeout(() => {
            targets.forEach((node) => node.classList.add('reveal-in'));
        }, 900);

        return () => {
            observer.disconnect();
            window.clearTimeout(fallbackTimer);
        };
    }, [isAdminRoute, location.pathname]);

    if (loading) {
        return (
            <div className="loading">
                <div className="btn-loading">
                    <span className="spinner" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (isAdminRoute && admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (isAdminRoute) {
        return element;
    }

    return (
        <div className="main-shell">
            <Header />
            <main>{element}</main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
};

export default PublicRoute;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import WhyChooseUs from './pages/WhyChooseUs';
import HowItWorks from './pages/HowItWorks';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Tenders from './pages/Tenders';
import TenderDetail from './pages/TenderDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import Disclaimer from './pages/Disclaimer';
import TenderDisclaimer from './pages/TenderDisclaimer';
import ServiceAgreement from './pages/ServiceAgreement';
import Compliance from './pages/Compliance';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPages from './pages/admin/AdminPages';
import AdminServices from './pages/admin/AdminServices';
import AdminTenders from './pages/admin/AdminTenders';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
    return (
        <AuthProvider>
            <CustomerAuthProvider>
                <Router>
                    <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute element={<Home />} />} />
                    <Route path="/about" element={<PublicRoute element={<About />} />} />
                    <Route path="/why-choose-us" element={<PublicRoute element={<WhyChooseUs />} />} />
                    <Route path="/how-it-works" element={<PublicRoute element={<HowItWorks />} />} />
                    <Route path="/services" element={<PublicRoute element={<Services />} />} />
                    <Route path="/services/:slug" element={<PublicRoute element={<ServiceDetail />} />} />
                    <Route path="/pricing" element={<PublicRoute element={<Pricing />} />} />
                    <Route path="/testimonials" element={<PublicRoute element={<Testimonials />} />} />
                    <Route path="/faq" element={<PublicRoute element={<FAQ />} />} />
                    <Route path="/contact" element={<PublicRoute element={<Contact />} />} />
                    <Route path="/blog" element={<PublicRoute element={<Blog />} />} />
                    <Route path="/blog/:slug" element={<PublicRoute element={<BlogDetail />} />} />
                    <Route path="/tenders" element={<PublicRoute element={<Tenders />} />} />
                    <Route path="/tenders/:id" element={<PublicRoute element={<TenderDetail />} />} />

                    {/* Legal Pages */}
                    <Route path="/privacy-policy" element={<PublicRoute element={<PrivacyPolicy />} />} />
                    <Route path="/terms-conditions" element={<PublicRoute element={<TermsConditions />} />} />
                    <Route path="/refund-policy" element={<PublicRoute element={<RefundPolicy />} />} />
                    <Route path="/cancellation-policy" element={<PublicRoute element={<CancellationPolicy />} />} />
                    <Route path="/disclaimer" element={<PublicRoute element={<Disclaimer />} />} />
                    <Route path="/tender-disclaimer" element={<PublicRoute element={<TenderDisclaimer />} />} />
                    <Route path="/service-agreement" element={<PublicRoute element={<ServiceAgreement />} />} />
                    <Route path="/compliance" element={<PublicRoute element={<Compliance />} />} />
                    <Route path="/sitemap" element={<PublicRoute element={<Sitemap />} />} />

                    {/* Admin Login */}
                    <Route path="/admin/login" element={<PublicRoute element={<AdminLogin />} isAdminRoute={true} />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                    <Route path="/admin/pages" element={<ProtectedRoute element={<AdminPages />} />} />
                    <Route path="/admin/services" element={<ProtectedRoute element={<AdminServices />} />} />
                    <Route path="/admin/tenders" element={<ProtectedRoute element={<AdminTenders />} />} />
                    <Route path="/admin/blogs" element={<ProtectedRoute element={<AdminBlogs />} />} />
                    <Route path="/admin/enquiries" element={<ProtectedRoute element={<AdminEnquiries />} />} />
                    <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} />} />
                    <Route path="/admin/settings" element={<ProtectedRoute element={<AdminSettings />} />} />

                    {/* Catch-all for 404 */}
                    <Route path="*" element={<PublicRoute element={<NotFound />} />} />
                    </Routes>
                </Router>
            </CustomerAuthProvider>
        </AuthProvider>
    );
}

export default App;

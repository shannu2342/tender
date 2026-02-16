import { useState, useEffect } from 'react';
import api from '../../services/api';
import { clearSiteSettingsCache } from '../../hooks/useSiteSettings';

const fieldStyle = {
    marginBottom: '16px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#334155',
    fontSize: '0.9rem',
    fontWeight: 600
};

const sectionTitle = {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: '18px 0 12px'
};

const defaultSettings = {
    siteName: 'GeM Services India',
    siteTagline: 'Government Procurement Enablement Partner',
    siteDescription: '',
    logoUrl: '',
    logoAlt: '',
    websiteUrl: 'https://gemservicesindia.in',
    whatsappNumber: '',
    phoneNumber: '',
    email: '',
    addressLine: '',
    businessHours: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    footerBlurb: '',
    footerSolutions: '',
    homeHeroImageUrl: '',
    homeHeroImageAlt: '',
    tenderAccessEnabled: true,
    premiumEnabled: true,
    premiumPlanName: 'Premium Tender Access',
    premiumPrice: 2999,
    premiumCurrency: 'INR',
    premiumDurationDays: 30,
    freeVisibleTenders: 5,
    premiumPreviewTenders: 2,
    razorpayKeyId: ''
};

const AdminSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                const incoming = response.data || {};
                setSettings((prev) => ({
                    ...prev,
                    ...incoming,
                    footerSolutions: Array.isArray(incoming.footerSolutions)
                        ? incoming.footerSolutions.join('\n')
                        : incoming.footerSolutions || prev.footerSolutions
                }));
            } catch (error) {
                console.error('Error fetching settings:', error);
                setErrorMessage('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...settings,
                footerSolutions: String(settings.footerSolutions || '')
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean)
            };
            const response = await api.put('/settings', payload);
            clearSiteSettingsCache();
            setSettings((prev) => ({
                ...prev,
                ...(response.data || {}),
                footerSolutions: Array.isArray(response.data?.footerSolutions)
                    ? response.data.footerSolutions.join('\n')
                    : prev.footerSolutions
            }));
            setSuccessMessage('Settings updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating settings:', error);
            setErrorMessage('Failed to update settings');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div className="loading" />
                <p style={{ marginTop: '20px', color: '#718096' }}>Loading settings...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '22px', color: '#0f172a' }}>Website Settings</h1>

            {successMessage ? (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px 20px', borderRadius: '8px', marginBottom: '18px' }}>
                    {successMessage}
                </div>
            ) : null}

            {errorMessage ? (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 20px', borderRadius: '8px', marginBottom: '18px' }}>
                    {errorMessage}
                </div>
            ) : null}

            <form onSubmit={handleSubmit} style={{ maxWidth: '760px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(15,23,42,0.08)' }}>
                <h2 style={sectionTitle}>Branding</h2>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Website Name</label>
                    <input type="text" name="siteName" className="form-control" value={settings.siteName} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Tagline</label>
                    <input type="text" name="siteTagline" className="form-control" value={settings.siteTagline} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Website URL</label>
                    <input type="text" name="websiteUrl" className="form-control" value={settings.websiteUrl} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Website Description</label>
                    <textarea name="siteDescription" className="form-control" rows="3" value={settings.siteDescription} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Logo URL</label>
                    <input type="text" name="logoUrl" className="form-control" value={settings.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Logo Alt Text</label>
                    <input type="text" name="logoAlt" className="form-control" value={settings.logoAlt} onChange={handleChange} placeholder="GeM Services India logo" />
                </div>
                {settings.logoUrl ? (
                    <div style={fieldStyle}>
                        <img
                            src={settings.logoUrl}
                            alt={settings.logoAlt || 'Logo preview'}
                            style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #d1d5db' }}
                        />
                    </div>
                ) : null}

                <h2 style={sectionTitle}>Contact and Social</h2>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" name="phoneNumber" className="form-control" value={settings.phoneNumber} onChange={handleChange} required />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>WhatsApp Number</label>
                    <input type="text" name="whatsappNumber" className="form-control" value={settings.whatsappNumber} onChange={handleChange} required />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" className="form-control" value={settings.email} onChange={handleChange} required />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Address</label>
                    <input type="text" name="addressLine" className="form-control" value={settings.addressLine} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Business Hours</label>
                    <input type="text" name="businessHours" className="form-control" value={settings.businessHours} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Facebook URL</label>
                    <input type="text" name="facebookUrl" className="form-control" value={settings.facebookUrl} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Instagram URL</label>
                    <input type="text" name="instagramUrl" className="form-control" value={settings.instagramUrl} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>LinkedIn URL</label>
                    <input type="text" name="linkedinUrl" className="form-control" value={settings.linkedinUrl} onChange={handleChange} />
                </div>

                <h2 style={sectionTitle}>Footer Content</h2>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Footer Description</label>
                    <textarea name="footerBlurb" className="form-control" rows="3" value={settings.footerBlurb} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Core Solutions (one per line)</label>
                    <textarea name="footerSolutions" className="form-control" rows="6" value={settings.footerSolutions} onChange={handleChange} />
                </div>

                <h2 style={sectionTitle}>Home Hero</h2>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Hero Image URL</label>
                    <input type="text" name="homeHeroImageUrl" className="form-control" value={settings.homeHeroImageUrl} onChange={handleChange} placeholder="https://example.com/hero-image.jpg" />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Hero Image Alt Text</label>
                    <input type="text" name="homeHeroImageAlt" className="form-control" value={settings.homeHeroImageAlt} onChange={handleChange} placeholder="Enterprise procurement support team" />
                </div>
                {settings.homeHeroImageUrl ? (
                    <div style={fieldStyle}>
                        <img
                            src={settings.homeHeroImageUrl}
                            alt={settings.homeHeroImageAlt || 'Hero preview'}
                            style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                ) : null}

                <h2 style={sectionTitle}>Premium Tender Access</h2>
                <div style={fieldStyle}>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" name="tenderAccessEnabled" checked={settings.tenderAccessEnabled} onChange={handleChange} />
                        Enable paid tender access
                    </label>
                </div>
                <div style={fieldStyle}>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" name="premiumEnabled" checked={settings.premiumEnabled} onChange={handleChange} />
                        Enable premium purchase flow
                    </label>
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Premium Plan Name</label>
                    <input type="text" name="premiumPlanName" className="form-control" value={settings.premiumPlanName} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Premium Price</label>
                    <input type="number" name="premiumPrice" className="form-control" min="0" value={settings.premiumPrice} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Premium Currency</label>
                    <input type="text" name="premiumCurrency" className="form-control" value={settings.premiumCurrency} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Premium Duration (days)</label>
                    <input type="number" name="premiumDurationDays" className="form-control" min="1" value={settings.premiumDurationDays} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Free Tenders Visible (Non-premium)</label>
                    <input type="number" name="freeVisibleTenders" className="form-control" min="0" value={settings.freeVisibleTenders} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Premium Preview Count</label>
                    <input type="number" name="premiumPreviewTenders" className="form-control" min="0" value={settings.premiumPreviewTenders} onChange={handleChange} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Razorpay Key ID</label>
                    <input type="text" name="razorpayKeyId" className="form-control" value={settings.razorpayKeyId} onChange={handleChange} />
                </div>

                <div style={{ textAlign: 'center', marginTop: '26px' }}>
                    <button type="submit" className="btn btn-primary">
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;

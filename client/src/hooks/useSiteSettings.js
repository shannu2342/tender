import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { site } from '../config/site';

let settingsCache = null;
let settingsPromise = null;

export const clearSiteSettingsCache = () => {
    settingsCache = null;
    settingsPromise = null;
};

const loadSettings = async () => {
    if (settingsCache) return settingsCache;
    if (settingsPromise) return settingsPromise;

    settingsPromise = api
        .get('/settings')
        .then((res) => {
            settingsCache = res.data || {};
            return settingsCache;
        })
        .catch(() => {
            settingsCache = {};
            return settingsCache;
        })
        .finally(() => {
            settingsPromise = null;
        });

    return settingsPromise;
};

const normalizePhone = (value) => String(value || '').replace(/[^\d+]/g, '');
const normalizeWhatsApp = (value) => String(value || '').replace(/[^\d]/g, '');
const normalizeDomain = (url, fallback) => {
    if (!url) return fallback;
    try {
        const normalized = String(url).startsWith('http') ? String(url) : `https://${url}`;
        return new URL(normalized).hostname || fallback;
    } catch {
        return fallback;
    }
};
const parseList = (value, fallback = []) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value !== 'string') return fallback;
    const rows = value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    return rows.length ? rows : fallback;
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        let mounted = true;
        loadSettings().then((data) => {
            if (mounted) setSettings(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    return useMemo(() => {
        const phoneRaw = settings?.phoneNumber || site.contact.phoneDisplay;
        const whatsappRaw = settings?.whatsappNumber || site.contact.whatsappNumber;
        const premiumPrice = Number(settings?.premiumPrice ?? 2999);
        const freeVisibleTenders = Number(settings?.freeVisibleTenders ?? 5);
        const premiumPreviewTenders = Number(settings?.premiumPreviewTenders ?? 2);
        const premiumDurationDays = Number(settings?.premiumDurationDays ?? 30);

        return {
            ...site,
            domain: normalizeDomain(settings?.websiteUrl, site.domain),
            name: settings?.siteName || site.name,
            tagline: settings?.siteTagline || site.tagline,
            description: settings?.siteDescription || site.description,
            websiteUrl: settings?.websiteUrl || site.websiteUrl,
            contact: {
                ...site.contact,
                phoneDisplay: phoneRaw,
                phoneTel: normalizePhone(phoneRaw) || site.contact.phoneTel,
                email: settings?.email || site.contact.email,
                whatsappNumber: normalizeWhatsApp(whatsappRaw) || site.contact.whatsappNumber,
                addressLine: settings?.addressLine || site.contact.addressLine,
                hours: settings?.businessHours || site.contact.hours
            },
            social: {
                ...site.social,
                facebook: settings?.facebookUrl || site.social.facebook,
                linkedin: settings?.linkedinUrl || site.social.linkedin,
                instagram: settings?.instagramUrl || site.social.instagram
            },
            branding: {
                ...site.branding,
                logoUrl: settings?.logoUrl || site.branding.logoUrl,
                logoAlt: settings?.logoAlt || site.branding.logoAlt
            },
            footer: {
                ...site.footer,
                blurb: settings?.footerBlurb || site.footer.blurb,
                solutions: parseList(settings?.footerSolutions, site.footer.solutions)
            },
            home: {
                heroImageUrl: settings?.homeHeroImageUrl || site.home?.heroImageUrl || '',
                heroImageAlt: settings?.homeHeroImageAlt || `${settings?.siteName || site.name} hero banner`
            },
            tenderAccessEnabled: settings?.tenderAccessEnabled ?? true,
            premium: {
                enabled: settings?.premiumEnabled ?? settings?.tenderAccessEnabled ?? true,
                planName: settings?.premiumPlanName || 'Premium Tender Access',
                price: Number.isFinite(premiumPrice) && premiumPrice > 0 ? premiumPrice : 2999,
                currency: settings?.premiumCurrency || 'INR',
                durationDays: Number.isFinite(premiumDurationDays) ? premiumDurationDays : 30,
                freeVisibleTenders: Number.isFinite(freeVisibleTenders) ? freeVisibleTenders : 5,
                premiumPreviewTenders: Number.isFinite(premiumPreviewTenders) ? premiumPreviewTenders : 2,
                razorpayKeyId: settings?.razorpayKeyId || ''
            }
        };
    }, [settings]);
};

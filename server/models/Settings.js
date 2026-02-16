const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String },
    siteTagline: { type: String },
    siteDescription: { type: String },
    logoUrl: { type: String },
    logoAlt: { type: String },
    websiteUrl: { type: String },
    phoneNumber: { type: String },
    whatsappNumber: { type: String },
    email: { type: String },
    addressLine: { type: String },
    businessHours: { type: String },
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    linkedinUrl: { type: String },
    footerBlurb: { type: String },
    footerSolutions: [{ type: String }],

    // Contact Information
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        whatsapp: { type: String, required: true },
        address: { type: String },
        pinCode: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String, default: 'India' }
    },

    // Business Information
    business: {
        name: { type: String, required: true },
        tagline: { type: String },
        logo: { type: String },
        favicon: { type: String },
        gstNumber: { type: String },
        panNumber: { type: String }
    },

    // Social Media
    social: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        youtube: { type: String }
    },

    // Website Settings
    website: {
        title: { type: String, required: true },
        metaDescription: { type: String },
        metaKeywords: { type: String },
        googleAnalyticsId: { type: String },
        googleTagManagerId: { type: String },
        favicon: { type: String }
    },

    // Home Page Settings
    home: {
        heroImageUrl: { type: String },
        heroImageAlt: { type: String }
    },

    // Services Settings
    services: {
        enableEnquiry: { type: Boolean, default: true },
        defaultPrice: { type: Number },
        currency: { type: String, default: 'INR' }
    },

    // Tenders Settings
    tenders: {
        enablePaidAccess: { type: Boolean, default: true },
        paidAccessPrice: { type: Number, default: 999 },
        freeTendersCount: { type: Number, default: 5 },
        enableWhatsAppUpdates: { type: Boolean, default: true }
    },

    // SEO Settings
    seo: {
        enableSchemaMarkup: { type: Boolean, default: true },
        enableOpenGraph: { type: Boolean, default: true },
        enableTwitterCards: { type: Boolean, default: false },
        defaultMetaImage: { type: String }
    },

    // Email Settings
    email: {
        fromName: { type: String },
        fromEmail: { type: String },
        replyToEmail: { type: String },
        smtpHost: { type: String },
        smtpPort: { type: Number },
        smtpUser: { type: String },
        smtpPassword: { type: String }
    },

    // SMS Settings
    sms: {
        apiKey: { type: String },
        senderId: { type: String },
        templateId: { type: String }
    },

    // Payment Settings
    payment: {
        razorpayKeyId: { type: String },
        razorpayKeySecret: { type: String },
        stripeKey: { type: String },
        enableUPI: { type: Boolean, default: true },
        enableCard: { type: Boolean, default: true },
        enableNetBanking: { type: Boolean, default: true }
    },

    // Notification Settings
    notifications: {
        emailAdminOnEnquiry: { type: Boolean, default: true },
        emailAdminOnPayment: { type: Boolean, default: true },
        emailUserOnPayment: { type: Boolean, default: true },
        whatsappUserOnPayment: { type: Boolean, default: true }
    },

    // Legal Pages
    legal: {
        privacyPolicy: { type: String },
        termsConditions: { type: String },
        refundPolicy: { type: String },
        cancellationPolicy: { type: String },
        disclaimer: { type: String },
        tenderDisclaimer: { type: String },
        serviceAgreement: { type: String },
        compliance: { type: String },
        sitemap: { type: String }
    },

    // System Settings
    system: {
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String },
        captchaKey: { type: String },
        captchaSecret: { type: String },
        apiRateLimit: { type: Number, default: 100 }
    }
}, {
    timestamps: true
});

// Create a singleton instance of settings
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

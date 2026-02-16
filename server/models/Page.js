const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    pageType: {
        type: String,
        required: true,
        unique: true,
        enum: [
            'home',
            'about',
            'why-choose-us',
            'how-it-works',
            'pricing',
            'testimonials',
            'faq',
            'contact',
            'blog',
            'privacy-policy',
            'terms-conditions',
            'refund-policy',
            'cancellation-policy',
            'disclaimer',
            'tender-disclaimer',
            'service-agreement',
            'compliance',
            'sitemap'
        ]
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sections: [
        {
            sectionId: { type: String, required: true },
            title: { type: String },
            content: { type: String },
            isEnabled: { type: Boolean, default: true },
            order: { type: Number, default: 0 }
        }
    ],
    seo: {
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: { type: String },
        ogTitle: { type: String },
        ogDescription: { type: String },
        ogImage: { type: String }
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Page', pageSchema);
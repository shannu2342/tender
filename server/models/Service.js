const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String
    },
    features: [
        {
            type: String
        }
    ],
    benefits: [
        {
            type: String
        }
    ],
    process: [
        {
            step: { type: Number },
            title: { type: String },
            description: { type: String }
        }
    ],
    price: {
        type: Number
    },
    priceDescription: {
        type: String
    },
    category: {
        type: String,
        default: 'general'
    },
    icon: {
        type: String
    },
    image: {
        type: String
    },
    ctaButton: {
        text: { type: String, default: 'Get Started' },
        link: { type: String, default: '#' }
    },
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
    },
    order: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    enquiryCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
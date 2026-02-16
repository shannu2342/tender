const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    governmentType: {
        type: String,
        required: true,
        enum: ['central', 'state']
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    tenderNumber: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    eligibilityCriteria: {
        type: String
    },
    documentsRequired: [
        {
            type: String
        }
    ],
    startDate: {
        type: Date
    },
    lastDate: {
        type: Date,
        required: true
    },
    openingDate: {
        type: Date
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'closed', 'cancelled']
    },
    category: {
        type: String,
        default: 'general'
    },
    estimatedValue: {
        type: Number
    },
    currency: {
        type: String,
        default: 'INR'
    },
    contact: {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        whatsapp: { type: String }
    },
    location: {
        address: { type: String },
        pinCode: { type: String },
        city: { type: String },
        state: { type: String }
    },
    documents: [
        {
            name: { type: String },
            url: { type: String },
            type: { type: String }
        }
    ],
    tags: [
        {
            type: String
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
    isFeatured: {
        type: Boolean,
        default: false
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    enquiryCount: {
        type: Number,
        default: 0
    },
    isPaidContent: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
tenderSchema.index({ title: 'text', department: 'text', description: 'text' });

module.exports = mongoose.model('Tender', tenderSchema);
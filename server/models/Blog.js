const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Admin'
    },
    category: {
        type: String,
        default: 'general'
    },
    tags: [
        {
            type: String
        }
    ],
    coverImage: {
        type: String
    },
    featuredImage: {
        type: String
    },
    readTime: {
        type: Number,
        default: 5
    },
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
    isPublished: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            name: { type: String },
            email: { type: String },
            content: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

// Create indexes for better search performance
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
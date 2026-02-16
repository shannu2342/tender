const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'premium']
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String },
        country: { type: String, default: 'India' }
    },
    company: {
        name: { type: String },
        type: { type: String },
        gstNumber: { type: String },
        panNumber: { type: String }
    },
    preferences: {
        receiveEmailUpdates: { type: Boolean, default: false },
        receiveWhatsAppUpdates: { type: Boolean, default: false },
        interests: [
            {
                type: String
            }
        ]
    },
    lastLogin: {
        type: Date
    },
    loginCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verificationToken: {
        type: String
    },
    verificationExpires: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1, phone: 1 });
userSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    serviceType: {
        type: String
    },
    tenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tender'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    source: {
        type: String,
        default: 'website'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'contacted', 'quoted', 'converted', 'rejected']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    followUpDate: {
        type: Date
    },
    notes: [
        {
            text: { type: String },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

// Create indexes for better search and reporting
enquirySchema.index({ phone: 1, serviceType: 1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
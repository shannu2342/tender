const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['razorpay', 'stripe', 'paypal', 'upi', 'bank']
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'failed', 'refunded']
    },
    paymentId: {
        type: String,
        unique: true
    },
    transactionId: {
        type: String
    },
    orderId: {
        type: String,
        unique: true
    },
    productType: {
        type: String,
        required: true,
        enum: ['tender-access', 'subscription', 'service']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'productType'
    },
    planType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    receiptUrl: {
        type: String
    },
    failureReason: {
        type: String
    },
    customerDetails: {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, paymentStatus: 1 });
paymentSchema.index({ paymentStatus: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1, paymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
const express = require('express');
const customerAuth = require('../middleware/customerAuthMiddleware');

const router = express.Router();

const getPremiumConfig = (settings = {}) => ({
    enabled: settings.premiumEnabled ?? settings.tenderAccessEnabled ?? true,
    price: Number(settings.premiumPrice ?? 2999),
    durationDays: Number(settings.premiumDurationDays ?? 30),
    planName: settings.premiumPlanName || 'Premium Tender Access',
    currency: settings.premiumCurrency || 'INR',
    razorpayKeyId: settings.razorpayKeyId || 'rzp_test_mock'
});

router.get('/plans', (req, res) => {
    const premium = getPremiumConfig(req.app.locals.mockData.settings);
    return res.json({
        plans: [
            {
                code: 'premium_tender_access',
                ...premium
            }
        ]
    });
});

router.post('/create-order', customerAuth, (req, res) => {
    const premium = getPremiumConfig(req.app.locals.mockData.settings);
    const user = req.customer;

    if (!premium.enabled) {
        return res.status(400).json({ message: 'Premium access is currently unavailable' });
    }

    const activeUntil = user.premiumActiveUntil ? new Date(user.premiumActiveUntil).getTime() : 0;
    if (activeUntil > Date.now()) {
        return res.status(400).json({ message: 'You already have an active premium subscription' });
    }

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const payment = {
        _id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: user._id,
        amount: premium.price,
        currency: premium.currency,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        paymentId: null,
        orderId,
        productType: 'subscription',
        planType: 'monthly',
        startDate: null,
        endDate: null,
        customerDetails: {
            name: user.name,
            email: user.email,
            phone: user.mobile
        },
        metadata: {
            planCode: 'premium_tender_access',
            planName: premium.planName
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    req.app.locals.mockData.payments.push(payment);

    return res.json({
        orderId,
        amount: premium.price,
        currency: premium.currency,
        keyId: premium.razorpayKeyId,
        planName: premium.planName,
        durationDays: premium.durationDays
    });
});

router.post('/verify', customerAuth, (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    const user = req.customer;
    const payments = req.app.locals.mockData.payments;
    const payment = payments.find((item) => item.orderId === orderId && item.userId === user._id);

    if (!payment) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const premium = getPremiumConfig(req.app.locals.mockData.settings);
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + premium.durationDays * 24 * 60 * 60 * 1000);

    payment.paymentStatus = 'completed';
    payment.paymentId = paymentId || `mock_pay_${Date.now()}`;
    payment.transactionId = signature || 'mock_signature';
    payment.startDate = startDate;
    payment.endDate = endDate;
    payment.updatedAt = new Date();

    user.role = 'premium';
    user.isPremium = true;
    user.premiumActiveUntil = endDate;
    user.updatedAt = new Date();

    return res.json({
        message: 'Payment verified and premium activated',
        payment,
        user
    });
});

router.get('/my', customerAuth, (req, res) => {
    const records = req.app.locals.mockData.payments
        .filter((item) => item.userId === req.customer._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(records);
});

module.exports = router;

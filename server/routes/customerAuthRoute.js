const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const customerAuth = require('../middleware/customerAuthMiddleware');

const router = express.Router();

const normalizeMobile = (value = '') => String(value).replace(/[^\d]/g, '').slice(-10);
const normalizeText = (value = '') => String(value || '').trim();
const normalizeName = (value = '') => normalizeText(value).replace(/\s+/g, ' ');
const normalizeEmail = (value = '') => normalizeText(value).toLowerCase();
const normalizeOtp = (value = '') => String(value || '').replace(/[^\d]/g, '').slice(0, 6);

const sanitizeUser = (user) => {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

const issueCustomerToken = (user) => jwt.sign(
    { id: user._id, mobile: user.mobile, tokenType: 'customer' },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '30d' }
);

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const createOtpRequest = (store, payload) => {
    const requestId = `otp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    store[requestId] = {
        ...payload,
        otp: generateOtp(),
        expiresAt: Date.now() + 5 * 60 * 1000
    };
    return {
        requestId,
        otp: store[requestId].otp
    };
};

const getOtpResponse = (requestId, otp) => {
    const response = {
        requestId,
        message: 'OTP sent successfully',
        expiresInSeconds: 300
    };
    if (process.env.NODE_ENV !== 'production') {
        response.devOtp = otp;
    }
    return response;
};

const getAndValidateOtpRequest = (req, { requestId, mobile, flow }) => {
    const otpRequest = req.app.locals.mockData.otpRequests[requestId];
    if (!otpRequest) {
        return { error: 'OTP request expired. Please request a new OTP.' };
    }

    if (Date.now() > otpRequest.expiresAt) {
        delete req.app.locals.mockData.otpRequests[requestId];
        return { error: 'OTP has expired. Please request a new OTP.' };
    }

    if (otpRequest.mobile !== mobile) {
        return { error: 'Mobile number mismatch' };
    }

    if (otpRequest.flow !== flow) {
        return { error: 'Invalid OTP flow. Please request a new OTP.' };
    }

    return { otpRequest };
};

router.post('/request-otp', (req, res) => {
    const { mobile } = req.body;
    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedMobile || normalizedMobile.length !== 10) {
        return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
    }

    const { requestId, otp } = createOtpRequest(req.app.locals.mockData.otpRequests, {
        mobile: normalizedMobile,
        flow: 'otp-login'
    });
    return res.json(getOtpResponse(requestId, otp));
});

router.post('/verify-otp', async (req, res) => {
    const { requestId, otp, mobile, name = '' } = req.body;
    const normalizedMobile = normalizeMobile(mobile);
    const normalizedOtp = normalizeOtp(otp);
    const users = req.app.locals.mockData.users;

    const { otpRequest, error } = getAndValidateOtpRequest(req, {
        requestId,
        mobile: normalizedMobile,
        flow: 'otp-login'
    });
    if (error) {
        return res.status(400).json({ message: error });
    }

    if (String(otpRequest.otp) !== normalizedOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete req.app.locals.mockData.otpRequests[requestId];
    let user = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);

    if (!user) {
        const defaultPassword = await bcrypt.hash(`Gem@${normalizedMobile.slice(-4)}`, 10);
        user = {
            _id: Date.now().toString(),
            name: normalizeName(name) || `User ${normalizedMobile.slice(-4)}`,
            email: '',
            mobile: normalizedMobile,
            passwordHash: defaultPassword,
            role: 'user',
            isPremium: false,
            premiumActiveUntil: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        users.push(user);
    }

    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    const token = issueCustomerToken(user);

    return res.json({
        token,
        user: sanitizeUser(user)
    });
});

router.post('/login', async (req, res) => {
    try {
        const normalizedMobile = normalizeMobile(req.body.mobile);
        const password = normalizeText(req.body.password);

        if (normalizedMobile.length !== 10) {
            return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const users = req.app.locals.mockData.users;
        const user = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);

        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: 'Invalid mobile number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid mobile number or password' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: 'Your account is currently disabled' });
        }

        user.lastLoginAt = new Date();
        user.updatedAt = new Date();

        const token = issueCustomerToken(user);
        return res.json({ token, user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to login right now' });
    }
});

router.post('/signup/request-otp', (req, res) => {
    const name = normalizeName(req.body.name);
    const normalizedMobile = normalizeMobile(req.body.mobile);
    const password = normalizeText(req.body.password);

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (normalizedMobile.length !== 10) {
        return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const users = req.app.locals.mockData.users;
    const existing = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);
    if (existing) {
        return res.status(409).json({ message: 'Mobile number already registered. Please login.' });
    }

    const { requestId, otp } = createOtpRequest(req.app.locals.mockData.otpRequests, {
        flow: 'signup',
        mobile: normalizedMobile,
        name
    });
    return res.json(getOtpResponse(requestId, otp));
});

router.post('/signup/verify-otp', async (req, res) => {
    try {
        const requestId = normalizeText(req.body.requestId);
        const otp = normalizeOtp(req.body.otp);
        const name = normalizeName(req.body.name);
        const normalizedMobile = normalizeMobile(req.body.mobile);
        const password = normalizeText(req.body.password);

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (normalizedMobile.length !== 10) {
            return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const { otpRequest, error } = getAndValidateOtpRequest(req, {
            requestId,
            mobile: normalizedMobile,
            flow: 'signup'
        });
        if (error) {
            return res.status(400).json({ message: error });
        }
        if (String(otpRequest.otp) !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        delete req.app.locals.mockData.otpRequests[requestId];

        const users = req.app.locals.mockData.users;
        const existing = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);
        if (existing) {
            return res.status(409).json({ message: 'Mobile number already registered. Please login.' });
        }

        const user = {
            _id: Date.now().toString(),
            name,
            email: normalizeEmail(req.body.email || ''),
            mobile: normalizedMobile,
            passwordHash: await bcrypt.hash(password, 10),
            role: 'user',
            isPremium: false,
            premiumActiveUntil: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date()
        };

        users.push(user);
        const token = issueCustomerToken(user);

        return res.json({ token, user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to complete signup right now' });
    }
});

router.post('/forgot/request-otp', (req, res) => {
    const normalizedMobile = normalizeMobile(req.body.mobile);
    if (normalizedMobile.length !== 10) {
        return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
    }

    const users = req.app.locals.mockData.users;
    const existing = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);
    if (!existing) {
        return res.status(404).json({ message: 'No account found for this mobile number' });
    }

    const { requestId, otp } = createOtpRequest(req.app.locals.mockData.otpRequests, {
        flow: 'forgot-password',
        mobile: normalizedMobile
    });
    return res.json(getOtpResponse(requestId, otp));
});

router.post('/forgot/verify-otp', async (req, res) => {
    try {
        const requestId = normalizeText(req.body.requestId);
        const otp = normalizeOtp(req.body.otp);
        const normalizedMobile = normalizeMobile(req.body.mobile);
        const newPassword = normalizeText(req.body.newPassword);

        if (normalizedMobile.length !== 10) {
            return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const { otpRequest, error } = getAndValidateOtpRequest(req, {
            requestId,
            mobile: normalizedMobile,
            flow: 'forgot-password'
        });
        if (error) {
            return res.status(400).json({ message: error });
        }
        if (String(otpRequest.otp) !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        delete req.app.locals.mockData.otpRequests[requestId];

        const users = req.app.locals.mockData.users;
        const user = users.find((item) => normalizeMobile(item.mobile) === normalizedMobile);
        if (!user) {
            return res.status(404).json({ message: 'No account found for this mobile number' });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.updatedAt = new Date();
        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to reset password right now' });
    }
});

router.post('/signup', async (req, res) => {
    return res.status(410).json({ message: 'Use signup OTP verification flow.' });
});

router.get('/me', customerAuth, (req, res) => {
    return res.json(sanitizeUser(req.customer));
});

router.post('/logout', customerAuth, (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});

module.exports = router;

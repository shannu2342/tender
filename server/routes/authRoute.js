const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admins = req.app.locals.mockData.admins;
        const admin = admins.find(a => a.email === email);

        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // For testing purposes, compare plain text passwords
        const isMatch = admin.password === password;

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1d' }
        );

        res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
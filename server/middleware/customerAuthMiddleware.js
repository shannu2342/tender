const jwt = require('jsonwebtoken');

const customerAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        if (decoded.tokenType !== 'customer') {
            return res.status(401).json({ message: 'Invalid customer token' });
        }

        const users = req.app.locals.mockData.users || [];
        const user = users.find((item) => item._id === decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.customer = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = customerAuth;

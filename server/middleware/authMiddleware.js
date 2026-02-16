const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        const admin = await Admin.findById(decoded.id).select('-password')

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            })
        }

        req.admin = admin
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}

module.exports = { authenticateToken }
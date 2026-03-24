const jwt = require('jsonwebtoken');

function verifyAdminToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Admin access only'
            });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

module.exports = verifyAdminToken;

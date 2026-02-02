const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

/*
====================================================
MIDDLEWARES
====================================================
*/

// Verify Super Admin JWT
function verifySuperAdminToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SUPER_ADMIN_JWT_SECRET);

        if (decoded.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Forbidden: Not super admin' });
        }

        req.superAdmin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

/*
====================================================
SUPER ADMIN LOGIN
====================================================
*/

router.post('/api/super-admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (
        email !== process.env.SUPER_ADMIN_EMAIL ||
        password !== process.env.SUPER_ADMIN_PASSWORD
    ) {
        return res.status(401).json({ success: false, message: 'Invalid super admin credentials' });
    }

    const token = jwt.sign(
        { role: 'superadmin', email },
        process.env.SUPER_ADMIN_JWT_SECRET,
        { expiresIn: '6h' }
    );

    res.status(200).json({
        success: true,
        message: 'Super admin login successful',
        token
    });
});

/*
====================================================
CREATE ADMIN (SUPER ADMIN ONLY)
====================================================
*/

router.post('/api/super-admin/create-admin', verifySuperAdminToken, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlCheck = `SELECT id FROM login WHERE username = ?`;
        req.app.get('db').query(sqlCheck, [username], async (err, rows) => {
            if (err) {
                console.error('Error checking admin:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (rows.length > 0) {
                return res.status(409).json({ success: false, message: 'Admin already exists' });
            }

            const sqlInsert = `
                INSERT INTO login (username, password, utype)
                VALUES (?, ?, 'admin')
            `;

            req.app.get('db').query(sqlInsert, [username, hashedPassword], (err2) => {
                if (err2) {
                    console.error('Error creating admin:', err2);
                    return res.status(500).json({ success: false, message: 'Error creating admin' });
                }

                res.status(201).json({
                    success: true,
                    message: 'Admin created successfully'
                });
            });
        });
    } catch (err) {
        console.error('Hashing error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/*
====================================================
GET ALL ADMINS (SUPER ADMIN ONLY)
====================================================
*/

router.get('/api/super-admin/admins', verifySuperAdminToken, (req, res) => {
    const sql = `
        SELECT id, username, utype
        FROM login
        WHERE utype = 'admin'
    `;

    req.app.get('db').query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching admins:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.status(200).json({
            success: true,
            admins: results
        });
    });
});

/*
====================================================
DELETE ADMIN (SUPER ADMIN ONLY)
====================================================
*/

router.delete('/api/super-admin/admin/:id', verifySuperAdminToken, (req, res) => {
    const { id } = req.params;

    const sqlDelete = `
        DELETE FROM login
        WHERE id = ? AND utype = 'admin'
    `;

    req.app.get('db').query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error('Error deleting admin:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    });
});

module.exports = router;

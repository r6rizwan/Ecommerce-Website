const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/api/register', async (req, res) => {
    const { name, gender, city, address, pincode, email, password } = req.body;
    const conn = req.app.get('db');

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlInsertRegister = `
            INSERT INTO register (name, gender, city, address, pincode, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        conn.query(sqlInsertRegister, [name, gender, city, address, pincode, email], (err) => {
            if (err) {
                console.error('Error inserting into register:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error registering user'
                });
            }

            const sqlInsertLogin = `
                INSERT INTO login (username, password, utype)
                VALUES (?, ?, 'user')
            `;

            conn.query(sqlInsertLogin, [email, hashedPassword], (err2) => {
                if (err2) {
                    console.error('Error inserting into login:', err2);
                    return res.status(500).json({
                        success: false,
                        message: 'Error registering user'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'User registered successfully'
                });
            });
        });
    } catch (err) {
        console.error('Password hashing error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

router.post('/api/authlogin', (req, res) => {
    const { username, password } = req.body;
    const conn = req.app.get('db');

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    const sqlSelectLogin = `SELECT * FROM login WHERE username = ?`;

    conn.query(sqlSelectLogin, [username], async (err, results) => {
        if (err) {
            console.error('Error querying login:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error during login'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const loginRow = results[0];
        let isPasswordValid = false;

        try {
            if (loginRow.password && loginRow.password.startsWith('$2')) {
                isPasswordValid = await bcrypt.compare(password, loginRow.password);
            } else {
                isPasswordValid = password === loginRow.password;
            }
        } catch (e) {
            console.error('Password check error:', e);
            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const sqlSelectRegister = `SELECT id, name FROM register WHERE email = ?`;
        conn.query(sqlSelectRegister, [username], (errReg, regRows) => {
            if (errReg) {
                console.error('Error querying register:', errReg);
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching user details'
                });
            }

            const registerId = regRows.length > 0 ? regRows[0].id : null;
            const fullName = regRows.length > 0 ? regRows[0].name : loginRow.username;

            let adminToken = null;
            let tokenType = null;
            let expiresIn = null;

            if (loginRow.utype === 'admin') {
                adminToken = jwt.sign(
                    { role: 'admin', adminId: loginRow.id, username: loginRow.username },
                    process.env.ADMIN_JWT_SECRET,
                    { expiresIn: '6h' }
                );
                tokenType = 'Bearer';
                expiresIn = '6h';
            }

            res.status(200).json({
                success: true,
                message: 'Login successful',
                username: fullName,
                utype: loginRow.utype,
                user_id: registerId || loginRow.id,
                login_id: loginRow.id,
                token: adminToken,
                tokenType,
                expiresIn
            });
        });
    });
});

router.post('/api/forgotpassword', (req, res) => {
    const { email } = req.body;
    const conn = req.app.get('db');

    const sqlCheckEmail = `SELECT * FROM login WHERE username = ?`;
    conn.query(sqlCheckEmail, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).send('Error processing request');
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        const sqlStoreOTP = `INSERT INTO otp(email, otp, otp_expiry) VALUES
        (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE
        otp = VALUES(otp), otp_expiry = VALUES(otp_expiry)`;

        conn.query(sqlStoreOTP, [email, otp], (err2) => {
            if (err2) {
                console.error('Error storing OTP:', err2);
                return res.status(500).json({ success: false, message: 'Error sending OTP email' });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: '"Ecommerce Support" <noreply@ecommerce.com>',
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is ${otp}. This OTP will expire in 15 minutes.`,
                html: `<p>Your OTP for password reset is <strong>${otp}</strong>.</p><p>This OTP will expire in 15 minutes.</p>`
            };

            transporter.sendMail(mailOptions, (mailErr, info) => {
                if (mailErr) {
                    console.error('Error sending email:', mailErr);
                    return res.status(500).send('Error sending OTP email');
                }

                res.status(200).json({ success: true, message: 'OTP sent successfully to your email' });
            });
        });
    });
});

router.post('/api/verifyotp', (req, res) => {
    const { email, otp } = req.body;
    const conn = req.app.get('db');

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    const sqlVerifyOTP = `
        SELECT * FROM otp
        WHERE email = ? AND otp = ? AND otp_expiry > NOW()
        ORDER BY id DESC LIMIT 1
    `;

    conn.query(sqlVerifyOTP, [email, otp], (err, results) => {
        if (err) {
            console.error('Error verifying OTP:', err);
            return res.status(500).json({ success: false, message: 'Error verifying OTP' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        conn.query(`DELETE FROM otp WHERE email = ?`, [email], () => {});
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    });
});

router.post('/api/resetpassword', (req, res) => {
    const { email, newPassword } = req.body;
    const conn = req.app.get('db');

    if (!email || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Email and new password are required'
        });
    }

    const sql = `UPDATE login SET password = ? WHERE username = ?`;
    conn.query(sql, [newPassword, email], (err, result) => {
        if (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({
                success: false,
                message: 'Error updating password'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    });
});

module.exports = router;

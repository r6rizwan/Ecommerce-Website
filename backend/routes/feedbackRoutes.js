const express = require('express');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

router.post('/api/feedback', (req, res) => {
    const { pid, user_id, aboutProduct, aboutService, comments, star_rating } = req.body;
    const conn = req.app.get('db');

    if (!pid || !user_id || !aboutProduct || !aboutService || !comments || !star_rating) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (isNaN(star_rating) || star_rating < 1 || star_rating > 5) {
        return res.status(400).json({ message: 'Star rating must be between 1 and 5.' });
    }

    const checkSql = 'SELECT * FROM feedback WHERE pid = ? AND user_id = ?';
    conn.query(checkSql, [pid, user_id], (err, results) => {
        if (err) {
            console.error('Error checking feedback existence:', err);
            return res.status(500).json({ message: 'Database error while checking feedback.' });
        }

        if (results.length > 0) {
            const updateSql = `
                UPDATE feedback
                SET about_product = ?, about_service = ?, comments = ?, star_rating = ?
                WHERE pid = ? AND user_id = ?
            `;
            conn.query(updateSql, [aboutProduct, aboutService, comments, star_rating, pid, user_id], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating feedback:', updateErr);
                    return res.status(500).json({ message: 'Error updating feedback.' });
                }
                return res.status(200).json({ message: 'Feedback updated successfully!' });
            });
            return;
        }

        const insertSql = `
            INSERT INTO feedback (pid, user_id, about_product, about_service, comments, star_rating)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        conn.query(insertSql, [pid, user_id, aboutProduct, aboutService, comments, star_rating], (insertErr) => {
            if (insertErr) {
                console.error('Error inserting feedback:', insertErr);
                return res.status(500).json({ message: 'Error submitting feedback.' });
            }
            return res.status(200).json({ message: 'Feedback submitted successfully!' });
        });
    });
});

router.get('/api/userfeedback/:pid/:user_id', (req, res) => {
    const { pid, user_id } = req.params;
    const conn = req.app.get('db');

    const sql = 'SELECT * FROM feedback WHERE pid = ? AND user_id = ?';
    conn.query(sql, [pid, user_id], (err, results) => {
        if (err) {
            console.error('Error fetching feedback:', err);
            return res.status(500).json({ message: 'Error fetching feedback.' });
        }
        res.json(results[0] || null);
    });
});

router.get('/api/getfeedback', (req, res) => {
    const conn = req.app.get('db');
    conn.query(`SELECT * FROM feedback`, (err, results) => {
        if (err) {
            console.error('Error fetching feedback data:', err);
            return res.status(500).send('Error fetching feedback data');
        }
        res.status(200).json(results);
    });
});

router.delete('/api/deletefeedback/:id', verifyAdminToken, (req, res) => {
    const conn = req.app.get('db');
    conn.query(`DELETE FROM feedback WHERE id = ?`, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting feedback');
        }
        res.status(200).send('Feedback deleted successfully');
    });
});

module.exports = router;

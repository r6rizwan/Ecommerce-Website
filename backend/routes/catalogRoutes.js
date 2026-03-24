const express = require('express');
const multer = require('multer');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/api/addcategory', verifyAdminToken, (req, res) => {
    const { categoryName } = req.body;
    const conn = req.app.get('db');

    conn.query(`INSERT INTO category (category_name) VALUES (?)`, [categoryName], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding category');
        }
        res.status(200).send('Category added successfully');
    });
});

router.post('/api/addproduct', verifyAdminToken, upload.single('image'), (req, res) => {
    const {
        categoryName,
        productName,
        quantity,
        uom,
        price,
        stock,
        description,
        deliveryDaysMin,
        deliveryDaysMax
    } = req.body;
    const image = req.file ? req.file.filename : null;
    const conn = req.app.get('db');
    const minDays = Number.isFinite(Number(deliveryDaysMin)) ? Number(deliveryDaysMin) : 4;
    const maxDays = Number.isFinite(Number(deliveryDaysMax)) ? Number(deliveryDaysMax) : 6;

    const sqlWithEta = `
        INSERT INTO product (category_name, product_name, qty, uom, price, stock, image, description, delivery_days_min, delivery_days_max)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const sqlFallback = `
        INSERT INTO product (category_name, product_name, qty, uom, price, stock, image, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(
        sqlWithEta,
        [categoryName, productName, quantity, uom, price, stock, image, description, minDays, maxDays],
        (err) => {
            if (!err) {
                return res.status(200).send('Product added successfully');
            }

            if (err.code === 'ER_BAD_FIELD_ERROR') {
                return conn.query(
                    sqlFallback,
                    [categoryName, productName, quantity, uom, price, stock, image, description],
                    (fallbackErr) => {
                        if (fallbackErr) {
                            console.error(fallbackErr);
                            return res.status(500).send('Error adding product');
                        }
                        return res.status(200).send('Product added successfully');
                    }
                );
            }

            console.error(err);
            return res.status(500).send('Error adding product');
        }
    );
});

router.get('/api/getcategory', (req, res) => {
    const conn = req.app.get('db');
    conn.query(`SELECT * FROM category`, (err, results) => {
        if (err) {
            console.error('Error fetching category data:', err);
            return res.status(500).send('Error fetching category data');
        }
        res.status(200).json(results);
    });
});

router.get('/api/getproduct', (req, res) => {
    const conn = req.app.get('db');
    conn.query(`SELECT * FROM product`, (err, results) => {
        if (err) {
            console.error('Error fetching product data:', err);
            return res.status(500).send('Error fetching product data');
        }
        res.status(200).json(results);
    });
});

router.delete('/api/deletecategory/:id', verifyAdminToken, (req, res) => {
    const conn = req.app.get('db');
    conn.query(`DELETE FROM category WHERE id = ?`, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting category');
        }
        res.status(200).send('Category deleted successfully');
    });
});

router.delete('/api/deleteproduct/:id', verifyAdminToken, (req, res) => {
    const conn = req.app.get('db');
    conn.query(`DELETE FROM product WHERE id = ?`, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting product');
        }
        res.status(200).send('Product deleted successfully');
    });
});

module.exports = router;

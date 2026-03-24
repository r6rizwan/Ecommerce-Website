const express = require('express');

const router = express.Router();

router.post('/api/addtocart/:pid', (req, res) => {
    const { pid } = req.params;
    const { user_id, qty } = req.body;
    const quantity = qty ? qty : 1;
    const conn = req.app.get('db');

    if (!user_id || !pid) {
        return res.status(400).send('Missing required fields');
    }

    const sqlCheckUser = `SELECT id FROM register WHERE id = ?`;
    conn.query(sqlCheckUser, [user_id], (errUser, userRows) => {
        if (errUser) {
            console.error('Error checking user existence:', errUser);
            return res.status(500).send('Database error while checking user');
        }

        if (userRows.length === 0) {
            return res.status(404).send('User not found');
        }

        const sqlGetProduct = 'SELECT product_name, price FROM product WHERE id = ?';
        conn.query(sqlGetProduct, [pid], (err, result) => {
            if (err) {
                console.error('Error fetching product:', err);
                return res.status(500).send('Database error while fetching product');
            }

            if (result.length === 0) {
                return res.status(404).send('Product not found');
            }

            const { product_name, price } = result[0];
            const total = price * quantity;

            const sqlCheckExisting = `
                SELECT * FROM customerOrders
                WHERE user_id = ? AND pid = ? AND order_status = 'Pending'
            `;

            conn.query(sqlCheckExisting, [user_id, pid], (err2, rows) => {
                if (err2) {
                    console.error('Error checking cart:', err2);
                    return res.status(500).send('Database error while checking cart');
                }

                if (rows.length > 0) {
                    const newQty = rows[0].qty + quantity;
                    const newTotal = newQty * price;
                    const sqlUpdate = `
                        UPDATE customerOrders
                        SET qty = ?, total = ?
                        WHERE user_id = ? AND pid = ? AND order_status = 'Pending'
                    `;
                    conn.query(sqlUpdate, [newQty, newTotal, user_id, pid], (err3) => {
                        if (err3) {
                            console.error('Error updating cart:', err3);
                            return res.status(500).send('Error updating cart item');
                        }
                        res.status(200).send('Cart item updated successfully');
                    });
                    return;
                }

                const sqlInsert = `
                    INSERT INTO customerOrders
                    (user_id, pid, qty, price, total, order_date, order_status, payment_status)
                    VALUES (?, ?, ?, ?, ?, NOW(), 'Pending', 'Unpaid')
                `;
                conn.query(sqlInsert, [user_id, pid, quantity, price, total], (err4) => {
                    if (err4) {
                        console.error('Error adding to cart:', err4);
                        return res.status(500).send('Error adding item to cart');
                    }
                    console.log(`Added ${product_name} (ID ${pid}) to cart`);
                    res.status(200).send('Item added to cart successfully');
                });
            });
        });
    });
});

router.get('/api/getcartitems/:user_id', (req, res) => {
    const { user_id } = req.params;
    const conn = req.app.get('db');

    const sql = `
        SELECT
        co.id,
        co.pid,
        p.product_name,
        p.image,
        co.price,
        co.qty,
        co.total
        FROM customerOrders co
        JOIN product p ON co.pid = p.id
        WHERE co.user_id = ? AND co.order_status = 'Pending'
    `;

    conn.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).send('Error fetching cart items');
        }
        res.json(result);
    });
});

router.put('/api/updatecart/:id', (req, res) => {
    const { id } = req.params;
    const { qty } = req.body;
    const conn = req.app.get('db');

    if (!id || !qty) {
        return res.status(400).send('Missing id or qty');
    }

    const sql = `
        UPDATE customerOrders
        SET qty = ?, total = CAST(price AS DECIMAL(10,2)) * ?
        WHERE id = ? AND order_status = 'Pending'
    `;

    conn.query(sql, [qty, qty, id], (err, result) => {
        if (err) {
            console.error('Error updating quantity:', err);
            return res.status(500).send('Error updating quantity');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('No matching cart item found');
        }

        res.send('Quantity updated successfully');
    });
});

router.delete('/api/deletefromcart/:id', (req, res) => {
    const { id } = req.params;
    const conn = req.app.get('db');

    const sql = `DELETE FROM customerOrders WHERE id = ? AND order_status = 'Pending'`;
    conn.query(sql, [id], (err) => {
        if (err) {
            console.error('Error removing item:', err);
            return res.status(500).send('Error removing item from cart');
        }
        res.send('Item removed successfully');
    });
});

module.exports = router;

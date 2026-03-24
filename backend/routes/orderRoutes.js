const express = require('express');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

router.get('/api/orders', (req, res) => {
    const conn = req.app.get('db');
    const sqlSelectOrders = `SELECT * FROM customerOrders`;

    conn.query(sqlSelectOrders, (err, results) => {
        if (err) {
            console.error('Error fetching orders data:', err);
            return res.status(500).send('Error fetching orders data');
        }
        res.status(200).json({ orders: results });
    });
});

router.get('/api/adminorders', verifyAdminToken, (req, res) => {
    const conn = req.app.get('db');
    const sql = `
        SELECT
            co.order_group_id,
            co.user_id,
            r.name AS customer_name,
            r.email AS customer_email,
            p.product_name,
            p.image,
            co.qty,
            co.price,
            co.total,
            co.order_date,
            co.order_status,
            co.payment_status
        FROM customerOrders co
        JOIN product p ON co.pid = p.id
        JOIN register r ON co.user_id = r.id
        WHERE co.order_status != 'Pending'
        ORDER BY co.order_date DESC
    `;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching admin orders:', err);
            return res.status(500).json({ success: false, message: 'Error fetching admin orders' });
        }

        const groupedOrders = {};
        results.forEach((row) => {
            if (!groupedOrders[row.order_group_id]) {
                groupedOrders[row.order_group_id] = {
                    id: row.order_group_id,
                    user_id: row.user_id,
                    customer_name: row.customer_name,
                    customer_email: row.customer_email,
                    orderDate: row.order_date,
                    status: row.order_status,
                    paymentStatus: row.payment_status,
                    products: [],
                    totalAmount: 0
                };
            }

            groupedOrders[row.order_group_id].products.push({
                product_name: row.product_name,
                image: row.image,
                qty: row.qty,
                price: parseFloat(row.price),
                total: parseFloat(row.total)
            });

            groupedOrders[row.order_group_id].totalAmount += parseFloat(row.total);
        });

        res.status(200).json({ orders: Object.values(groupedOrders) });
    });
});

router.put('/api/update-order-status', verifyAdminToken, (req, res) => {
    const { order_group_id, status } = req.body;
    const conn = req.app.get('db');

    if (!order_group_id || !status) {
        return res.status(400).json({ success: false, message: 'order_group_id and status are required' });
    }

    const allowedStatuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const sql = `
        UPDATE customerOrders
        SET order_status = ?
        WHERE order_group_id = ?
    `;

    conn.query(sql, [status, order_group_id], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ success: false, message: 'Database error while updating order status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order group not found' });
        }

        res.status(200).json({ success: true, message: 'Order status updated successfully' });
    });
});

router.get('/api/userorders/:user_id', (req, res) => {
    const { user_id } = req.params;
    const conn = req.app.get('db');

    const sql = `
        SELECT
            co.order_group_id,
            co.pid,
            p.product_name,
            p.image,
            co.qty,
            co.price,
            co.total,
            co.order_date,
            co.order_status,
            co.payment_status,
            pay.amount AS payment_amount
        FROM customerOrders co
        JOIN product p ON co.pid = p.id
        LEFT JOIN payment pay ON pay.order_id = co.order_group_id
        WHERE co.user_id = ?
          AND co.order_status != 'Pending'
        ORDER BY co.order_date DESC
    `;

    conn.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }

        if (results.length === 0) {
            return res.status(200).json({ orders: [] });
        }

        const groupedOrders = {};

        results.forEach((row) => {
            if (!groupedOrders[row.order_group_id]) {
                groupedOrders[row.order_group_id] = {
                    id: row.order_group_id,
                    orderDate: row.order_date,
                    status: row.order_status,
                    paymentStatus: row.payment_status,
                    products: [],
                    subtotal: 0,
                    gstAmount: 0,
                    deliveryCharges: 0,
                    paymentAmount: row.payment_amount ? parseFloat(row.payment_amount) : 0,
                    totalAmount: 0
                };
            }

            groupedOrders[row.order_group_id].products.push({
                pid: row.pid,
                name: row.product_name,
                image: row.image,
                qty: row.qty,
                price: parseFloat(row.price),
                total: parseFloat(row.total)
            });

            groupedOrders[row.order_group_id].subtotal += parseFloat(row.total);
        });

        Object.values(groupedOrders).forEach((order) => {
            order.gstAmount = parseFloat((order.subtotal * 0.18).toFixed(2));
            order.deliveryCharges = order.subtotal > 0 ? 49 : 0;

            if (order.paymentStatus === 'Paid' && order.paymentAmount > 0) {
                order.totalAmount = parseFloat(order.paymentAmount.toFixed(2));
            } else {
                order.totalAmount = parseFloat((order.subtotal + order.gstAmount + order.deliveryCharges).toFixed(2));
            }
        });

        res.status(200).json({ orders: Object.values(groupedOrders) });
    });
});

router.get('/api/admindashboard', verifyAdminToken, (req, res) => {
    const conn = req.app.get('db');
    const queries = {
        totalSales: `SELECT SUM(total) AS totalSales FROM customerOrders WHERE payment_status = 'Paid'`,
        totalOrders: `SELECT COUNT(DISTINCT id) AS totalOrders FROM customerOrders`,
        totalCustomers: `SELECT COUNT(*) AS totalCustomers FROM register`,
        todayOrders: `SELECT COUNT(DISTINCT id) AS todayOrders FROM customerOrders WHERE DATE(order_date) = CURDATE()`,
        recentOrders: `
            SELECT co.id, r.name AS customer_name, p.product_name, co.order_date
            FROM customerOrders co
            JOIN register r ON co.user_id = r.id
            JOIN product p ON co.pid = p.id
            ORDER BY co.order_date DESC
            LIMIT 5
        `,
        recentReviews: `
            SELECT id, pid, user_id, comments, star_rating
            FROM feedback
            ORDER BY id DESC
            LIMIT 5
        `
    };

    Promise.all(
        Object.values(queries).map(
            (query) =>
                new Promise((resolve, reject) => {
                    conn.query(query, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                })
        )
    )
        .then(([sales, orders, customers, today, recentOrders, reviews]) => {
            res.status(200).json({
                totalSales: sales[0]?.totalSales || 0,
                totalOrders: orders[0]?.totalOrders || 0,
                totalCustomers: customers[0]?.totalCustomers || 0,
                todayOrders: today[0]?.todayOrders || 0,
                recentOrders,
                recentReviews: reviews
            });
        })
        .catch((err) => {
            console.error('Error fetching admin dashboard:', err);
            res.status(500).json({ message: 'Error fetching admin dashboard' });
        });
});

module.exports = router;

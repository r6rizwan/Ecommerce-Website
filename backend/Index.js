const express = require('express');
const app = express();
const port = 3001
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const adminAuthRoutes = require('./adminAuth');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Admin JWT verification middleware
function verifyAdminToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access only"
            });
        }

        req.admin = decoded; // optional use later
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

// access images from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ecommerce',
    user: 'root',
    password: '',
});

conn.connect(function (err) {
    if (err) {
        console.log("DB could not be connected");
    } else {
        console.log("DB connected successfully");
    }
})

app.set('db', conn);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello from Backend');
})

app.use(express.json());
const cors = require('cors');
const { dir } = require('console');
app.use(cors());

app.use(adminAuthRoutes);

// Register new user API (with password hashing)
app.post('/api/register', async (req, res) => {
    const { name, gender, city, address, pincode, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        // Step 1: Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 2: Insert into register table
        const sqlInsertRegister = `
            INSERT INTO register (name, gender, city, address, pincode, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        conn.query(
            sqlInsertRegister,
            [name, gender, city, address, pincode, email],
            (err, result) => {
                if (err) {
                    console.error("Error inserting into register:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Error registering user"
                    });
                }

                // Step 3: Insert into login table with hashed password
                const sqlInsertLogin = `
                    INSERT INTO login (username, password, utype)
                    VALUES (?, ?, 'user')
                `;

                conn.query(
                    sqlInsertLogin,
                    [email, hashedPassword],
                    (err2, result2) => {
                        if (err2) {
                            console.error("Error inserting into login:", err2);
                            return res.status(500).json({
                                success: false,
                                message: "Error registering user"
                            });
                        }

                        console.log("User registered successfully:", email);

                        res.status(200).json({
                            success: true,
                            message: "User registered successfully"
                        });
                    }
                );
            }
        );
    } catch (err) {
        console.error("Password hashing error:", err);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
});

// Add Category API
app.post('/api/addcategory', (req, res) => {
    const { categoryName } = req.body;

    const sqlInsertCategory = `
        INSERT INTO category (category_name)
        VALUES (?)
    `;

    conn.query(sqlInsertCategory, [categoryName], (err, result) => {
        if (err) {
            console.error("Error inserting into category:", err);
            return res.status(500).send("Error adding category");
        }

        console.log("Category added successfully:", categoryName);
        res.status(200).send("Category added successfully");
    });
});

// Feedback API
app.post('/api/feedback', (req, res) => {
    const { pid, user_id, aboutProduct, aboutService, comments, star_rating } = req.body;

    if (!pid || !user_id || !aboutProduct || !aboutService || !comments || !star_rating) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(star_rating) || star_rating < 1 || star_rating > 5) {
        return res.status(400).json({ message: "Star rating must be between 1 and 5." });
    }

    // Check if the feedback already exists
    const checkSql = "SELECT * FROM feedback WHERE pid = ? AND user_id = ?";
    conn.query(checkSql, [pid, user_id], (err, results) => {
        if (err) {
            console.error("❌ Error checking feedback existence:", err);
            return res.status(500).json({ message: "Database error while checking feedback." });
        }

        if (results.length > 0) {
            // Update existing feedback
            const updateSql = `
        UPDATE feedback 
        SET about_product = ?, about_service = ?, comments = ?, star_rating = ?
        WHERE pid = ? AND user_id = ?
      `;
            conn.query(
                updateSql,
                [aboutProduct, aboutService, comments, star_rating, pid, user_id],
                (updateErr) => {
                    if (updateErr) {
                        console.error("❌ Error updating feedback:", updateErr);
                        return res.status(500).json({ message: "Error updating feedback." });
                    }
                    // console.log("Feedback updated successfully:", { pid, user_id });
                    return res.status(200).json({ message: "Feedback updated successfully!" });
                }
            );
        } else {
            // Insert new feedback
            const insertSql = `
        INSERT INTO feedback (pid, user_id, about_product, about_service, comments, star_rating)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
            conn.query(
                insertSql,
                [pid, user_id, aboutProduct, aboutService, comments, star_rating],
                (insertErr) => {
                    if (insertErr) {
                        console.error("❌ Error inserting feedback:", insertErr);
                        return res.status(500).json({ message: "Error submitting feedback." });
                    }
                    console.log("Feedback submitted successfully:", { pid, user_id });
                    return res.status(200).json({ message: "Feedback submitted successfully!" });
                }
            );
        }
    });
});

//upload product image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Add product with image upload
app.post('/api/addproduct', upload.single('image'), (req, res) => {
    const { categoryName, productName, quantity, uom, price, stock, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const sqlInsertProduct = `
        INSERT INTO product (category_name, product_name, qty, uom, price, stock, image, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(sqlInsertProduct, [categoryName, productName, quantity, uom, price, stock, image, description], (err, result) => {
        if (err) {
            console.error("Error inserting into product:", err);
            return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully:", productName);
        res.status(200).send("Product added successfully");
    });
});

// User data API
app.get('/api/getregister', (req, res) => {
    const sqlSelectRegister = `SELECT * FROM register`;
    conn.query(sqlSelectRegister, (err, results) => {
        if (err) {
            console.error("Error fetching registration data:", err);
            return res.status(500).send("Error fetching registration data");
        }

        res.status(200).json(results);
    });
});

app.get('/api/getcategory', (req, res) => {
    const sqlSelectCategory = `SELECT * FROM category`;
    conn.query(sqlSelectCategory, (err, results) => {
        if (err) {
            console.error("Error fetching category data:", err);
            return res.status(500).send("Error fetching category data");
        }

        res.status(200).json(results);
    });
});

app.get('/api/getproduct', (req, res) => {
    const sqlSelectProduct = `SELECT * FROM product`;
    conn.query(sqlSelectProduct, (err, results) => {
        if (err) {
            console.error("Error fetching product data:", err);
            return res.status(500).send("Error fetching product data");
        }

        res.status(200).json(results);
    });
});

// User Feedbacks
app.get('/api/userfeedback/:pid/:user_id', (req, res) => {
    const { pid, user_id } = req.params;

    const sql = "SELECT * FROM feedback WHERE pid = ? AND user_id = ?";
    conn.query(sql, [pid, user_id], (err, results) => {
        if (err) {
            console.error("Error fetching feedback:", err);
            return res.status(500).json({ message: "Error fetching feedback." });
        }
        res.json(results[0] || null);
    });
});

// Admin Feedbacks
app.get('/api/getfeedback', (req, res) => {
    const sqlSelectFeedback = `SELECT * FROM feedback`;
    conn.query(sqlSelectFeedback, (err, results) => {
        if (err) {
            console.error("Error fetching feedback data:", err);
            return res.status(500).send("Error fetching feedback data");
        }

        res.status(200).json(results);
    });
});

app.delete('/api/deleteregister/:id', (req, res) => {
    const userId = req.params.id;
    const sqlDeleteRegister = `DELETE FROM register WHERE id = ?`;
    conn.query(sqlDeleteRegister, [userId], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Error deleting user");
        }

        console.log("User deleted successfully, ID:", userId);
        res.status(200).send("User deleted successfully");
    });
});

app.delete('/api/deletecategory/:id', (req, res) => {
    const categoryId = req.params.id;
    const sqlDeleteCategory = `DELETE FROM category WHERE id = ?`;
    conn.query(sqlDeleteCategory, [categoryId], (err, result) => {
        if (err) {
            console.error("Error deleting category:", err);
            return res.status(500).send("Error deleting category");
        }

        console.log("Category deleted successfully, ID:", categoryId);
        res.status(200).send("Category deleted successfully");
    });
});

app.delete('/api/deleteproduct/:id', (req, res) => {
    const productId = req.params.id;
    const sqlDeleteProduct = `DELETE FROM product WHERE id = ?`;
    conn.query(sqlDeleteProduct, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product");
        }

        console.log("Product deleted successfully, ID:", productId);
        res.status(200).send("Product deleted successfully");
    });
});

app.delete('/api/deletefeedback/:id', (req, res) => {
    const feedbackId = req.params.id;
    const sqlDeleteFeedback = `DELETE FROM feedback WHERE id = ?`;
    conn.query(sqlDeleteFeedback, [feedbackId], (err, result) => {
        if (err) {
            console.error("Error deleting feedback:", err);
            return res.status(500).send("Error deleting feedback");
        }

        console.log("Feedback deleted successfully, ID:", feedbackId);
        res.status(200).send("Feedback deleted successfully");
    });
});

// Auth Login API (Supports both plain & hashed passwords)
app.post('/api/authlogin', (req, res) => {
    const { username, password } = req.body;

    // Step 1: Validate input
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    // Step 2: Fetch user by username ONLY
    const sqlSelectLogin = `SELECT * FROM login WHERE username = ?`;

    conn.query(sqlSelectLogin, [username], async (err, results) => {
        if (err) {
            console.error("Error querying login:", err);
            return res.status(500).json({
                success: false,
                message: "Database error during login"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const loginRow = results[0];
        let isPasswordValid = false;

        // Step 3: Check password
        try {
            if (loginRow.password.startsWith('$2')) {
                // bcrypt-hashed password (ADMIN / future users)
                isPasswordValid = await bcrypt.compare(password, loginRow.password);
            } else {
                // plain-text password (existing USERS)
                isPasswordValid = password === loginRow.password;
            }
        } catch (err) {
            console.error("Password check error:", err);
            return res.status(500).json({
                success: false,
                message: "Authentication error"
            });
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Step 4: Fetch register record (only for users)
        const sqlSelectRegister = `SELECT id, name FROM register WHERE email = ?`;
        conn.query(sqlSelectRegister, [username], (errReg, regRows) => {
            if (errReg) {
                console.error("Error querying register:", errReg);
                return res.status(500).json({
                    success: false,
                    message: "Error fetching user details"
                });
            }

            const registerId = regRows.length > 0 ? regRows[0].id : null;
            const fullName = regRows.length > 0
                ? regRows[0].name
                : loginRow.username;

            console.log(
                `Login successful: ${username} (utype: ${loginRow.utype})`
            );

            // Step 5: Success response
            res.status(200).json({
                success: true,
                message: "Login successful",
                username: fullName,
                utype: loginRow.utype,
                user_id: registerId || loginRow.id,
                login_id: loginRow.id
            });
        });
    });
});

// GET ALL ORDERS API
app.get('/api/orders', (req, res) => {
    const sqlSelectOrders = `SELECT * FROM customerOrders`;
    conn.query(sqlSelectOrders, (err, results) => {
        if (err) {
            console.error("Error fetching orders data:", err);
            return res.status(500).send("Error fetching orders data");
        }

        res.status(200).json({ orders: results });
    });
});

// ADMIN ORDERS — GROUPED BY PAYMENT (order_group_id)
app.get('/api/adminorders', (req, res) => {
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
        ORDER BY
            co.order_date DESC
    `;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching admin orders:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching admin orders"
            });
        }

        if (results.length === 0) {
            return res.status(200).json({ orders: [] });
        }

        // GROUP BY order_group_id
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
                    totalAmount: 0,
                };
            }

            groupedOrders[row.order_group_id].products.push({
                product_name: row.product_name,
                image: row.image,
                qty: row.qty,
                price: parseFloat(row.price),
                total: parseFloat(row.total),
            });

            groupedOrders[row.order_group_id].totalAmount += parseFloat(row.total);
        });

        res.status(200).json({
            orders: Object.values(groupedOrders)
        });
    });
});

// UPDATE ORDER STATUS (GROUP LEVEL)
app.put("/api/update-order-status", (req, res) => {
    const { order_group_id, status } = req.body;
    console.log('Received update for order_group_id:', order_group_id, 'to status:', status);

    // Validation
    if (!order_group_id || !status) {
        return res.status(400).json({
            success: false,
            message: "order_group_id and status are required",
        });
    }

    const allowedStatuses = ["Confirmed", "Shipped", "Delivered"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status",
        });
    }

    const sql = `
        UPDATE customerOrders
        SET order_status = ?
        WHERE order_group_id = ?
    `;

    conn.query(sql, [status, order_group_id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            return res.status(500).json({
                success: false,
                message: "Database error while updating order status",
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Order group not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
        });
    });
});

// GET user-specific orders (GROUPED BY PAYMENT)
app.get('/api/userorders/:user_id', (req, res) => {
    const { user_id } = req.params;

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
            co.payment_status
        FROM customerOrders co
        JOIN product p ON co.pid = p.id
        WHERE co.user_id = ?
          AND co.order_status != 'Pending'
        ORDER BY
            co.order_date DESC
    `;

    conn.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Error fetching user orders:", err);
            return res.status(500).json({ message: "Error fetching orders" });
        }

        if (results.length === 0) {
            return res.status(200).json({ orders: [] });
        }

        // GROUP BY order_group_id
        const groupedOrders = {};

        results.forEach((row) => {
            if (!groupedOrders[row.order_group_id]) {
                groupedOrders[row.order_group_id] = {
                    id: row.order_group_id,
                    orderDate: row.order_date,
                    status: row.order_status,
                    paymentStatus: row.payment_status,
                    products: [],
                    totalAmount: 0,
                };
            }

            groupedOrders[row.order_group_id].products.push({
                pid: row.pid,
                name: row.product_name,
                image: row.image,
                qty: row.qty,
                price: parseFloat(row.price),
                total: parseFloat(row.total),
            });

            groupedOrders[row.order_group_id].totalAmount += parseFloat(row.total);
        });

        res.status(200).json({
            orders: Object.values(groupedOrders)
        });
    });
});

//forgot password API
app.post('/api/forgotpassword', (req, res) => {
    const { email } = req.body;

    const sqlCheckEmail = `SELECT * FROM login WHERE username = ?`;
    conn.query(sqlCheckEmail, [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).send("Error processing request");
        }

        if (results.length === 0) {
            console.log("Email not found:", email);
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        //generate otp - random number between 1000 and 9999
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        // Store OTP in database with expiry time (15 minutes from now)
        const sqlStoreOTP = `INSERT INTO otp(email, otp, otp_expiry) VALUES 
        (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE 
        otp = VALUES(otp), otp_expiry = VALUES(otp_expiry)`;
        conn.query(sqlStoreOTP, [email, otp], (err, result) => {
            if (err) {
                console.error("Error storing OTP:", err);
                return res.status(500).json({ success: false, message: "Error sending OTP email" });
            }

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            let mailOptions = {
                from: '"Ecommerce Support" <noreply@ecommerce.com>',
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is ${otp}. This OTP will expire in 15 minutes.`,
                html: `<p>Your OTP for password reset is <strong>${otp}</strong>.</p><p>This OTP will expire in 15 minutes.</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).send("Error sending OTP email");
                }
                console.log('Message sent: %s', info.messageId);
                res.status(200).json({
                    success: true,
                    message: "OTP sent successfully to your email"
                });
            });
        });
    });
});

// verify OTP API
app.post('/api/verifyotp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP required" });
    }

    const sqlVerifyOTP = `
        SELECT * FROM otp 
        WHERE email = ? AND otp = ? AND otp_expiry > NOW()
        ORDER BY id DESC LIMIT 1
    `;

    conn.query(sqlVerifyOTP, [email, otp], (err, results) => {
        if (err) {
            console.error("Error verifying OTP:", err);
            return res.status(500).json({ success: false, message: "Error verifying OTP" });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        console.log("OTP verified successfully for:", email);

        // optional: delete OTP after successful verification
        const sqlDelete = `DELETE FROM otp WHERE email = ?`;
        conn.query(sqlDelete, [email], () => { });

        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    });
});

// Password reset API
app.post("/api/resetpassword", (req, res) => {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Email and new password are required",
        });
    }

    // Update password directly in the database
    const sql = `UPDATE login SET password = ? WHERE username = ?`;
    conn.query(sql, [newPassword, email], (err, result) => {
        if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({
                success: false,
                message: "Error updating password",
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    });
});

// ADD TO CART API
app.post('/api/addtocart/:pid', (req, res) => {
    const { pid } = req.params;
    const { user_id, qty } = req.body;
    const quantity = qty ? qty : 1;

    if (!user_id || !pid) {
        return res.status(400).send("Missing required fields");
    }
    // Verify user exists to avoid foreign key constraint errors
    const sqlCheckUser = `SELECT id FROM register WHERE id = ?`;
    conn.query(sqlCheckUser, [user_id], (errUser, userRows) => {
        if (errUser) {
            console.error('Error checking user existence:', errUser);
            return res.status(500).send('Database error while checking user');
        }

        if (userRows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Step 1: Get product details
        const sqlGetProduct = "SELECT product_name, price FROM product WHERE id = ?";
        conn.query(sqlGetProduct, [pid], (err, result) => {
            if (err) {
                console.error("Error fetching product:", err);
                return res.status(500).send("Database error while fetching product");
            }

            if (result.length === 0) {
                return res.status(404).send("Product not found");
            }

            const { product_name, price } = result[0];
            const total = price * quantity;

            // Step 2: Check if product already exists in the cart
            const sqlCheckExisting = `
                SELECT * FROM customerOrders 
                WHERE user_id = ? AND pid = ? AND order_status = 'Pending'
            `;
            conn.query(sqlCheckExisting, [user_id, pid], (err2, rows) => {
                if (err2) {
                    console.error("Error checking cart:", err2);
                    return res.status(500).send("Database error while checking cart");
                }

                if (rows.length > 0) {
                    // Update quantity if already in cart
                    const newQty = rows[0].qty + quantity;
                    const newTotal = newQty * price;
                    const sqlUpdate = `
                        UPDATE customerOrders 
                        SET qty = ?, total = ? 
                        WHERE user_id = ? AND pid = ? AND order_status = 'Pending'
                    `;
                    conn.query(sqlUpdate, [newQty, newTotal, user_id, pid], (err3) => {
                        if (err3) {
                            console.error("Error updating cart:", err3);
                            return res.status(500).send("Error updating cart item");
                        }
                        res.status(200).send("Cart item updated successfully");
                    });
                } else {
                    // Insert new product into cart
                    const sqlInsert = `
                        INSERT INTO customerOrders 
                        (user_id, pid, qty, price, total, order_date, order_status, payment_status)
                        VALUES (?, ?, ?, ?, ?, NOW(), 'Pending', 'Unpaid')
                    `;
                    conn.query(sqlInsert, [user_id, pid, quantity, price, total], (err4, result2) => {
                        if (err4) {
                            console.error("Error adding to cart:", err4);
                            return res.status(500).send("Error adding item to cart");
                        }
                        console.log(`Added ${product_name} (ID ${pid}) to cart`);
                        res.status(200).send("Item added to cart successfully");
                    });
                }
            });
        });
    });
});

// GET all cart items for a user
app.get('/api/getcartitems/:user_id', (req, res) => {
    const { user_id } = req.params;

    const sql = `
    SELECT 
      co.id, 
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
            console.error("Error fetching cart:", err);
            return res.status(500).send("Error fetching cart items");
        }
        res.json(result);
    });
});

// UPDATE quantity
app.put('/api/updatecart/:id', (req, res) => {
    const { id } = req.params;
    const { qty } = req.body;

    if (!id || !qty) {
        return res.status(400).send("Missing id or qty");
    }

    const sql = `
    UPDATE customerOrders
    SET qty = ?, total = CAST(price AS DECIMAL(10,2)) * ?
    WHERE id = ? AND order_status = 'Pending'
  `;

    conn.query(sql, [qty, qty, id], (err, result) => {
        if (err) {
            console.error("Error updating quantity:", err);
            return res.status(500).send("Error updating quantity");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("No matching cart item found");
        }

        console.log(`Quantity updated for order ID: ${id}, New Qty: ${qty}`);
        res.send("Quantity updated successfully");
    });
});

// DELETE item from cart
app.delete('/api/deletefromcart/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM customerOrders WHERE id = ? AND order_status = 'Pending'";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error removing item:", err);
            return res.status(500).send("Error removing item from cart");
        }
        res.send("Item removed successfully");
    });
});

// rzp_test_RcpYJahrNYiMkG API Key
// Ycu2DEJwCQNG8D1aKlv2Tij6 Test key Secret


// paybill api with insert query for payment in payment table
app.post('/api/paybill/:razorpay_id/:price', (req, res) => {
    const { razorpay_id, price } = req.params;
    const { uid } = req.body;

    // 🔑 generate ONE group id for this checkout
    const orderGroupId = `ORD_${Date.now()}_${uid}`;

    const sqlInsertPayment = `INSERT INTO payment 
    (user_id, order_id, payment_reference, amount, 
    payment_date) VALUES (?, ?, ?, ?, NOW())
    `;

    conn.query(
        sqlInsertPayment,
        [uid, orderGroupId, razorpay_id, price],
        (err) => {
            if (err) {
                console.error("Error inserting payment:", err);
                return res.status(500).json({ success: false });
            }

            const sqlUpdateOrders = `UPDATE customerOrders
            SET
            order_status = 'Confirmed',
            payment_status = 'Paid',
            order_group_id = ?
            WHERE user_id = ? AND order_status = 'Pending'
            `;

            conn.query(sqlUpdateOrders, [orderGroupId, uid], (err2) => {
                if (err2) {
                    console.error("Error updating orders:", err2);
                    return res.status(500).json({ success: false });
                }

                res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                    order_group_id: orderGroupId
                });
            });
        }
    );
});

// Admin Dashboard API
app.get("/api/admindashboard", (req, res) => {
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
      LIMIT 5;
    `,
        recentReviews: `
      SELECT id,pid, user_id, comments, star_rating
      FROM feedback
      ORDER BY id DESC
      LIMIT 5;
    `
    };

    // Execute all queries in parallel
    Promise.all(
        Object.values(queries).map((query) => {
            return new Promise((resolve, reject) => {
                conn.query(query, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        })
    )
        .then(
            ([
                totalSalesRes,
                totalOrdersRes,
                totalCustomersRes,
                todayOrdersRes,
                recentOrdersRes,
                recentReviewsRes,
            ]) => {
                res.status(200).json({
                    totalSales: totalSalesRes[0]?.totalSales || 0,
                    totalOrders: totalOrdersRes[0]?.totalOrders || 0,
                    totalCustomers: totalCustomersRes[0]?.totalCustomers || 0,
                    todayOrders: todayOrdersRes[0]?.todayOrders || 0,
                    recentOrders: recentOrdersRes,
                    recentReviews: recentReviewsRes,
                });
            }
        )
        .catch((err) => {
            console.error("Error fetching admin dashboard:", err);
            res.status(500).json({ message: "Error fetching admin dashboard" });
        });
});

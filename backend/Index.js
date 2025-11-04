const e = require('express');
const express = require('express');
const app = express();
const port = 3001
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

app.post('/api/register', (req, res) => {
    const { name, gender, city, address, pincode, email, password } = req.body;

    const sqlInsertRegister = `
        INSERT INTO register (name, gender, city, address, pincode, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(sqlInsertRegister, [name, gender, city, address, pincode, email], (err, result) => {
        if (err) {
            console.error("Error inserting into register:", err);
            return res.status(500).send("Error registering user");
        }

        const sqlInsertLogin = `
            INSERT INTO login (username, password, utype)
            VALUES (?, ?, ?)
        `;

        conn.query(sqlInsertLogin, [email, password, 'user'], (err, result) => {
            if (err) {
                console.error("Error inserting into login:", err);
                return res.status(500).send("Error registering user");
            }

            console.log("User registered successfully:", email);
            // res.status(200).send("User registered successfully");
            res.status(200).json({ success: true, message: "User registered successfully" });
        });
    });
});

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

app.post('/api/feedback', (req, res) => {
    const { aboutProduct, aboutService, comments } = req.body;

    const sqlInsertFeedback = `
        INSERT INTO feedback (user_id,about_product, about_service, comments)
        VALUES (?, ?, ?, ?)
    `;

    conn.query(sqlInsertFeedback, ['user@gmail.com', aboutProduct, aboutService, comments], (err, result) => {
        if (err) {
            console.error("Error inserting into feedback:", err);
            return res.status(500).send("Error submitting feedback");
        }

        console.log("Feedback submitted successfully");
        res.status(200).send("Feedback submitted successfully");
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
app.post('/api/addProduct', upload.single('image'), (req, res) => {
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

// app.post('/api/addProduct', (req, res) => {
//     const { categoryName, productName, quantity, uom, price, stock, image, description } = req.body;

//     const sqlInsertProduct = `
//         INSERT INTO product (category_name, product_name, qty, uom, price, stock, image, description)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     conn.query(sqlInsertProduct, [categoryName, productName, quantity, uom, price, stock, image, description], (err, result) => {
//         if (err) {
//             console.error("Error inserting into product:", err);
//             return res.status(500).send("Error adding product");
//         }

//         console.log("Product added successfully:", productName);
//         res.status(200).send("Product added successfully");
//     });
// });

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


app.post('/api/authlogin', (req, res) => {
    const { username, password } = req.body;

    const sqlSelectLogin = `SELECT * FROM login WHERE username = ? AND password = ?`;

    conn.query(sqlSelectLogin, [username, password], (err, results) => {
        if (err) {
            console.error("Error querying login:", err);
            return res.status(500).send("Error during login");
        }

        if (results.length > 0) {
            console.log("Login successful for user:", username);
            res.status(200).json({
                success: true,
                message: "Login successful",
                username: results[0].username,
                utype: results[0].utype
            });
        } else {
            console.log("Invalid credentials for user:", username);
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

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

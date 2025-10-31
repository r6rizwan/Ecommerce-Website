const e = require('express');
const express = require('express');
const app = express();
const port = 3001
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

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
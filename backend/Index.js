const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const adminAuthRoutes = require('./adminAuth');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(express.json());
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true
    })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

conn.connect((err) => {
    if (err) {
        console.log('DB could not be connected');
    } else {
        console.log('DB connected successfully');
    }
});

app.set('db', conn);

app.get('/', (req, res) => {
    res.send('Hello from Backend');
});

app.use(adminAuthRoutes);
app.use(authRoutes);
app.use(catalogRoutes);
app.use(feedbackRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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
const port = 3001;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ecommerce',
    user: 'root',
    password: ''
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

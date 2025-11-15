# 📦 E-Commerce Website (React + Node.js + MySQL + Razorpay)

A full-stack e-commerce platform built using **React**, **Node.js**, **Express**, **MySQL**, and **Razorpay payment gateway**.

Includes user authentication, product management, cart system, orders, and admin dashboard.

---

## 🚀 Features

### 🛍️ User Features
- Browse all products  
- View product details  
- Category-based filtering  
- Add to cart  
- Checkout & online payment via Razorpay  
- Order history  
- Login / Signup / Reset Password  
- Contact & Feedback form  
- Responsive UI  

### 🛠️ Admin Features
- Add new products  
- Manage products & categories  
- View all user orders  
- Manage feedback  
- Admin dashboard layout  

---

## 🧱 Tech Stack

### **Frontend**
- React.js  
- React Router  
- CSS  
- Axios / Fetch  
- Razorpay Web Integration  

### **Backend**
- Node.js  
- Express.js  
- MySQL  
- Multer (Image uploads)  
- Nodemailer  
- dotenv  

---

## 🗂️ Project Structure

### **Frontend (`/src`)**
```
src/
├── components/
├── layouts/
├── pages/
├── App.js
├── index.js
└── styles/
```

### **Backend**
```
backend/
├── index.js
├── uploads/
├── node_modules/
└── .env
```

---

## ⚙️ Setup Instructions

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

## **2️⃣ Backend Setup**

### Install dependencies
```bash
cd backend
npm install
```

### Create `.env` file
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=ecommerce
PORT=3001

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourEmailAppPassword

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Start backend
```bash
node index.js
```

---

## **3️⃣ Frontend Setup**

### Install dependencies
```bash
cd frontend
npm install
```

### Start frontend
```bash
npm start
```

Frontend → http://localhost:3000  
Backend → http://localhost:3001  

---

## 📦 API Endpoints (Summary)

### **Products**
- `GET /api/products`
- `POST /api/addproduct`
- `GET /api/product/:id`

### **Users**
- `POST /api/register`
- `POST /api/login`
- `POST /api/reset-password`

### **Cart & Orders**
- `POST /api/addtocart`
- `GET /api/usercart/:id`
- `POST /api/createorder`

### **Admin**
- `POST /api/addproduct`
- `GET /api/admin/orders`

---

## 🧪 Future Improvements
- JWT authentication  
- Product filtering & sorting  
- Wishlist  
- Product reviews & ratings  
- Order status tracking  
- Cloud image uploads (Cloudinary, S3)  
- Admin analytics dashboard  
- Better UI using Material UI or Tailwind  

---

## 🤝 Contributing
Contributions are welcome!  
Feel free to open issues or submit pull requests.

---

## 📝 License
MIT License

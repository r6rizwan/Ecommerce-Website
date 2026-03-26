# ShopSphere Ecommerce

ShopSphere is a full-stack ecommerce application with customer, admin, and super-admin flows. It supports authentication, catalog browsing, cart and checkout, Razorpay payments, order management, feedback, and admin operations for products, categories, and orders.

## Tech Stack
- Frontend: React, React Router, Bootstrap, Axios
- Backend: Node.js, Express
- Database: MySQL
- Payments: Razorpay
- Email: Nodemailer

## Main Features
- User registration, login, forgot password, OTP verification, and password reset
- Product listing, product detail, search, filter, and feedback
- Guest cart and logged-in cart flow
- Razorpay-based checkout
- User order history and tracking timeline
- Admin dashboard, products, categories, orders, and feedback management
- Super-admin login, create admin, reset admin password, and delete admin

## Project Structure
- `frontend/` React application
- `backend/` Express + MySQL API
- `schema.sql` MySQL schema for initial setup

## Setup

### 1. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables
- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`
- Fill in all required values before running the project

### 3. Create the database
Run the schema file in MySQL:
```sql
SOURCE schema.sql;
```

Or import `schema.sql` using phpMyAdmin / MySQL Workbench.

### 4. Start the backend
```bash
cd backend
npm start
```

### 5. Start the frontend
```bash
cd frontend
npm start
```

### 6. Build the frontend for deployment
```bash
cd frontend
npm run build
```

## Environment Variables

### Backend (`backend/.env`)
- `PORT`
  Backend server port. Example: `5000`
- `ALLOWED_ORIGIN`
  Frontend origin allowed by CORS. Example: `http://localhost:3000`
- `DB_HOST`
  MySQL host
- `DB_PORT`
  MySQL port
- `DB_NAME`
  MySQL database name
- `DB_USER`
  MySQL username
- `DB_PASSWORD`
  MySQL password
- `EMAIL_USER`
  Sender email used by Nodemailer
- `EMAIL_PASS`
  Sender email password or app password
- `SUPER_ADMIN_EMAIL`
  Super-admin login email
- `SUPER_ADMIN_PASSWORD`
  Super-admin login password
- `SUPER_ADMIN_JWT_SECRET`
  JWT secret for super-admin authentication
- `ADMIN_JWT_SECRET`
  JWT secret for admin authentication
- `PAYMENT_PROVIDER`
  Payment mode. Example: `razorpay` or `mock`
- `RAZORPAY_KEY_ID`
  Razorpay public key id used by the backend during order creation
- `RAZORPAY_KEY_SECRET`
  Razorpay secret key used only on the backend
- `RAZORPAY_MAX_AMOUNT_PAISE`
  Max payment amount in paise

### Frontend (`frontend/.env`)
- `REACT_APP_API_URL`
  Backend API base URL. Example: `http://localhost:5000`
- `REACT_APP_RAZORPAY_KEY_ID`
  Razorpay Key ID for frontend checkout initialization
- `REACT_APP_PAYMENT_PROVIDER`
  Frontend payment mode. Example: `razorpay` or `mock`

## Notes for Handoff
- `node_modules` should not be shared in the handoff package
- `.env` files should not be shared in the handoff package
- Use `.env.example` files as the configuration template
- Use `schema.sql` to create the required database tables before starting the app

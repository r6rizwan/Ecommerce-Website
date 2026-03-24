# ShopSphere Ecommerce (v1)

Production-focused ecommerce demo with user, admin, and super-admin roles.

## Tech Stack
- Frontend: React, React Router, Bootstrap, Axios
- Backend: Node.js, Express, MySQL, JWT, Multer, Nodemailer
- Payments: Razorpay

## Current Scope (v1)
- User auth (register/login/forgot OTP/reset)
- Product listing/detail/search/filter
- Guest cart + merge into user cart on login
- Checkout + payment flow
- User orders + tracking dialog
- Feedback submission
- Admin: dashboard, orders, products, categories, feedback
- Super admin: create admin, delete admin, reset admin password

## Role-Based Component Structure
`frontend/src/components` is now organized by role:
- `auth/`
- `user/`
- `admin/`
- `superAdmin/`
- `public/`
- `shared/`

## Privacy Changes
Removed user-list management from admin:
- Removed frontend register view
- Removed backend APIs:
  - `GET /api/getregister`
  - `DELETE /api/deleteregister/:id`

## Local Setup

### Backend
```bash
cd backend
npm install
node Index.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Production build
```bash
cd frontend
npm run build
```

## Environment Variables
Create/update `backend/.env` with:
- `EMAIL_USER`
- `EMAIL_PASS`
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`
- `SUPER_ADMIN_JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `PAYMENT_PROVIDER` (`razorpay` or `mock`)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_MAX_AMOUNT_PAISE`

Create/update `frontend/.env` with:
- `REACT_APP_API_BASE_URL`
- `REACT_APP_RAZORPAY_KEY_ID`
- `REACT_APP_PAYMENT_PROVIDER` (`razorpay` or `mock`)

Rotate secrets before deployment.

## Database
Backend expects MySQL database: `ecommerce`.

## Known Limits (v1)
- Tracking event dates are currently estimated from order date
- No websocket/push updates for order status changes
- Frontend API base URL env support is added, but some older local assumptions may still need cleanup before deployment hardening

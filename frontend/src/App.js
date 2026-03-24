// App.js
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import Home from './components/public/Home';
import AboutUsPage from './components/public/AboutUsPage';
import NewLogin from './components/auth/NewLogin';
import RegistrationPage from './components/auth/RegistrationPage';
import ForgotPassword from './components/auth/ForgotPassword';
import OtpScreen from './components/auth/OtpScreen';
import ResetPassword from './components/auth/ResetPassword';
import UserHome from './components/user/UserHome';
import ProductDetail from './components/user/ProductDetail';
import UserOrders from './components/user/UserOrders';
import UserCart from './components/user/UserCart';
import FeedbackPage from './components/user/FeedbackPage';
import PayBill from './components/user/PayBill';
import PaySuccess from './components/user/PaySuccess';
import AdminHome from './components/admin/AdminHome';
import AdminOrders from './components/admin/AdminOrders';
import CategoryPage from './components/admin/CategoryPage';
import CategoryView from './components/admin/CategoryView';
import ProductAddPage from './components/admin/ProductAddPage';
import ProductView from './components/admin/ProductView';
import FeedbackView from './components/admin/FeedbackView';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminLogin from './components/superAdmin/SuperAdminLogin';
import SuperAdminDashboard from './components/superAdmin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/User Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/login" element={<NewLogin />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otpscreen" element={<OtpScreen />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/usercart" element={<UserCart />} />
          <Route path="/paybill" element={<PayBill />} />
          <Route path="/paysuccess" element={<PaySuccess />} />
        </Route>

        {/* Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/categoryview" element={<CategoryView />} />
          <Route path="/addproduct" element={<ProductAddPage />} />
          <Route path="/productview" element={<ProductView />} />
          <Route path="/feedbackview" element={<FeedbackView />} />
        </Route>

        {/* Super Admin Layout */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

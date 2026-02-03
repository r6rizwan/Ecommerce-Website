// App.js
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import Home from './components/Home';
import AboutUsPage from './components/AboutUsPage';
// import ContactUsPage from './components/ContactUsPage';
import NewLogin from './components/NewLogin';
import RegistrationPage from './components/RegistrationPage';
import ForgotPassword from './components/ForgotPassword';
import OtpScreen from './components/OtpScreen';
import ResetPassword from './components/ResetPassword';
import UserHome from './components/UserHome';
import ProductDetail from './components/ProductDetail';
import UserOrders from './components/UserOrders';
import UserCart from './components/UserCart';
import FeedbackPage from './components/FeedbackPage';
import PayBill from './components/PayBill';
import PaySuccess from './components/PaySuccess';
import AdminHome from './components/AdminHome';
import AdminOrders from './components/AdminOrders';
import CategoryPage from './components/CategoryPage';
import CategoryView from './components/CategoryView';
import ProductAddPage from './components/ProductAddPage';
import ProductView from './components/ProductView';
import RegistrationView from './components/RegistrationView';
import FeedbackView from './components/FeedbackView';
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
          {/* <Route path="/contactus" element={<ContactUsPage />} /> */}
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
          <Route path="/registerview" element={<RegistrationView />} />
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

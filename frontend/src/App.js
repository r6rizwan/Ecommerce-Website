// import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
// import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// // Components
// import CategoryPage from './components/CategoryPage.js';
// import FeedbackPage from './components/FeedbackPage.js';
// import Footer from './components/Footer.js';
// import Home from './components/Home.js';
// import NavBar from './components/NavBar.js';
// import NewLogin from './components/NewLogin.js';
// import ProductAddPage from './components/ProductAddPage.js';
// import RegistrationPage from './components/RegistrationPage.js';
// import RegistrationView from './components/RegistrationView.js';
// import CategoryView from './components/CategoryView.js';
// import FeedbackView from './components/FeedbackView.js';
// import ProductView from './components/ProductView.js';
// import AdminHome from './components/AdminHome.js';
// import UserHome from './components/UserHome.js';
// import AboutUsPage from './components/AboutUsPage.js';
// import ContactUsPage from './components/ContactUsPage.js';
// import AdminOrders from './components/AdminOrders.js';
// import UserCart from './components/UserCart.js';
// import ForgotPassword from './components/ForgotPassword.js';
// import OtpScreen from './components/OtpScreen.js';
// import ResetPassword from './components/ResetPassword.js';
// import UserOrders from './components/UserOrders.js';
// import PayBill from './components/PayBill.js';
// import PaySuccess from './components/PaySuccess.js';

// function AppContent() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const utype = localStorage.getItem('utype');
//     const path = location.pathname;

//     // ✅ Only auto-redirect from "/" (home page)
//     // 🚫 Never redirect from login/register/forgot password pages
//     const authPages = ["/login", "/register", "/forgotpassword", "/otpscreen", "/resetpassword"];

//     if (!authPages.includes(path)) {
//       if (utype === "admin" && path === "/") {
//         navigate("/adminhome", { replace: true });
//       } else if (utype === "user" && path === "/") {
//         navigate("/userhome", { replace: true });
//       }
//     }
//   }, [location, navigate]);

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <NavBar />
//       <div className="flex-grow-1">
//         <Routes>
//           {/* Guest / Public Pages */}
//           <Route path="/" element={<Home />} />
//           <Route path="/aboutus" element={<AboutUsPage />} />
//           <Route path="/contactus" element={<ContactUsPage />} />
//           <Route path="/login" element={<NewLogin />} />
//           <Route path="/register" element={<RegistrationPage />} />
//           <Route path="/forgotpassword" element={<ForgotPassword />} />
//           <Route path="/otpscreen" element={<OtpScreen />} />
//           <Route path="/resetpassword" element={<ResetPassword />} />

//           {/* Admin Pages */}
//           <Route path="/adminhome" element={<AdminHome />} />
//           <Route path="/category" element={<CategoryPage />} />
//           <Route path="/categoryview" element={<CategoryView />} />
//           <Route path="/addproduct" element={<ProductAddPage />} />
//           <Route path="/productview" element={<ProductView />} />
//           <Route path="/orders" element={<AdminOrders />} />
//           <Route path="/registerview" element={<RegistrationView />} />
//           <Route path="/feedbackview" element={<FeedbackView />} />

//           {/* User Pages */}
//           <Route path="/userhome" element={<UserHome />} />
//           <Route path="/userorders" element={<UserOrders />} />
//           <Route path="/feedback" element={<FeedbackPage />} />
//           <Route path="/usercart" element={<UserCart />} />
//           <Route path="/paybill" element={<PayBill />} />
//           <Route path="/paysuccess" element={<PaySuccess />} />
//         </Routes>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;


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
import ContactUsPage from './components/ContactUsPage';
import NewLogin from './components/NewLogin';
import RegistrationPage from './components/RegistrationPage';
import ForgotPassword from './components/ForgotPassword';
import OtpScreen from './components/OtpScreen';
import ResetPassword from './components/ResetPassword';
import UserHome from './components/UserHome';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/User Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/contactus" element={<ContactUsPage />} />
          <Route path="/login" element={<NewLogin />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otpscreen" element={<OtpScreen />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/userhome" element={<UserHome />} />
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
      </Routes>
    </Router>
  );
}

export default App;

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryPage from './components/CategoryPage.js';
import FeedbackPage from './components/FeedbackPage.js';
import Footer from './components/Footer.js';
import Home from './components/Home.js';
import NavBar from './components/NavBar.js';
import NewLogin from './components/NewLogin.js';
import ProductAddPage from './components/ProductAddPage.js';
import RegistrationPage from './components/RegistrationPage.js';
import RegistrationView from './components/RegistrationView.js';
import CategoryView from './components/CategoryView.js';
import FeedbackView from './components/FeedbackView.js';
import ProductView from './components/ProductView.js';
import AdminHome from './components/AdminHome.js';
import UserHome from './components/UserHome.js';
import AboutUsPage from './components/AboutUsPage.js';
import ContactUsPage from './components/ContactUsPage.js';
import AdminOrders from './components/AdminOrders.js';
import UserCart from './components/UserCart.js';
import ForgotPassword from './components/ForgotPassword.js';
import OtpScreen from './components/OtpScreen.js';
import ResetPassword from './components/ResetPassword.js';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <div className="flex-grow-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/category' element={<CategoryPage />} />
            <Route path='/feedback' element={<FeedbackPage />} />
            <Route path='/addproduct' element={<ProductAddPage />} />
            <Route path='/login' element={<NewLogin />} />
            <Route path='/register' element={<RegistrationPage />} />
            <Route path='/registerview' element={<RegistrationView />} />
            <Route path='/categoryview' element={<CategoryView />} />
            <Route path='/feedbackview' element={<FeedbackView />} />
            <Route path='/productview' element={<ProductView />} />
            <Route path='/adminhome' element={<AdminHome />} />
            <Route path='/userhome' element={<UserHome />} />
            <Route path='/aboutus' element={<AboutUsPage />} />
            <Route path='/contactus' element={<ContactUsPage />} />
            <Route path='/orders' element={<AdminOrders />} />
            <Route path='/usercart' element={<UserCart />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/otpscreen' element={<OtpScreen />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

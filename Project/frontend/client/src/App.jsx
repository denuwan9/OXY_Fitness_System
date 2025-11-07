import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx"; 
import Signup from "./pages/Signup.jsx"; 
import Profile from "./pages/Profile.jsx";
import UserManager from "./pages/UserManager.jsx";
import Home from "./pages/Home.jsx";
import AdminLayouts from "./Layouts/AdminLayouts.jsx";
import UserLayout from "./Layouts/UserLayout.jsx";
import PublicLayouts from "./Layouts/PublicLayouts.jsx";
import { Toaster } from 'react-hot-toast';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
import SupplementNav from "./components/SupplementNav/SupplementNav";
import ProductCard from "./components/ProductCards/ProductCard";
import Advertisement from "./components/Advertisement/Advertisement";
import Newproduct from "./components/Newproducts/Newproducts";
import Footer from "./components/Footer/Footer";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Checkout from "./pages/Checkout/Checkout";
import OrderStatus from "./pages/OrderStatus/OrderStatus";
import Sidebar from './components/Sidebar/Sidebar';
import SupplierDashboard from './pages/SupplierDashboard/SupplierDashboard';
import OrderManagement from './pages/OrderManagement/OrderManagement';
import ListItems from './pages/ListItems/ListItems';
import SellingItems from './pages/SellingItems/SellingItems';
import Settings from './pages/Settings/Settings';
import Logout from './pages/Logout/Logout';
import ChangePassword from './pages/ChangePassword.jsx';
import Membership from './pages/Membership';
import PromoPackage from './pages/PromoPackage';
import PackageForm from './pages/PackageForm';
import reportWebVitals from './pages/reportWebVitals';
import ReactDOM from 'react-dom/client';
import EUpdate from "./pages/payment/Update";
import Eadd from "./pages/payment/add";
import EEtable from "./pages/payment/table";
import ContactUs from "./pages/ContactUs.jsx";

<<<<<<< Updated upstream
import Vitamins from "./pages/Vitamins/Vitamins";
import Proteins from "./pages/Proteins/Proteins";
import Boosters from "./pages/Boosters/Boosters";

=======
>>>>>>> Stashed changes
// Modified ScrollToTop component for shop pages only
const ShopScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

const App = () => {
  
return(
  
    
    <Router>
      <Toaster/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayouts />}>
          
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset_password/:id/:token" element={<ResetPassword />} />

        </Route>
        <Route path="/change-password" element={<ChangePassword />} />
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
        <Route index element={
          <>
            <Header />
          <Home />
          <Footer />
          </>
        } />
          <Route path="profile" element={<Profile />} />
          
          {/* Shop Routes with ScrollToTop */}
          <Route path="shop" element={
            <>
              <ShopScrollToTop />
              <Header />
              <Banner />
              <SupplementNav />
              <ProductCard />
              <Advertisement />
              <Newproduct />
              <Footer />
            </>
          } />
          <Route path="product-detail/:id" element={
            <>
              <ShopScrollToTop />
              <Header />
              <Banner />
              <SupplementNav />
              <ProductDetail />
              <Footer />
            </>
          } />
          <Route path="checkout" element={
            <>
              <ShopScrollToTop />
              <Header />
              <Banner />
              <SupplementNav />
              <Checkout />
              <Footer />
            </>
          } />
          <Route path="order-status" element={<OrderStatus />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayouts />}>
          <Route index element={<UserManager />} />
        </Route>

        {/* Supplier Routes */}
        <Route path="/supplier" element={
          
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              
              <SupplierDashboard />
            </div>
          </div>
        } />
        <Route path="/orders" element={
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <OrderManagement />
            </div>
          </div>
        } />
        <Route path="/list-items" element={
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <ListItems />
            </div>
          </div>
        } />
        <Route path="/selling-items" element={
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <SellingItems />
            </div>
          </div>
        } />
        <Route path="/settings" element={
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Settings />
            </div>
          </div>
        } />
        <Route path="/logout" element={<Logout />} />
        
        <Route path="/membership" element={
          <><Header />
          <Membership />
          <Footer />
        </>
          } />
        <Route path="/promo" element={<PromoPackage />} />
        <Route path="/form/:packageName" element={<PackageForm />} />
        <Route path="/adminMembership" element={<PackageForm />} />



        <Route path="/epayment" element={
          <>
            <Header />
          <EEtable />
          <Footer />
          </>
          } />
        <Route path="/eupdate/:encomid" element={
          <>
            <Header />
          <EUpdate />
          <Footer />
          </>
        } />
        
        <Route path="/eadd" element={
          <><Header />
          <Eadd />
        <Footer />
        </>
        } />
        
        <Route path="/contactus" element={  
          <>
            <Header />
            <ContactUs />
            <Footer />
          </>
        } />

<<<<<<< Updated upstream
        <Route path="/vitamins" element={<Vitamins />} />
        <Route path="/proteins" element={<Proteins />} />
        <Route path="/boosters" element={<Boosters />} />

=======
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
  
};
reportWebVitals();

export default App;
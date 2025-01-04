import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Cart from './pages/Cart/Cart';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import Subscriptions from './pages/Subscriptions/Subscriptions';
import SubscriptionDetails from './pages//Subscriptions/SubscriptionDetails';
import MySubscriptions from './pages/MySubscriptions/MySubscriptions';
import TopDishes from './pages/TopDishes/TopDishes'; // Import the Top Dishes page
import DietPlan from './pages/DietPlan/DietPlan';
import ScrollToTop from './components/ScrollToTop';
import Cancel from './Cancel';
import Success from './Success';
import TrackOrder from "./pages/TrackOrder";
const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <ScrollToTop /> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />;
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/subscriptions' element={<Subscriptions />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
          <Route path='/my-subscriptions' element={<MySubscriptions />} />
          <Route path='/top-dishes' element={<TopDishes />} /> {/* New Top Dishes route */}
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;

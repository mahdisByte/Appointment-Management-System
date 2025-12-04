import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Make sure Header is imported

import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ServiceForm from "./Pages/ServiceForm";
import HomePage from "./Pages/HomePage";
import ServicePage from "./Pages/ServicePage";
import PaymentPage from "./Pages/PaymentPage";
import Profile from "./Pages/ProfilePage";
import AdminLogin from "./Pages/AdminLoginPage";  // Admin Login Page
import HomePageAdmin from "./Pages/HomePageAdmin";

import "./App.css";
import AdminProfile from "./Pages/AdminProfile";
import BookingHistory from "./Pages/BookingHistory";
import Contact from "./Pages/Contact";
import AdminDashboard from "./components/AdminDashboard";
import ChatbotWidget from "./components/ChatbotWidget";
import SettingsPage from "./Pages/SettingsPage";

import DeleteServices from "./Pages/DeleteServices";
import DeleteMyServices from "./Pages/DeleteMyServices";
import ServiceBooked from "./Pages/ServiceBooked";

function App() {
  return (
    <Router>
      <Header /> {/* This should be at the top */}
      <ChatbotWidget/>
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />      
          <Route path="/login" element={<LoginPage />} />   
          <Route path="/signup" element={<SignupPage />} /> 

          {/* User Routes */}
          <Route path="/homepage" element={<HomePage />} /> 
          <Route path="/service-form" element={<ServiceForm />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/homepage-admin" element={<HomePageAdmin />} />

          <Route path="/admin-profile" element={<AdminProfile />} />

          <Route path="/booking-history" element={<BookingHistory />} />

          {/* Settings Route */}
          <Route path="/settings" element={<SettingsPage />} />
          {/* Fallback Route */}
          <Route
            path="*"
            element={<h2 className="text-center mt-10">Page Not Found</h2>}
          />

           {/* Contact Route */}
          <Route path="/Contact" element={<Contact />} />

          <Route path="/delete-service" element={<DeleteServices/>} />
          <Route path="/delete-my-service" element={<DeleteMyServices/>} />
           <Route path="services-booked" element={<ServiceBooked />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

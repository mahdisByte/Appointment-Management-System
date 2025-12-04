import React from "react";
import { Link } from "react-router-dom";
import "../Styles/LandingPage.css";
import LandingIllustration from "../assets/images/L_img.png";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Apointment Management</div>
        <div className="nav-links">
          {/* <Link to="/homepage">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signup" className="cta-btn-link">Sign Up</Link>
          <Link to="/login" className="cta-btn-link">Login</Link>
          <Link to="/admin-login" className="cta-btn-link">Admin Login</Link> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>
            Book Trusted <br /> Professionals — <br /> Anytime, Anywhere
          </h1>
          <p>Serving homes and health with speed and simplicity.</p>
          <Link to="/signup" className="cta-btn">
            HIRE NOW!
          </Link>
        </div>
        <div className="hero-image">
          <img src={LandingIllustration} alt="illustration" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

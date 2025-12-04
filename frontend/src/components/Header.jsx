import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import defaultProfilePic from "../assets/defaultProfilePic.jpg";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");
  const isLoggedInAsAdmin = !!adminToken;

  // Fetch profile safely
  useEffect(() => {
    const fetchProfile = async () => {
      let token, url;

      if (adminToken) {
        token = adminToken;
        url = "http://localhost:8000/api/admin/profile";
      } else if (userToken) {
        token = userToken;
        url = "http://localhost:8000/api/profile";
      } else {
        setCurrentUser(null);
        return;
      }

      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile response:", res.data);

        // Backend may return {admin: {...}} or {user: {...}}
        const userData = res.data.admin || res.data.user || res.data || null;
        setCurrentUser(userData);
      } catch (error) {
        if (error.response) {
          console.error(
            "Profile fetch error:",
            error.response.status,
            error.response.data
          );
          if (error.response.status === 401) {
            // Unauthorized → clear token & redirect
            localStorage.removeItem(adminToken ? "admin_token" : "token");
            setCurrentUser(null);
            navigate(adminToken ? "/admin-login" : "/login");
          }
        } else {
          console.error("Network error:", error.message);
        }
      }
    };

    fetchProfile();
  }, [adminToken, userToken, navigate]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const logoutUrl = isLoggedInAsAdmin
      ? "http://localhost:8000/api/admin/logout"
      : "http://localhost:8000/api/logout";

    const token = isLoggedInAsAdmin ? adminToken : userToken;

    try {
      await axios.post(
        logoutUrl,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Server logout failed:", err.response || err.message);
    } finally {
      localStorage.removeItem(isLoggedInAsAdmin ? "admin_token" : "token");
      setCurrentUser(null);
      setIsDropdownOpen(false);
      navigate(isLoggedInAsAdmin ? "/admin-login" : "/login");
    }
  };

  const profilePicture = currentUser?.profile_picture || defaultProfilePic;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      {/* Left: Logo */}
      <div className="header-left">
        <Link to="/" className="logo">
          AppointMe
        </Link>
      </div>

      {/* Center: Nav */}
      <div className="header-center">
        <nav className="main-nav">
          <Link
            to="/homepage"
            className={`nav-link ${isActive("/homepage") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={`nav-link ${isActive("/services") ? "active" : ""}`}
          >
            All Services
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/admin-login" className="nav-link">
            Admin Login
          </Link>
        </nav>
      </div>

      {/* Right: Profile */}
      <div className="header-right">
        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            className="profile-circle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {currentUser ? (
              <img src={profilePicture} alt="Profile" />
            ) : (
              <FaUserCircle size={30} color="#a0aec0" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              {!currentUser ? (
                <>
                  <Link to="/login" className="dropdown-item">
                    User Login
                  </Link>
                  <Link to="/admin-login" className="dropdown-item">
                    Admin Login
                  </Link>
                </>
              ) : isLoggedInAsAdmin ? (
                <>
                  <div className="dropdown-user-info">
                    <strong>{currentUser?.name}</strong>
                    <span>Admin</span>
                  </div>
                  <div className="dropdown-separator"></div>
                  <Link to="/admin-dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                  <Link to="/admin-profile" className="dropdown-item">
                    Profile
                  </Link>
                  <div className="dropdown-separator"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item dropdown-button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-user-info">
                    <strong>{currentUser?.name}</strong>
                    <span>
                      {currentUser?.is_verified ? "Provider" : "User"}
                    </span>
                  </div>
                  <div className="dropdown-separator"></div>
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <Link to="/booking-history" className="dropdown-item">
                    Booking History
                  </Link>
                  <div className="dropdown-separator"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item dropdown-button"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

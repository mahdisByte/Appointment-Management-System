import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // We can reuse the user profile styles

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin-login"); // Redirect to login if no token exists
      return;
    }

    // Fetch the admin profile from the backend
    fetch(`${API_BASE}/admin/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token for authentication
      },
    })
      .then(res => {
        if (res.status === 401) {
          // If token is invalid or expired
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setAdmin(data.admin); // Set the admin data in state
        } else {
          // Handle other potential errors from the backend
          throw new Error(data.msg || 'Failed to fetch profile');
        }
      })
      .catch(err => {
        console.error("Failed to fetch admin profile:", err);
        localStorage.removeItem("admin_token"); // Clear bad token
        navigate("/admin-login"); // Redirect to login
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <div className="profile-page"><p className="loading-text">Loading...</p></div>;
  }

  if (!admin) {
    return <div className="profile-page"><p className="loading-text">Could not load admin profile.</p></div>;
  }

  // Render the profile card once data is loaded
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-name">{admin.name}</h1>
          <p className="profile-email">{admin.email}</p>
        </div>
        <div className="profile-body">
          <div className="profile-info-item">
            <span className="info-label">Role</span>
            <span className="info-value">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

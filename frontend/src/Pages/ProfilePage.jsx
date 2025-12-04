import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import "../styles/ProfilePage.css";
import ApplicationModal from "../components/ApplicationModal";
import defaultProfilePic from "../assets/defaultProfilePic.jpg";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setUser(res.data.user);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch profile. Please login again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handlePictureEdit = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Appointment");

    try {
      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/djlfgopne/image/upload",
        formData
      );
      const profilePictureUrl = cloudinaryRes.data.secure_url;

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8000/api/profile/update-picture",
        { profile_picture: profilePictureUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prevUser) => ({ ...prevUser, profile_picture: profilePictureUrl }));

    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    fetchUserProfile();
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <p className="loading-text">No user found. Please login.</p>;

  const role = user.is_verified ? "Provider" : "User";
  const verificationStatus = user.is_verified ? "Verified" : "Not Verified";
  const applicationStatus = user.application_status;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={user.profile_picture || defaultProfilePic}
              alt="Profile"
              className="profile-picture"
            />
            <button
              className="edit-picture-button"
              onClick={handlePictureEdit}
              disabled={isUploading}
            >
              {isUploading ? "..." : <FaPencilAlt />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-body">
          <div className="profile-info-row">
            <div className="profile-info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{user.id}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Role</span>
              <span className="info-value">{role}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Status</span>
              <span className={`info-value status ${user.is_verified ? "verified" : "not-verified"}`}>
                {verificationStatus}
              </span>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {!user.is_verified && (
          <div className="profile-footer">
            {applicationStatus === "pending" ? (
              <button className="apply-button" disabled>
                Application Pending
              </button>
            ) : (
              <button className="apply-button" onClick={handleApplyClick}>
                Apply for Provider
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ApplicationModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onApplicationSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfilePage.css"; // reuse profile styles for consistent look

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.user);
          setName(res.data.user.name || "");
          setEmail(res.data.user.email || "");
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setMessage({ type: "error", text: "Failed to load profile. Please login." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Update username
  const handleUpdateName = async () => {
    setMessage(null);
    if (!name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }
    setSavingName(true);
    try {
      await axios.put(
        "http://localhost:8000/api/profile/update-name",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((p) => ({ ...p, name }));
      setMessage({ type: "success", text: "Name updated." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.msg || "Failed to update name." });
    } finally {
      setSavingName(false);
    }
  };

  // Update email
  const handleUpdateEmail = async () => {
    setMessage(null);
    if (!email.trim()) {
      setMessage({ type: "error", text: "Email cannot be empty." });
      return;
    }
    setSavingEmail(true);
    try {
      await axios.put(
        "http://localhost:8000/api/profile/update-email",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((p) => ({ ...p, email }));
      setMessage({ type: "success", text: "Email updated." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.msg || "Failed to update email." });
    } finally {
      setSavingEmail(false);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    setMessage(null);
    const ok = window.confirm(
      "Delete profile? This action is permanent and cannot be undone. Are you sure?"
    );
    if (!ok) return;

    try {
      await axios.delete("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      alert("Your account has been deleted.");
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete profile:", err);
      setMessage({ type: "error", text: err.response?.data?.msg || "Failed to delete profile." });
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <p className="loading-text">No user found. Please login.</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-name">Settings</h1>
          <p className="profile-email">Manage your account</p>
        </div>

        <div className="profile-body">
          {message && (
            <div className={`settings-message ${message.type === "success" ? "success" : "error"}`}>
              {message.text}
            </div>
          )}

          {/* Update Name */}
          <div className="settings-row">
            <label className="info-label">Update Username</label>
            <div className="settings-row-inline">
              <input
                className="settings-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <button
                className="apply-button"
                type="button"
                onClick={handleUpdateName}
                disabled={savingName}
              >
                {savingName ? "Saving..." : "Update Name"}
              </button>
            </div>
          </div>

          {/* Update Email */}
          <div className="settings-row">
            <label className="info-label">Update Email</label>
            <div className="settings-row-inline">
              <input
                className="settings-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <button
                className="apply-button"
                type="button"
                onClick={handleUpdateEmail}
                disabled={savingEmail}
              >
                {savingEmail ? "Saving..." : "Update Email"}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Profile */}
        <div className="profile-footer">
          <button className="apply-button danger-button" onClick={handleDeleteProfile}>
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

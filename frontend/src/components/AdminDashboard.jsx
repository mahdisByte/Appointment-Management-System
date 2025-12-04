import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch pending applications
  const fetchPendingApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token"); // Assuming you store the admin token
      const res = await axios.get("http://localhost:8000/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Error fetching applications", error);
      setError("Failed to fetch applications. Please ensure you are logged in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.post(`http://localhost:8000/api/admin/applications/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the list after approval
      fetchPendingApplications();
    } catch (error) {
      console.error("Error approving application", error);
      alert("Failed to approve application.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.post(`http://localhost:8000/api/admin/applications/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the list after rejection
      fetchPendingApplications();
    } catch (error) {
      console.error("Error rejecting application", error);
      alert("Failed to reject application.");
    }
  };

  if (loading) {
    return <div className="admin-dashboard"><h1>Loading Applications...</h1></div>;
  }

  if (error) {
    return <div className="admin-dashboard"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Pending Provider Applications</h1>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Full Legal Name</th>
            <th>Document</th>
            <th>Applied On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.user.name}</td>
                <td>{app.user.email}</td>
                <td>{app.real_name}</td>
                <td>
                  <a href={app.document_url} target="_blank" rel="noopener noreferrer" className="view-doc-btn">
                    View Document
                  </a>
                </td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="approve-btn" onClick={() => handleApprove(app.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(app.id)}>Reject</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No pending applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

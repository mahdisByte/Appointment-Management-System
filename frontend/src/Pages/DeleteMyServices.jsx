import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DeleteServices.css";

const DeleteMyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get JWT auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch services created by the logged-in user
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/my-services",
        { headers: getAuthHeaders() }
      );
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Fetch user services failed:", err);
      alert("Failed to fetch your services");
    } finally {
      setLoading(false);
    }
  };

  // Delete a service
  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/services/${id}`, {
        headers: getAuthHeaders(),
      });
      setServices((prev) => prev.filter((s) => s.services_id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete service");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="delete-services-container">
      <h1>My Services</h1>

      {loading ? (
        <p>Loading your services...</p>
      ) : services.length === 0 ? (
        <p>You have not created any services yet.</p>
      ) : (
        <ul className="services-list">
          {services.map((service) => (
            <li key={service.services_id} className="service-item">
              <div className="service-info">
                <strong>{service.name}</strong> - {service.location}
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteService(service.services_id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteMyServices;

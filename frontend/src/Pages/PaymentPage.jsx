import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/PaymentPage.css";

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    booking_id: bookingId || "",
    payment_method: "bank",
    amount_paid: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login first.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/addPayment",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setMessage(res.data.message || "Payment successful!");
        setTimeout(() => navigate("/homepage"), 1500);
      } else {
        setError(res.data.message || "Payment failed.");
      }
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message ||
          "Payment failed. Maybe your token expired or booking is invalid."
      );
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-form">
        <h2>Payment</h2>
        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label>Booking ID</label>
            <input
              type="number"
              name="booking_id"
              value={formData.booking_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="bkash">Bkash</option>
            </select>
          </div>

          <div className="input-wrapper">
            <label>Amount Paid</label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <button type="submit">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;

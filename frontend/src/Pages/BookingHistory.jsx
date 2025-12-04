import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookingHistory.css"; // Import the CSS file

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view bookings.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Bookings:", res.data.bookings); // ✅ Debugging
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="info">Loading your bookings...</p>;
  if (error) return <p className="error">{error}</p>;
  if (bookings.length === 0) return <p className="info">No bookings found.</p>;

  return (
    <div className="booking-history-container">
      <h2 className="title">Booking History</h2>
      <div className="booking-list">
        {bookings.map((b) => {
          // ✅ Safe values
          const status = (b.status ?? "").toString().toLowerCase();
          const payment = (b.payment_status ?? "").toString().toLowerCase();

          return (
            <div className="booking-card" key={b.booking_id}>
              <img
                src={
                  b.profile_picture
                    ? `http://localhost:8000/storage/${b.profile_picture}`
                    : "/default.jpeg"
                }
                alt="Provider"
                className="provider-image"
              />
              <div className="booking-info">
                <p>
                  <strong>Service:</strong> {b.service_name || b.services_id}
                </p>
                <p>
                  <strong>Booking Time:</strong> {b.booking_time}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status ${
                      status === "completed" ? "completed" : "pending"
                    }`}
                  >
                    {b.status ?? "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  <span
                    className={`payment ${
                      payment === "paid" ? "paid" : "unpaid"
                    }`}
                  >
                    {b.payment_status ?? "N/A"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;

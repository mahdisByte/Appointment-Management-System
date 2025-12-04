import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ServiceBooked.css";

const ServiceBooked = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableIds, setAvailableIds] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/provider-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (action === "available") {
        setAvailableIds((prev) => [...prev, id]);
      }

      fetchBookings();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} booking.`);
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading bookings...</p>;
  }

  return (
    <div className="service-page-container">
      <div className="service-booked-container">
        <h1>Bookings for Your Services</h1>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found for your services.</p>
        ) : (
          <div className="table-wrapper">
            <table className="service-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Service Name</th>
                  <th>Booked By</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isConfirmed = Number(booking.status) === 1;
                  const isAvailable = availableIds.includes(booking.booking_id);

                  return (
                    <tr key={booking.booking_id}>
                      <td>{booking.booking_id}</td>
                      <td>{booking.service_name}</td>
                      <td>{booking.booked_by}</td>
                      <td>{booking.booking_time}</td>
                      <td>
                        {isConfirmed ? (
                          <span className="status-confirmed">Confirmed</span>
                        ) : (
                          <span className="status-pending">Pending</span>
                        )}
                      </td>
                      <td>
                        {booking.payment_status ? (
                          <span className="payment-paid">Paid</span>
                        ) : (
                          <span className="payment-unpaid">Unpaid</span>
                        )}
                      </td>
                      <td>
                        {!isConfirmed && (
                          <button
                            onClick={() => handleAction(booking.booking_id, "confirm")}
                            className="action-button button-confirm"
                          >
                            Confirm
                          </button>
                        )}

                        {!isAvailable ? (
                          <button
                            onClick={() => handleAction(booking.booking_id, "available")}
                            className="action-button button-available"
                          >
                            Available
                          </button>
                        ) : (
                          <span className="service-available-text">Service Available</span>
                        )}

                        {!isConfirmed && (
                          <button
                            onClick={() => handleAction(booking.booking_id, "cancel")}
                            className="action-button button-cancel"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; 2025 My Service Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default ServiceBooked;

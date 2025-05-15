import React, { useEffect, useState } from "react";
import "./styles/Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    const fetchBookings = async () => {
      try {
        if (!storedUser) return;
        const response = await fetch(
          `http://localhost:5000/api/booking/${storedUser.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setBookings(data);
        } else {
          console.error("Error fetching bookings:", data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  if (!user) {
    return <div className="profile-container">Please log in to view profile.</div>;
  }

  return (
    <div className="page-container">
      <header className="profile-header">
        <h1>{user.fullName}'s events</h1>
        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </header>
      <main className="profile-main">
        <section className="profile-info">
          <h2>Profile Information</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </section>
        <section className="profile-bookings">
          <h2>My Bookings</h2>
          {bookings.length > 0 ? (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-content">
                    <h3>{booking.eventName}</h3>
                    <p>Tickets: {booking.tickets}</p>
                    <p>Booked At: {new Date(booking.bookedAt).toLocaleString()}</p>
                  </div>
                  {booking.eventImage && (
                    <div className="event-image-card">
                      <img src={`http://localhost:5000${booking.eventImage}`} alt={booking.eventName} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-bookings-message">You have no bookings yet.</p>
          )}
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2025 Event Booking System. All rights reserved.</p>
        <p className="footer-text">Terms of Service | Privacy Policy</p>
      </footer>
    </div>
  );
}

export default Profile;

import "./styles/Booking.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;
  const [tickets, setTickets] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Automatically set the selected event ID from the event passed via state
  const selectedEventId = event?._id;

  const priceNumber = parseFloat(event?.price) || 0;
  const total = (priceNumber * tickets).toFixed(2);

  const handleBooking = async () => {
    if (!selectedEventId) {
      setError('No event selected');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId: selectedEventId, tickets, eventName: event.name, eventImage: event.image, username: user.fullName }),
      });

      const data = await response.json();

     if (response.ok) {
  setMessage(data.message);

  // Save to localStorage so profile page can retrieve it
  const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const newBooking = {
    userEmail: user.email,
    eventName: event.name,
    eventImage: event.image,
    eventDate: event.date,
    eventLocation: event.location,
    ticketCount: tickets,
  };
  localStorage.setItem("bookings", JSON.stringify([...storedBookings, newBooking]));

  navigate('/congratulations', {
    state: {
      eventImage: event.image,
      eventName: event.name,
    },
  });
}
 else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  if (!event) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>No event selected</h2>
        <button onClick={() => navigate("/")}>Go Back to Home</button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <img src={`http://localhost:5000${event.image}`} alt={event.name} className="booking-image" />
      <h2>Book: {event?.name}</h2>
      <p className="event-meta">
        {event?.date} · {event?.location}
      </p>
      <p className="event-price">Price per ticket: {event?.price}</p>
      <h3 className="booking-title">Booking Details</h3>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <label>
        Number of Tickets:
        <input
          type="number"
          min="1"
          defaultValue="1"
          required
          onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
        />
      </label>
      <p className="total-price">Total: ${total}</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <button className="booking-btn" type="submit" onClick={handleBooking}>
        Confirm Booking
      </button>
    </div>
  );
}

export default Booking;

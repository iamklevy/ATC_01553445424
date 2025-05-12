import "./styles/Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [bookedEventIds, setBookedEventIds] = useState([]); // Store IDs of booked events

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return; // If no user is logged in, skip fetching bookings
      try {
        const response = await fetch(`http://localhost:5000/api/booking/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          // Extract event IDs from the user's bookings
          const bookedIds = data.map((booking) => Number(booking.eventId));
          console.log("Booked Event IDs:", bookedIds); // Debugging
          setBookedEventIds(bookedIds);
        } else {
          console.error("Error fetching bookings:", data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const events = [
    {
      id: 1,
      name: "Apple Silicon - Peak Performance",
      date: "September 30, 2023",
      location: "Apple Park, Cupertino, CA",
      description:
        "Apple Inc. is hosting its annual event to unveil new products and software updates.",
      price: "$199",
      image: require("../images/Apple-event.jpg"),
    },
    {
      id: 2,
      name: "Fortnite Chapter 3",
      date: "September 9, 2023",
      location: "Fortnite Battle Royal Island",
      description:
        "Epic Games is hosting a special in-game event for Fortnite players.",
      price: "$99",
      image: require("../images/fortnite-event.jpg"),
    },
    {
      id: 3,
      name: "Tesla Model Y Launch",
      date: "October 5, 2022",
      location: "Tesla Gigafactory, Austin, TX",
      description:
        "Tesla is hosting an event to showcase its latest electric vehicles and technology.",
      price: "$60",
      image: require("../images/tesla-event.jpg"),
    },
    {
      id: 4,
      name: "Harris vs Trump Presidential Debate",
      date: "October 5, 2024",
      location: "madison square garden, new york",
      description:
        "The presidential campaign event featuring Kamala Harris and Donald Trump.",
      price: "$35",
      image: require("../images/Harris-Trump-event.jpg"),
    },
    {
      id: 5,
      name: "SpaceX x horizon",
      date: "October 5, 2023",
      location: "SpaceX Launch Site, Cape Canaveral, FL",
      description:
        "SpaceX is hosting a launch event for its latest rocket and satellite mission.",
      price: "FREE",
      image: require("../images/spacex-event.png"),
    },
    {
      id: 6,
      name: "Lady Gaga - Mayhem",
      date: "October 5, 2025",
      location: "horizon stadium, los angeles",
      description:
        "Lady Gaga is performing live at horizon Stadium as part of her Mayhem Tour.",
      price: "$699",
      image: require("../images/ladygaga-event.png"),
    },
    {
      id: 7,
      name: "TheWeeknd - After Hours",
      date: "October 5, 2024",
      location: "MetLife Stadium, East Rutherford, NJ",
      description:
        "The Weeknd is performing live at MetLife Stadium as part of his After Hours Tour.",
      price: "235$",
      image: require("../images/theweeknd-event.jpg"),
    },
    {
      id: 8,
      name: "Travis Scott - Utopia",
      date: "September 23, 2023",
      location: "las vegas, nevada",
      description:
        "Travis Scott is performing live at las vegas T-mobile stadium as part of his Utopia Tour.",
      price: "$599",
      image: require("../images/travisscott-event.jpg"),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="header-bar">
        <div className="greeting">
          {user ? `Hi, ${user.fullName}` : "Welcome"}
        </div>

        {user ? (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
      <div className="event-gallery-container">
        {events.map((event) => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => setSelectedEvent(event)}
          >
            {bookedEventIds.includes(event.id) ? (
              <div className="booked-tag">Booked</div> // Show "Booked" tag if the event is booked
            ) : (
              <div className="price-badge">{event.price}</div> // Show price tag if the event is not booked
            )}
            <img src={event.image} alt={event.name} className="gallery-image" />
            <h3 className="event-name">{event.name}</h3>
            <p className="event-meta">
              {event.date} . {event.location}
            </p>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="event-modal" onClick={() => setSelectedEvent(null)}>
          <div
            className="event-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {bookedEventIds.includes(selectedEvent.id) ? (
              <div className="booked-tag">Booked</div> // Show "Booked" tag if the event is booked
            ) : (
              <p className="price-badge">{selectedEvent.price}</p> // Show price tag if the event is not booked
            )}
            <div className="modal-image-container">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="modal-image"
              />
            </div>

            <h2 className="event-name">{selectedEvent.name}</h2>
            <p className="event-meta">
              {selectedEvent.date} . {selectedEvent.location}
            </p>
            <p className="event-description">{selectedEvent.description}</p>
            {!bookedEventIds.includes(selectedEvent.id) && (
              <button
                className="book-now-button"
                onClick={() =>
                  navigate(`/booking/${selectedEvent.id}`, {
                    state: { event: selectedEvent },
                  })
                }
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      )}
      <div className="footer">
        <p className="footer-text">
          © 2025 Event Booking System. All rights reserved.
        </p>
        <p className="footer-text">Terms of Service | Privacy Policy</p>
      </div>
    </div>
  );
}

export default Home;

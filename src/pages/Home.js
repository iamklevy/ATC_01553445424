import "./styles/Home.css";
import "./styles/Themes.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [bookedEventIds, setBookedEventIds] = useState([]); // Store IDs of booked events
  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]); // Store categories fetched from the server
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch categories and bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return; // If no user is logged in, skip fetching bookings
      try {
        const response = await fetch(
          `http://localhost:5000/api/booking/${user.id}`
        );
        const data = await response.json();
        if (response.ok) {
          // Extract event IDs from the user's bookings
          const bookedIds = data.map((booking) => booking.eventId);
          console.log("Booked Event IDs:", bookedIds);
          setBookedEventIds(bookedIds);
        } else {
          console.error("Error fetching bookings:", data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetch("http://localhost:5000/api/admin/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    fetchBookings();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.body.classList.remove("dark");
    setUser(null);
    navigate("/login");
  };

  // Fetch events when the component mounts
  const fetchEvents = useCallback(
    async (pageToFetch) => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/events?page=${page}&limit=6`
        );
        const data = await res.json();

        if (data.length === 0) {
          setHasMore(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e._id));
            const newEvents = data.filter((e) => !existingIds.has(e._id));
            return [...prev, ...newEvents];
          });
          setPage(pageToFetch + 1);
        }
      } catch (error) {
        console.error("Error fetching paginated events:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page]
  );

  //lazy loading
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !loading && hasMore) {
        fetchEvents(page);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchEvents, page, loading, hasMore]);

  // Filter events based on selected category and price range
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      categoryFilter === "All" || event.category === categoryFilter;
    const matchesPrice = event.price >= minPrice && event.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  // Fetch events page-01 when the component mounts
  useEffect(() => {
    fetchEvents(1);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page-wrapper">
      <div className="header-bar">
        <div className="greeting">
          {user ? `Hi, ${user.fullName}` : "Welcome"}
        </div>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="dark-light-toggle-btn"
        >
          <img
            src={darkMode ? "/light-mode.png" : "/dark-mode.png"}
            alt={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: 24, height: 24 }}
          />
        </button>

        {user ? (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
            {user.role === "admin" && (
              <button className="login-btn" onClick={() => navigate("/admin")}>
                Admin Panel
              </button>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
      <div className="filter-bar sticky-filter">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) =>
            setMinPrice(e.target.value ? parseFloat(e.target.value) : 0)
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) =>
            setMaxPrice(e.target.value ? parseFloat(e.target.value) : Infinity)
          }
        />
      </div>

      {loading && <div className="loading">Loading events...</div>}

      <div className="event-gallery-container">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => setSelectedEvent(event)}
          >
            {bookedEventIds.includes(event._id) ? (
              <div className="booked-tag">Booked</div>
            ) : (
              <div className="price-badge">{`$${event.price}`}</div>
            )}
            <div className="event-image-wrapper">
              <img
                src={`http://localhost:5000${event.image}`}
                alt={event.name}
                className="event-card-image"
              />
              {event.category && (
                <span className="event-category-badge">{event.category}</span>
              )}
            </div>
            <h3 className="event-name">{event.name}</h3>
            <p className="event-meta">
              {event.date} . {event.location}
            </p>
          </div>
        ))}
      </div>
      {selectedEvent &&
        (console.log("Selected Event:", selectedEvent),
        (
          <div className="event-modal" onClick={() => setSelectedEvent(null)}>
            <div
              className="event-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {bookedEventIds.includes(selectedEvent._id) ? (
                <div className="booked-tag">Booked</div>
              ) : (
                <p className="price-badge">{`$${selectedEvent.price}`}</p>
              )}
              <div
                className="modal-image-container"
                style={{ position: "relative" }}
              >
                <img
                  src={`http://localhost:5000${selectedEvent.image}`}
                  alt={selectedEvent.name}
                  className="modal-image"
                />
                {selectedEvent.category && (
                  <span className="event-category-badge">
                    {selectedEvent.category}
                  </span>
                )}
              </div>

              <h2 className="event-name">{selectedEvent.name}</h2>
              <p className="event-meta">
                {selectedEvent.date} . {selectedEvent.location}
              </p>
              <p className="event-description">{selectedEvent.description}</p>
              {!bookedEventIds.includes(selectedEvent._id) && (
                <button
                  className="book-now-button"
                  onClick={() =>
                    navigate(`/booking/${selectedEvent._id}`, {
                      state: { event: selectedEvent },
                    })
                  }
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
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

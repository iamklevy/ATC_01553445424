import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminPanel.css";

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem("darkMode") === "true";
    });
  
    useEffect(() => {
      document.body.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    price: "",
    location: "",
    category: "",
    image: null,
  });

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/admin/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.date ||
      !formData.price ||
      !formData.location ||
      !formData.category ||
      !formData.image
    ) {
      alert("Please fill in all required fields, including the image.");
      return;
    }

    try {
      // Format the date as "Month Day, Year"
      const formattedDate = new Date(formData.date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      const payload = {
        name: formData.name,
        description: formData.description,
        date: formattedDate,
        price: formData.price,
        location: formData.location,
        category: formData.category,
        image: formData.image.name,
      };

      const response = await fetch("http://localhost:5000/api/admin/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Event created successfully!");
      fetchEvents();
      setFormData({
        name: "",
        description: "",
        date: "",
        location: "",
        category: "",
        price: "",
        image: null,
      });
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Failed to create event. Please check the server and try again.");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/admin/events/${id}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event._id === id);
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description,
        date: new Date(eventToEdit.date).toISOString().split("T")[0], 
        price: eventToEdit.price,
        location: eventToEdit.location,
        category: eventToEdit.category,
        image: null,
      });
      setCurrentEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const formattedDate = new Date(formData.date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        date: formattedDate,
        price: formData.price,
        location: formData.location,
        category: formData.category,
        image: formData.image ? `/images/${formData.image.name}` : undefined,
      };

      const response = await fetch(
        `http://localhost:5000/api/admin/events/${currentEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert("Event updated successfully!");
      setIsEditModalOpen(false);
      setCurrentEditId(null);
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to update event.");
    }
  };

  // Event categories
  const categories = [
    "Politics",
    "Art",
    "Festivals",
    "Religious",
    "Sports",
    "Food",
    "Health",
    "Travel",
    "Fashion",
    "Entertainment",
    "Science",
    "Environment",
    "History",
    "Culture",
    "Lifestyle",
    "Gaming",
    "Finance",
    "Music",
    "Technology",
    "Education",
    "Business",
    "Other",
  ];

  return (
    <div className="page-container">
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
      <button className="home-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <div className="admin-panel">
        <h2>Admin Panel</h2>
        <h3>Create Event</h3>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          placeholder="Price"
          type="number"
          value={formData.price || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: parseFloat(e.target.value) || "",
            })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />
        <button onClick={handleCreate}>Create</button>

        <div className="events-list-section">
          <h3>All Events</h3>
          {events.length > 0 ? (
            events.map((ev) => (
              <div key={ev._id} className="event-card">
                <div className="event-details">
            
                  <p className="event-name">{ev.name}</p>
                  <p className="event-meta">
                    {" "}
                    {ev.date} . {ev.location}
                  </p>

                  <span className="event-category">{ev.category}</span>
                  <p className="event-price">${ev.price}</p>

                  <div className="event-actions">
                    <button
                      className="delete-button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this event?"
                          )
                        ) {
                          handleDelete(ev._id);
                        }
                      }}
                    >
                      Delete
                    </button>

                    <button
                      className="edit-button"
                      onClick={() => {
                        handleEdit(ev._id);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {ev.image && (
                  <img
                  className="event-image"
                  src={`http://localhost:5000${ev.image}`}
                  alt={ev.name}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
      <footer className="footer">
        <p className="footer-text">
          © 2025 Event Booking System. All rights reserved.
        </p>
        <p className="footer-text">Terms of Service | Privacy Policy</p>
      </footer>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit Event</h3>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || "",
                })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button
                className="cancel-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

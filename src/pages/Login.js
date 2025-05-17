import React, { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token to localStorage for authentication
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage(data.message);

        if (data.user.role === "admin") {
          // Redirect to the Admin Panel
          navigate("/admin");
        } else {
          // Redirect to the Home page
          navigate("/");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <label className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </label>
      </form>
    </div>
  );
};

export default Login;

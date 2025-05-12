import React, { useState } from 'react';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));

      if (response.ok) {
        setMessage(data.message);
        // Save JWT token to localStorage for authentication
        localStorage.setItem('token', data.token);
        // Redirect to the Home page 
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong, please try again later.');
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

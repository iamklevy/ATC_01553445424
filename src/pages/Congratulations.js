import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Congratulations.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

const Congratulations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [width, height] = useWindowSize();
  const { eventImage, eventName } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);
  const [,setFadeOut] = useState(false);

  useEffect(() => {
    const sound = new Audio('/booking-confirmation.mp3');
    sound.play();

    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade-out
    }, 3500);

    const stopTimer = setTimeout(() => {
      setShowConfetti(false); // Remove Confetti completely
    }, 6500);

    return () => {
      clearTimeout(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div className="congrats-container">
      {showConfetti && <Confetti width={width} height={height} />}
      <h2>🎉 Congratulations!</h2>
      <p>Your booking for <strong>{eventName}</strong> is confirmed!</p>
      {eventImage && (
        <img src={`http://localhost:5000${eventImage}`} alt="Event" className="congrats-image" />
      )}
      <div className="congrats-buttons">
        <button onClick={() => navigate('/')}>Back to Home</button>
        <button onClick={() => navigate('/profile')}>See My Bookings</button>
      </div>
    </div>
  );
};

export default Congratulations;

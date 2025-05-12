const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());
//Routes
app.use('/api', authRoutes);
app.use('/api/booking', bookingRoutes);


// Basic API test route
app.get('/', (req, res) => {
  res.send('Welcome to the Event Booking API!');
});
app.get('/login', (req, res) => {
  res.send('login API is running...');
});
app.get('/signup', (req, res) => {
  res.send('signup API is running...');
});
app.get('/booking', (req, res) => {
  res.send('booking API is running...');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

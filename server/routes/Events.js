const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


// Create event
router.post('/events', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body

    if (!req.body.image) {
      throw new Error('Image filename is required.');
    }

    const imagePath = `/images/${req.body.image}`;

    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      price: req.body.price,
      location: req.body.location,
      category: req.body.category,
      image: imagePath, // Save the image path
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
});

// Read all events
router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Update event
router.put('/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,         
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });


// Delete event
router.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Event.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// @route   POST /api/booking
router.post("/", async (req, res) => {
  const { userId, username, eventId, tickets, eventName, eventImage } =
    req.body;

  try {
    if (!userId || !eventId || !tickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = new Booking({
      userId,
      username,
      eventId,
      eventName,
      eventImage,
      tickets,
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

// @route   GET /api/bookings/:userId
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Booking.find({ userId }).populate("eventId");

    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving bookings.", error: err.message });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    }, // Generate unique ID
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    price: {
      type: Number,
      required: [true, "Event price is required"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    image: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Events", eventSchema);

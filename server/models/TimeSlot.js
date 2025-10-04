// server/models/TimeSlot.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true, // e.g., 1, 2, 3
  },
  startTime: {
    type: String, // e.g., "09:00"
    required: true,
  },
  endTime: {
    type: String, // e.g., "09:50"
    required: true,
  },
  isBreak: {
    type: Boolean,
    default: false, // To mark slots like LUNCH or SHORT BREAK
  },
});

// Ensures each period number is unique
TimeSlotSchema.index({ period: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
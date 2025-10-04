// server/models/Classroom.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
}, { _id: false });

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  capacity: { type: Number, required: true },
  equipment: { type: [String], default: [] },
  roomType: { type: String, required: true, enum: ['Lecture Hall', 'Laboratory', 'Seminar Room', 'Studio', 'Computer Lab'], default: 'Lecture Hall' },
  location: { type: String, required: true, trim: true },
  availability: {
    type: [TimeSlotSchema],
    default: [
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '13:00' },
    ],
  },
  department: { type: String, trim: true }, // e.g., "CSE", "IT"
}, { timestamps: true });

// --- ADDED: Indexes for faster filtering ---
ClassroomSchema.index({ department: 1 });
ClassroomSchema.index({ roomType: 1 });
ClassroomSchema.index({ name: 'text', location: 'text' }); // Text index for searching

module.exports = mongoose.model('Classroom', ClassroomSchema);
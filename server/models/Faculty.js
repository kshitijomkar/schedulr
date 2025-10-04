// server/models/Faculty.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { _id: false });

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a faculty name'],
    trim: true,
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide an employee ID'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  department: {
    type: String,
    required: [true, 'Please specify the department'],
  },
  subjectsTaught: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
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
}, {
  timestamps: true,
});

// --- ADDED: Indexes for faster filtering and searching ---
FacultySchema.index({ name: 'text' }); // Text index for optimized name search
FacultySchema.index({ department: 1 });

module.exports = mongoose.model('Faculty', FacultySchema);
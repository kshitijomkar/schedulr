// server/models/ScheduledClass.js
const mongoose = require('mongoose');

const ScheduledClassSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  // THE CHANGE: Now links to a specific TimeSlot document
  timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
  sessionType: { type: String, required: true, enum: ['Lecture', 'Lab', 'Tutorial', 'Activity'] },
  
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  // THE CHANGE: 'faculty' is now an array to support multiple teachers
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }],
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },

  labBatchNumber: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('ScheduledClass', ScheduledClassSchema);
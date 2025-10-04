// server/models/Subject.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  semester: { type: Number, required: true }, // e.g., 1, 2, 3...
  department: { type: String, required: true }, // e.g., "CSE", "IT"
  lectureHours: { type: Number, default: 0 },
  labHours: { type: Number, default: 0 },
  tutorialHours: { type: Number, default: 0 },
  courseType: { type: String, enum: ['Core', 'Professional Elective', 'Open Elective', 'Skill'], default: 'Core' },
}, { timestamps: true });

// --- ADDED: Indexes for faster filtering and searching ---
SubjectSchema.index({ name: 'text', code: 'text' }); // Text index for optimized search
SubjectSchema.index({ department: 1 });
SubjectSchema.index({ semester: 1 });
SubjectSchema.index({ courseType: 1 });

module.exports = mongoose.model('Subject', SubjectSchema);
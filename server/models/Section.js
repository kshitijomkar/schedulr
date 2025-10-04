// server/models/Section.js

const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Please specify the year (1-4)'],
    min: 1,
    max: 4,
  },
  semester: {
    type: Number,
    required: [true, 'Please specify the semester'],
  },
  department: {
    type: String,
    required: [true, 'Please specify the department'],
  },
  sectionName: {
    type: String,
    required: [true, 'Please specify the section name (e.g., A, B)'],
    trim: true,
    uppercase: true,
  },
  studentCount: {
    type: Number,
    required: [true, 'Please provide the number of students'],
  },
  numLabBatches: {
    type: Number,
    default: 2,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
}, {
  timestamps: true,
});

// Ensures that each section (e.g., Year 3, CSE, Section A) is unique for a given semester
SectionSchema.index({ year: 1, semester: 1, department: 1, sectionName: 1 }, { unique: true });

module.exports = mongoose.model('Section', SectionSchema);
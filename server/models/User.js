// server/models/User.js

const mongoose = require('mongoose');

// Define the schema for the User collection
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // Each email must be unique
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Do not return the password by default when querying for a user
  },
  role: {
    type: String,
    enum: ['Admin', 'Scheduler'], // The role must be one of these values
    default: 'Scheduler', // Default role for new users
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
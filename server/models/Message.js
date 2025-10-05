// server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  message: { type: String, trim: true },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
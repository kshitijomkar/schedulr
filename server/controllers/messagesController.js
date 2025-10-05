// server/controllers/messagesController.js
const Message = require('../models/Message.js');
const asyncHandler = require('../middleware/asyncHandler.js');

const createMessage = asyncHandler(async (req, res) => {
  const { name, email, institution, message } = req.body;
  
  if (!name || !email || !institution) {
    res.status(400);
    throw new Error('Please provide name, email, and institution');
  }

  const newMessage = await Message.create({ name, email, institution, message });

  if (newMessage) {
    res.status(201).json({ message: 'Message received successfully!' });
  } else {
    res.status(400);
    throw new Error('Invalid message data');
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (for any logged-in user)
const getMessages = asyncHandler(async (req, res) => {
  // The role check has been removed.
  // The 'protect' middleware still ensures a user must be logged in.
  
  const messages = await Message.find({}).sort({ submittedAt: -1 });
  res.status(200).json(messages);
});

module.exports = {
  createMessage,
  getMessages,
};
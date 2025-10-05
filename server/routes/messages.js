// server/routes/messages.js
const express = require('express');
const { createMessage, getMessages } = require('../controllers/messagesController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Define the routes
router.route('/').post(createMessage).get(protect, getMessages);

// Export the router using module.exports
module.exports = router;
// server/routes/auth.js

const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes for user authentication
router.post('/register', register);
router.post('/login', login);

// Protected route to get user profile
router.get('/me', protect, getMe);

module.exports = router;
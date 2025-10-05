// server/routes/health.js

const express = require('express');
const router = express.Router();

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

module.exports = router;
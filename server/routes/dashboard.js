const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const router = express.Router();
// You should protect this route to ensure only logged-in users can access it.
// Assuming you have an `auth` middleware named `protect`.
// const { protect } = require('../middleware/auth');

// router.route('/stats').get(protect, getDashboardStats);
router.route('/stats').get(getDashboardStats); // Without auth for now, add it as needed

module.exports = router;
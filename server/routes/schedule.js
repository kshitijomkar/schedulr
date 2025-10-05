// server/routes/schedule.js

const express = require('express');
const router = express.Router();

const { generateSchedule, getSchedule } = require('../controllers/schedule');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getSchedule); // The new GET route
router.route('/generate').post(generateSchedule);

module.exports = router;
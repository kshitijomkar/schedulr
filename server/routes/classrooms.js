// server/routes/classrooms.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  exportClassrooms,
  importClassrooms, // Import the new function
} = require('../controllers/classrooms');

const { protect } = require('../middleware/auth');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(protect);

router.route('/export').get(exportClassrooms);
// Add the new import route with the upload middleware
router.route('/import').post(upload.single('file'), importClassrooms);

router.route('/')
  .get(getClassrooms)
  .post(createClassroom);

router.route('/:id')
  .put(updateClassroom)
  .delete(deleteClassroom);

module.exports = router;
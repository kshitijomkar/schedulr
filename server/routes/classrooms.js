// server/routes/classrooms.js

const express = require('express');
const router = express.Router();

const {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  exportClassrooms,
  importClassrooms,
} = require('../controllers/classrooms');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadValidator');

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
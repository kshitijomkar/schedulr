// server/routes/subjects.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getSubjects, createSubject, updateSubject, deleteSubject, exportSubjects, importSubjects } = require('../controllers/subjects');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(protect);

router.route('/export').get(exportSubjects);
router.route('/import').post(upload.single('file'), importSubjects);

router.route('/').get(getSubjects).post(createSubject);
router.route('/:id').put(updateSubject).delete(deleteSubject);

module.exports = router;
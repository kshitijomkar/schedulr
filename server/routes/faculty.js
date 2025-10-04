// server/routes/faculty.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getFaculty, createFaculty, updateFaculty, deleteFaculty, exportFaculty, importFaculty } = require('../controllers/faculty');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(protect);

router.route('/export').get(exportFaculty);
router.route('/import').post(upload.single('file'), importFaculty);

router.route('/').get(getFaculty).post(createFaculty);
router.route('/:id').put(updateFaculty).delete(deleteFaculty);

module.exports = router;
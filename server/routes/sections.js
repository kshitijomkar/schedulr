// server/routes/sections.js
const express = require('express');
const router = express.Router();
const { getSections, createSection, updateSection, deleteSection, exportSections, importSections } = require('../controllers/sections');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadValidator');

router.use(protect);

router.route('/export').get(exportSections);
router.route('/import').post(upload.single('file'), importSections);

router.route('/').get(getSections).post(createSection);
router.route('/:id').put(updateSection).delete(deleteSection);

module.exports = router;
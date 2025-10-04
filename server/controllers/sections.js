// server/controllers/sections.js
const Section = require('../models/Section');
const Subject = require('../models/Subject'); // ADDED: For import logic
const ExcelJS = require('exceljs');
const asyncHandler = require('../middleware/asyncHandler'); // ADDED: Async handler

exports.getSections = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortKey, sortDirection, search, department } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { sectionName: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } } // Also search by department
    ];
  }
  if (department) query.department = { $in: department.split(',') };
  const sort = {};
  if (sortKey) sort[sortKey] = sortDirection === 'desc' ? -1 : 1;
  else { sort.year = 1; sort.department = 1; sort.sectionName = 1; }
  const sections = await Section.find(query)
    .populate('subjects')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const total = await Section.countDocuments(query);
  res.status(200).json({ success: true, count: sections.length, total, data: sections });
});

// --- UPDATED: Enhanced import logic to link subjects ---
exports.importSections = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const sectionsToImport = [];
    const promises = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
            const promise = (async () => {
                const subjectCodesValue = row.getCell(7).value; // Assumes subject codes in column 7
                let subjectIds = [];
                if (subjectCodesValue) {
                    const subjectCodes = String(subjectCodesValue).split(',').map(code => code.trim());
                    const foundSubjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
                    subjectIds = foundSubjects.map(s => s._id);
                }
                const rowData = {
                    year: row.getCell(1).value,
                    semester: row.getCell(2).value,
                    department: row.getCell(3).value,
                    sectionName: row.getCell(4).value,
                    studentCount: row.getCell(5).value,
                    numLabBatches: row.getCell(6).value,
                    subjects: subjectIds,
                };
                if (rowData.year && rowData.department && rowData.sectionName) {
                    sectionsToImport.push(rowData);
                }
            })();
            promises.push(promise);
        }
    });
    
    await Promise.all(promises);

    if (sectionsToImport.length > 0) {
        await Section.insertMany(sectionsToImport, { ordered: false });
    }
    res.status(201).json({ success: true, message: `${sectionsToImport.length} sections imported successfully.` });
});


// --- Other CRUD functions also wrapped in asyncHandler ---

exports.exportSections = asyncHandler(async (req, res, next) => {
  const sections = await Section.find().populate('subjects', 'name code').sort({ year: 1 });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sections');
  worksheet.columns = [
    { header: 'Year', key: 'year', width: 10 },
    { header: 'Semester', key: 'semester', width: 10 },
    { header: 'Department', key: 'department', width: 25 },
    { header: 'Section', key: 'sectionName', width: 10 },
    { header: 'Student Count', key: 'studentCount', width: 15 },
    { header: 'Lab Batches', key: 'numLabBatches', width: 15 },
    { header: 'Subjects (Codes)', key: 'subjects', width: 70 },
  ];
  sections.forEach(section => {
    worksheet.addRow({
      ...section.toObject(),
      subjects: section.subjects.map(s => s.code).join(', '),
    });
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sections.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

exports.createSection = asyncHandler(async (req, res, next) => {
  const section = await Section.create(req.body);
  res.status(201).json({ success: true, data: section });
});

exports.updateSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.status(200).json({ success: true, data: section });
});

exports.deleteSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findByIdAndDelete(req.params.id);
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
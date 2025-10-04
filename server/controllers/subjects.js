// server/controllers/subjects.js
const Subject = require('../models/Subject');
const ExcelJS = require('exceljs');
const asyncHandler = require('../middleware/asyncHandler');

exports.getSubjects = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortKey, sortDirection, search, department, courseType } = req.query;
  const query = {};

  if (search) {
    // UPDATED: Using the text index for faster searches on name and code
    query.$text = { $search: search };
  }
  if (department) query.department = { $in: department.split(',') };
  if (courseType) query.courseType = { $in: courseType.split(',') };

  const sort = {};
  if (sortKey) sort[sortKey] = sortDirection === 'desc' ? -1 : 1;
  else sort.code = 1;

  const subjects = await Subject.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Subject.countDocuments(query);

  res.status(200).json({ success: true, count: subjects.length, total, data: subjects });
});

exports.createSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
});

exports.updateSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.status(200).json({ success: true, data: subject });
});

exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

exports.exportSubjects = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find().sort({ code: 1 });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Subjects');
  worksheet.columns = [
    { header: 'Code', key: 'code', width: 15 },
    { header: 'Name', key: 'name', width: 40 },
    { header: 'Semester', key: 'semester', width: 15 },
    { header: 'Department', key: 'department', width: 25 },
    { header: 'Course Type', key: 'courseType', width: 20 },
    { header: 'Lecture Hours', key: 'lectureHours', width: 15 },
    { header: 'Lab Hours', key: 'labHours', width: 15 },
    { header: 'Tutorial Hours', key: 'tutorialHours', width: 15 },
  ];
  worksheet.addRows(subjects.map(subject => subject.toObject()));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=subjects.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

exports.importSubjects = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const subjectsToImport = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
            const rowData = {
                name: row.getCell(1).value,
                code: row.getCell(2).value,
                semester: row.getCell(3).value,
                department: row.getCell(4).value,
                lectureHours: row.getCell(5).value,
                labHours: row.getCell(6).value,
                tutorialHours: row.getCell(7).value,
                courseType: row.getCell(8).value,
            };
            if (rowData.name && rowData.code) {
                subjectsToImport.push(rowData);
            }
        }
    });
    if (subjectsToImport.length > 0) {
        await Subject.insertMany(subjectsToImport, { ordered: false });
    }
    res.status(201).json({ success: true, message: `${subjectsToImport.length} subjects imported successfully.` });
});
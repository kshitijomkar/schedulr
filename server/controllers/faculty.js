const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const ExcelJS = require('exceljs');
const asyncHandler = require('../middleware/asyncHandler');
const { escapeRegex } = require('../utils/sanitize');

exports.getFaculty = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortKey, sortDirection, search, department } = req.query;
  const query = {};

  if (search) {
    const sanitizedSearch = escapeRegex(search);
    query.$or = [
      { name: { $regex: sanitizedSearch, $options: 'i' } },
      { employeeId: { $regex: sanitizedSearch, $options: 'i' } },
      { email: { $regex: sanitizedSearch, $options: 'i' } },
    ];
  }
  if (department) query.department = { $in: department.split(',') };

  const sort = {};
  if (sortKey) sort[sortKey] = sortDirection === 'desc' ? -1 : 1;
  else sort.name = 1;

  const faculty = await Faculty.find(query)
    .populate('subjectsTaught')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Faculty.countDocuments(query);

  res.status(200).json({ success: true, count: faculty.length, total, data: faculty });
});

// --- UPDATED: Enhanced import logic to link subjects ---
exports.importFaculty = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const facultyToImport = [];
    const promises = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
            const promise = (async () => {
                const subjectCodesValue = row.getCell(5).value; // Assumes codes are in column 5
                let subjectIds = [];
                if (subjectCodesValue) {
                    const subjectCodes = String(subjectCodesValue).split(',').map(code => code.trim());
                    const foundSubjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
                    subjectIds = foundSubjects.map(s => s._id);
                }
                const rowData = {
                    name: row.getCell(1).value,
                    employeeId: row.getCell(2).value,
                    email: row.getCell(3).value,
                    department: row.getCell(4).value,
                    subjectsTaught: subjectIds,
                };
                if (rowData.name && rowData.employeeId && rowData.email && rowData.department) {
                    facultyToImport.push(rowData);
                }
            })();
            promises.push(promise);
        }
    });

    await Promise.all(promises);

    if (facultyToImport.length > 0) {
        await Faculty.insertMany(facultyToImport, { ordered: false });
    }
    res.status(201).json({ success: true, message: `${facultyToImport.length} faculty members imported successfully.` });
});


// --- Other CRUD functions also wrapped in asyncHandler ---

exports.exportFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.find().populate('subjectsTaught', 'name code').sort({ name: 1 });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Faculty');
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Employee ID', key: 'employeeId', width: 15 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Department', key: 'department', width: 25 },
    { header: 'Subjects Taught (Codes)', key: 'subjectsTaught', width: 50 },
  ];
  faculty.forEach(member => {
    worksheet.addRow({
      ...member.toObject(),
      subjectsTaught: member.subjectsTaught.map(s => s.code).join(', '),
    });
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=faculty.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

exports.createFaculty = asyncHandler(async (req, res, next) => {
  const facultyMember = await Faculty.create(req.body);
  res.status(201).json({ success: true, data: facultyMember });
});

exports.updateFaculty = asyncHandler(async (req, res, next) => {
  const facultyMember = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!facultyMember) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.status(200).json({ success: true, data: facultyMember });
});

exports.deleteFaculty = asyncHandler(async (req, res, next) => {
  const facultyMember = await Faculty.findByIdAndDelete(req.params.id);
  if (!facultyMember) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
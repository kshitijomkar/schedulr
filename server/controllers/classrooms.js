// server/controllers/classrooms.js
const Classroom = require('../models/Classroom');
const ExcelJS = require('exceljs');
const asyncHandler = require('../middleware/asyncHandler');

exports.getClassrooms = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortKey, sortDirection, search, roomType, department } = req.query;
  const query = {};

  if (search) {
    // UPDATED: Using the text index for faster searches on name and location
    query.$text = { $search: search };
  }
  if (roomType) query.roomType = { $in: roomType.split(',') };
  if (department) query.department = { $in: department.split(',') };

  const sort = {};
  if (sortKey) sort[sortKey] = sortDirection === 'desc' ? -1 : 1;
  else sort.name = 1;

  const classrooms = await Classroom.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Classroom.countDocuments(query);

  res.status(200).json({ success: true, count: classrooms.length, total, data: classrooms });
});

exports.exportClassrooms = asyncHandler(async (req, res, next) => {
  const classrooms = await Classroom.find().sort({ name: 1 });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Classrooms');
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Capacity', key: 'capacity', width: 15 },
    { header: 'Room Type', key: 'roomType', width: 20 },
    { header: 'Location', key: 'location', width: 30 },
    { header: 'Department', key: 'department', width: 25 },
    { header: 'Equipment', key: 'equipment', width: 40 },
  ];
  classrooms.forEach(classroom => {
    worksheet.addRow({ ...classroom.toObject(), equipment: classroom.equipment.join(', ') });
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + 'classrooms.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

exports.importClassrooms = asyncHandler(async (req, res, next) => {
  if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  const worksheet = workbook.getWorksheet(1);
  const classroomsToImport = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
          const rowData = {
              name: row.getCell(1).value,
              capacity: row.getCell(2).value,
              roomType: row.getCell(3).value,
              location: row.getCell(4).value,
              department: row.getCell(5).value,
              equipment: row.getCell(6).value ? String(row.getCell(6).value).split(',').map(item => item.trim()) : [],
          };
          if (rowData.name && rowData.capacity && rowData.roomType && rowData.location) {
              classroomsToImport.push(rowData);
          }
      }
  });

  if (classroomsToImport.length > 0) {
      await Classroom.insertMany(classroomsToImport, { ordered: false });
  }
  res.status(201).json({ success: true, message: `${classroomsToImport.length} classrooms imported successfully.` });
});

exports.createClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.create(req.body);
  res.status(201).json({ success: true, data: classroom });
});

exports.updateClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!classroom) {
    return res.status(404).json({ success: false, message: 'Classroom not found' });
  }
  res.status(200).json({ success: true, data: classroom });
});

exports.deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);
  if (!classroom) {
    return res.status(404).json({ success: false, message: 'Classroom not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
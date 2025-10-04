const Classroom = require('../models/Classroom');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Section = require('../models/Section');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get aggregated statistics for the dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Use Promise.all to run all database queries concurrently
  const [
    totalClassrooms,
    totalFaculty,
    totalSubjects,
    totalSections,
    classroomStats,
    sectionStats,
    subjectStats,
    uniqueFacultyDepts,
    uniqueSectionDepts,
    uniqueSubjectDepts,
    uniqueCourseTypes
  ] = await Promise.all([
    Classroom.countDocuments(),
    Faculty.countDocuments(),
    Subject.countDocuments(),
    Section.countDocuments(),
    // Aggregate total capacity and get unique locations
    Classroom.aggregate([
      { $group: { _id: null, totalCapacity: { $sum: '$capacity' } } },
      { $project: { _id: 0, totalCapacity: 1 } }
    ]),
    // Aggregate total students
    Section.aggregate([
      { $group: { _id: null, totalStudents: { $sum: '$studentCount' } } },
      { $project: { _id: 0, totalStudents: 1 } }
    ]),
    // Aggregate total lecture hours
    Subject.aggregate([
      { $group: { _id: null, totalLectureHours: { $sum: '$lectureHours' } } },
      { $project: { _id: 0, totalLectureHours: 1 } }
    ]),
    // Get unique department values from each collection
    Faculty.distinct('department'),
    Section.distinct('department'),
    Subject.distinct('department'),
    Subject.distinct('courseType'),
  ]);

  // Combine unique departments from all sources
  const allDepartments = new Set([
    ...uniqueFacultyDepts, 
    ...uniqueSectionDepts, 
    ...uniqueSubjectDepts
  ]);

  // Get unique locations from the classroom model directly
  const totalLocations = (await Classroom.distinct('location')).length;

  // Consolidate the stats into a single response object
  const stats = {
    totalClassrooms,
    totalFaculty,
    totalSubjects,
    totalSections,
    totalCapacity: classroomStats[0]?.totalCapacity || 0,
    totalStudents: sectionStats[0]?.totalStudents || 0,
    totalLectureHours: subjectStats[0]?.totalLectureHours || 0,
    totalLocations,
    totalDepartments: allDepartments.size,
    totalCourseTypes: uniqueCourseTypes.length,
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});
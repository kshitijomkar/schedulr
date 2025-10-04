// server/data/sampleData.js

const classrooms = [
  { name: 'Room 101', capacity: 50, equipment: ['Projector'], roomType: 'Lecture Hall', location: 'Block A, 1st Floor' },
  { name: 'CS Lab 1', capacity: 40, equipment: ['Computers', 'Projector'], roomType: 'Computer Lab', location: 'Block B, 2nd Floor', department: 'Computer Science' },
  { name: 'Mech Workshop', capacity: 30, equipment: [], roomType: 'Laboratory', location: 'Block C, Ground Floor', department: 'Mechanical Engineering' },
];

const subjects = [
  { name: 'Introduction to Programming', code: 'CS101', semester: 1, department: 'Computer Science', lectureHours: 3, labHours: 2 },
  { name: 'Data Structures', code: 'CS201', semester: 3, department: 'Computer Science', lectureHours: 4, tutorialHours: 1 },
  { name: 'Thermodynamics', code: 'ME201', semester: 3, department: 'Mechanical Engineering', lectureHours: 4 },
];

const faculty = [
    { name: 'Dr. Alan Turing', employeeId: 'FAC101', email: 'alan.t@example.com', department: 'Computer Science' },
    { name: 'Dr. Marie Curie', employeeId: 'FAC102', email: 'marie.c@example.com', department: 'Physics' },
];

module.exports = { classrooms, subjects, faculty };
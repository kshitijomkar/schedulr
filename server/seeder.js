// server/seeder.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import all necessary models
const Classroom = require('./models/Classroom');
const Subject = require('./models/Subject');
const Faculty = require('./models/Faculty');
const Section = require('./models/Section');
const TimeSlot = require('./models/TimeSlot');
const ScheduledClass = require('./models/ScheduledClass'); // To clear old schedules

// --- MOCK DATA ---

// 1. Time Slots (Defines the periods for a day)
const timeSlots = [
  { period: 1, startTime: '09:00', endTime: '09:50' },
  { period: 2, startTime: '09:50', endTime: '10:40' },
  { period: 3, startTime: '10:50', endTime: '11:40' },
  { period: 4, startTime: '11:40', endTime: '12:30' },
  { period: 5, startTime: '13:20', endTime: '14:10' },
  { period: 6, startTime: '14:10', endTime: '15:00' },
  { period: 7, startTime: '15:10', endTime: '16:00' },
];

// 2. Classrooms
const classrooms = [
    // CSE
  { name: 'S1', capacity: 70, roomType: 'Lecture Hall', location: 'South Block, 1st Floor', department: 'CSE' },
  { name: 'S2', capacity: 70, roomType: 'Lecture Hall', location: 'South Block, 1st Floor', department: 'CSE' },
  { name: 'S8 (CSE Lab 1)', capacity: 40, roomType: 'Computer Lab', location: 'South Block, 3rd Floor', department: 'CSE', equipment: ['Computers', 'Projector'] },
  { name: 'S9 (CSE Lab 2)', capacity: 40, roomType: 'Computer Lab', location: 'South Block, 3rd Floor', department: 'CSE', equipment: ['Computers', 'Smartboard'] },
  { name: 'S20 (ACD Lab)', capacity: 30, roomType: 'Laboratory', location: 'South Block, 4th Floor', department: 'CSE', equipment: ['Projector'] },
    // IT
  { name: 'S3', capacity: 70, roomType: 'Lecture Hall', location: 'South Block, 2nd Floor', department: 'IT' },
  { name: 'S10', capacity: 70, roomType: 'Lecture Hall', location: 'South Block, 3rd Floor', department: 'IT' },
  { name: 'S13A (IT Lab 1)', capacity: 40, roomType: 'Computer Lab', location: 'South Block, 4th Floor', department: 'IT', equipment: ['Computers', 'Projector'] },
    // Shared
  { name: 'G11 (IoT Lab)', capacity: 30, roomType: 'Laboratory', location: 'Ground Floor', equipment: ['Projector', 'Video Conferencing'] },
  { name: 'Admin Seminar Hall', capacity: 100, roomType: 'Seminar Room', location: 'Admin Block, 1st Floor', equipment: ['Smartboard', 'Video Conferencing'] },
];

// 3. Subjects
const subjects = [
    // CSE Sem 6
  { name: 'Compiler Design', code: 'CS301', semester: 6, department: 'CSE', lectureHours: 3, labHours: 2, tutorialHours: 1, courseType: 'Core' },
  { name: 'Internet of Things', code: 'CS302', semester: 6, department: 'CSE', lectureHours: 3, labHours: 2, courseType: 'Core' },
  { name: 'Machine Learning', code: 'CS303', semester: 6, department: 'CSE', lectureHours: 4, labHours: 2, courseType: 'Core' },
  { name: 'Network Security', code: 'CS304', semester: 6, department: 'CSE', lectureHours: 3, courseType: 'Professional Elective' },
  
  // IT Sem 6
  { name: 'Web App Development', code: 'IT301', semester: 6, department: 'IT', lectureHours: 3, labHours: 2, courseType: 'Core' },
  { name: 'Software Testing', code: 'IT302', semester: 6, department: 'IT', lectureHours: 4, courseType: 'Core' },

  // CSE Sem 7
  { name: 'Data Mining', code: 'CS401', semester: 7, department: 'CSE', lectureHours: 3, labHours: 2, courseType: 'Core' },
  { name: 'Natural Language Processing', code: 'CS402', semester: 7, department: 'CSE', lectureHours: 3, labHours: 2, courseType: 'Core' },
  { name: 'Blockchain Technology', code: 'CS403', semester: 7, department: 'CSE', lectureHours: 3, courseType: 'Professional Elective' },
  
  // IT Sem 7
  { name: 'Deep Learning', code: 'IT401', semester: 7, department: 'IT', lectureHours: 3, labHours: 2, courseType: 'Core' },
  
  // Open Elective
  { name: 'Disaster Management', code: 'OE401', semester: 7, department: 'Civil Engineering', courseType: 'Open Elective', lectureHours: 3 },
];

// 4. Faculty
const facultyData = [
  { name: 'Dr. Ramesh Kumar', employeeId: 'FAC01', email: 'ramesh.k@example.com', department: 'CSE', subjects: ['Compiler Design', 'Data Mining'] },
  { name: 'Prof. Sunita Reddy', employeeId: 'FAC02', email: 'sunita.r@example.com', department: 'CSE', subjects: ['Internet of Things', 'Machine Learning'] },
  { name: 'Dr. Arjun Desai', employeeId: 'FAC03', email: 'arjun.d@example.com', department: 'IT', subjects: ['Web App Development', 'Deep Learning'] },
  { name: 'Prof. Meera Iyer', employeeId: 'FAC04', email: 'meera.i@example.com', department: 'IT', subjects: ['Software Testing', 'Network Security'] },
  { name: 'Dr. Vikram Chauhan', employeeId: 'FAC05', email: 'vikram.c@example.com', department: 'CSE', subjects: ['Natural Language Processing', 'Blockchain Technology'] },
  { name: 'Prof. Divya Nair', employeeId: 'FAC06', email: 'divya.n@example.com', department: 'Civil Engineering', subjects: ['Disaster Management'] },
];

// 5. Sections
const sectionsData = [
  { year: 3, semester: 6, department: 'CSE', sectionName: 'A', studentCount: 60, numLabBatches: 2, subjects: ['Compiler Design', 'Internet of Things', 'Machine Learning', 'Network Security'] },
  { year: 3, semester: 6, department: 'CSE', sectionName: 'B', studentCount: 62, numLabBatches: 2, subjects: ['Compiler Design', 'Internet of Things', 'Machine Learning', 'Network Security'] },
  { year: 3, semester: 6, department: 'IT', sectionName: 'A', studentCount: 55, numLabBatches: 2, subjects: ['Web App Development', 'Software Testing', 'Machine Learning'] },
  { year: 4, semester: 7, department: 'CSE', sectionName: 'A', studentCount: 64, numLabBatches: 2, subjects: ['Data Mining', 'Natural Language Processing', 'Blockchain Technology', 'Disaster Management'] },
];


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    console.log('Clearing existing data (excluding Users)...');
    await Classroom.deleteMany();
    await Subject.deleteMany();
    await Faculty.deleteMany();
    await Section.deleteMany();
    await TimeSlot.deleteMany();
    await ScheduledClass.deleteMany();
    console.log('All non-user data cleared.');

    console.log('Importing TimeSlots...');
    await TimeSlot.insertMany(timeSlots);
    console.log('Importing Classrooms...');
    await Classroom.insertMany(classrooms);

    console.log('Importing Subjects...');
    const createdSubjects = await Subject.insertMany(subjects);
    const subjectMap = createdSubjects.reduce((map, subject) => {
      map[subject.name] = subject._id;
      return map;
    }, {});
    console.log(`${createdSubjects.length} subjects imported.`);

    console.log('Preparing Faculty data...');
    const facultyWithSubjectIds = facultyData.map(fac => ({
      ...fac,
      subjectsTaught: fac.subjects.map(subjectName => subjectMap[subjectName]).filter(id => id),
    }));

    console.log('Importing Faculty...');
    await Faculty.insertMany(facultyWithSubjectIds);
    console.log(`${facultyWithSubjectIds.length} faculty members imported.`);
    
    console.log('Preparing Section data...');
    const sectionsWithSubjectIds = sectionsData.map(sec => ({
      ...sec,
      subjects: sec.subjects.map(subjectName => subjectMap[subjectName]).filter(id => id),
    }));

    console.log('Importing Sections...');
    await Section.insertMany(sectionsWithSubjectIds);
    console.log(`${sectionsWithSubjectIds.length} sections imported.`);

    console.log('\n--- Data Imported Successfully! ---');
    process.exit();
  } catch (error) {
    console.error(`ERROR: Data import failed: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Classroom.deleteMany();
    await Subject.deleteMany();
    await Faculty.deleteMany();
    await Section.deleteMany();
    await TimeSlot.deleteMany();
    await ScheduledClass.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
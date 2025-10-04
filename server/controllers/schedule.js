// server/controllers/schedule.js
const Classroom = require('../models/Classroom');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Section = require('../models/Section');
const TimeSlot = require('../models/TimeSlot');
const ScheduledClass = require('../models/ScheduledClass');
const asyncHandler = require('../middleware/asyncHandler');

exports.getSchedule = asyncHandler(async (req, res, next) => {
    const schedule = await ScheduledClass.find()
        .populate('subject', 'name')
        .populate('faculty', 'name')
        .populate('classroom', 'name')
        .populate('timeSlot');
    
    res.status(200).json({ success: true, count: schedule.length, data: schedule });
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.generateSchedule = asyncHandler(async (req, res, next) => {
  console.log('--- Starting Schedule Generation ---');
  await ScheduledClass.deleteMany({});
  console.log('Cleared existing schedule.');

  const allClassrooms = await Classroom.find();
  const allFaculty = await Faculty.find().populate('subjectsTaught');
  const allSections = await Section.find().populate('subjects');
  const allTimeSlots = await TimeSlot.find({ isBreak: false }).sort({ period: 1 });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const facultySchedule = new Map();
  const classroomSchedule = new Map();
  const sectionSchedule = new Map();

  const generatedClasses = [];

  for (const section of allSections) {
    console.log(`\nProcessing Section: ${section.year} ${section.department} - ${section.sectionName}`);
    
    const classesToSchedule = [];
    for (const subject of section.subjects) {
      for (let i = 0; i < subject.lectureHours; i++) classesToSchedule.push({ subject, type: 'Lecture' });
      for (let i = 0; i < subject.tutorialHours; i++) classesToSchedule.push({ subject, type: 'Tutorial' });
      for (let i = 0; i < subject.labHours; i++) {
        for (let batch = 1; batch <= section.numLabBatches; batch++) {
          classesToSchedule.push({ subject, type: 'Lab', batchNumber: batch });
        }
      }
    }

    const shuffledClasses = shuffleArray(classesToSchedule);

    for (const classInfo of shuffledClasses) {
      let isClassScheduled = false;

      for (const day of shuffleArray([...days])) {
        for (const timeSlot of shuffleArray([...allTimeSlots])) {
          
          const sectionSlotKey = `${day}-${timeSlot._id}`;
          if (sectionSchedule.get(section._id)?.has(sectionSlotKey)) {
            continue;
          }

          const availableFaculty = allFaculty.filter(faculty => {
            const facultySlotKey = `${day}-${timeSlot._id}`;
            return faculty.subjectsTaught.some(s => s._id.equals(classInfo.subject._id)) &&
                   !facultySchedule.get(faculty._id)?.has(facultySlotKey);
          });
          if (availableFaculty.length === 0) continue;
          
          const studentCountForClass = classInfo.type === 'Lab' 
              ? Math.ceil(section.studentCount / section.numLabBatches) 
              : section.studentCount;
          const roomTypeForClass = classInfo.type === 'Lab' ? 'Laboratory' : 'Lecture Hall';

          const availableClassrooms = allClassrooms.filter(room => {
            const classroomSlotKey = `${day}-${timeSlot._id}`;
            return room.capacity >= studentCountForClass &&
                   room.roomType.includes(roomTypeForClass) &&
                   !classroomSchedule.get(room._id)?.has(classroomSlotKey);
          });
          if (availableClassrooms.length === 0) continue;

          const chosenFaculty = availableFaculty[0];
          const chosenClassroom = availableClassrooms[0];

          const newScheduledClass = {
            day: day,
            timeSlot: timeSlot._id,
            sessionType: classInfo.type,
            subject: classInfo.subject._id,
            faculty: [chosenFaculty._id],
            classroom: chosenClassroom._id,
            section: section._id,
            labBatchNumber: classInfo.batchNumber,
          };
          generatedClasses.push(newScheduledClass);

          if (!sectionSchedule.has(section._id)) sectionSchedule.set(section._id, new Map());
          sectionSchedule.get(section._id).set(sectionSlotKey, true);

          if (!facultySchedule.has(chosenFaculty._id)) facultySchedule.set(chosenFaculty._id, new Map());
          facultySchedule.get(chosenFaculty._id).set(sectionSlotKey, true);

          if (!classroomSchedule.has(chosenClassroom._id)) classroomSchedule.set(chosenClassroom._id, new Map());
          classroomSchedule.get(chosenClassroom._id).set(sectionSlotKey, true);

          isClassScheduled = true;
          break;
        }
        if (isClassScheduled) break;
      }
      if(!isClassScheduled){
        console.warn(`Could not schedule: ${classInfo.subject.name} (${classInfo.type}) for Section ${section.sectionName}`);
      }
    }
  }

  if (generatedClasses.length > 0) {
    await ScheduledClass.insertMany(generatedClasses);
    console.log(`Successfully inserted ${generatedClasses.length} scheduled classes.`);
  }

  console.log('--- Schedule Generation Finished ---');
  res.status(201).json({
    success: true,
    message: 'Schedule generated successfully.',
    data: {
      classesScheduled: generatedClasses.length,
    }
  });
});
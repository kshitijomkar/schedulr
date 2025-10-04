// server/swaggerConfig.js

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Class Scheduling System API',
    version: '1.0.0',
    description: 'API documentation for the Class Scheduling System.',
  },
  servers: [{ url: 'http://localhost:8000/api', description: 'Development server' }],
  tags: [
    { name: 'Auth', description: 'User authentication and management' },
    { name: 'Classrooms', description: 'Operations for managing classrooms' },
    { name: 'Faculty', description: 'Operations for managing faculty members' },
  ],
  paths: {
    // --- Auth Paths ---
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegisterInput' } } } },
        responses: { '201': { description: 'User registered successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '400': { description: 'Bad request' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in an existing user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLoginInput' } } } },
        responses: { '200': { description: 'Login successful.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: "Get current logged-in user's profile",
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile data.', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfileResponse' } } } }, '401': { description: 'Not authorized' } },
      },
    },
    // --- Classroom Paths ---
    '/classrooms': {
      get: {
        tags: ['Classrooms'],
        summary: 'Get all classrooms',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'A list of classrooms' } },
      },
      post: {
        tags: ['Classrooms'],
        summary: 'Create a new classroom',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassroomInput' } } },
        },
        responses: { '201': { description: 'Classroom created successfully' } },
      },
    },
    '/classrooms/{id}': {
      put: {
        tags: ['Classrooms'],
        summary: 'Update a classroom by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'ID of the classroom to update', schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassroomInput' } } },
        },
        responses: { '200': { description: 'Classroom updated successfully' } },
      },
      delete: {
        tags: ['Classrooms'],
        summary: 'Delete a classroom by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'ID of the classroom to delete', schema: { type: 'string' } }],
        responses: { '200': { description: 'Classroom deleted successfully' } },
      },
    },
    // --- Faculty Paths ---
    '/faculty': {
        get: { tags: ['Faculty'], summary: 'Get all faculty', security: [{ bearerAuth: [] }], responses: { '200': { description: 'A list of all faculty members' } } },
        post: { tags: ['Faculty'], summary: 'Create a new faculty member', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FacultyInput' } } } }, responses: { '201': { description: 'Faculty member created successfully' } } },
      },
    '/faculty/{id}': {
        put: { tags: ['Faculty'], summary: 'Update a faculty member by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FacultyInput' } } } }, responses: { '200': { description: 'Faculty member updated successfully' } } },
        delete: { tags: ['Faculty'], summary: 'Delete a faculty member by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Faculty member deleted successfully' } } },
    },
    // --- Subject Paths ---
    '/subjects': {
      get: { tags: ['Subjects'], summary: 'Get all subjects', security: [{ bearerAuth: [] }], responses: { '200': { description: 'A list of all subjects' } } },
      post: { tags: ['Subjects'], summary: 'Create a new subject', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SubjectInput' } } } }, responses: { '201': { description: 'Subject created successfully' } } },
    },
    '/subjects/{id}': {
      put: { tags: ['Subjects'], summary: 'Update a subject by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SubjectInput' } } } }, responses: { '200': { description: 'Subject updated successfully' } } },
      delete: { tags: ['Subjects'], summary: 'Delete a subject by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Subject deleted successfully' } } },
    },
    // --- Section Paths ---
    '/sections': {
      get: { tags: ['Sections'], summary: 'Get all sections', security: [{ bearerAuth: [] }], responses: { '200': { description: 'A list of all sections' } } },
      post: { tags: ['Sections'], summary: 'Create a new section', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SectionInput' } } } }, responses: { '201': { description: 'Section created successfully' } } },
    },
    '/sections/{id}': {
      put: { tags: ['Sections'], summary: 'Update a section by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SectionInput' } } } }, responses: { '200': { description: 'Section updated successfully' } } },
      delete: { tags: ['Sections'], summary: 'Delete a section by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Section deleted successfully' } } },
    },
    // --- Schedule Path ---
    '/schedule/generate': {
      post: {
        tags: ['Schedule'],
        summary: 'Generate a new timetable',
        description: 'This will delete the existing schedule and generate a new one based on all available data and constraints.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Schedule generation process completed successfully.' },
          '500': { description: 'Server error during generation.' },
        },
      },
    },
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      UserRegisterInput: { type: 'object', properties: { name: { type: 'string', example: 'Jane Doe' }, email: { type: 'string', example: 'jane.doe@example.com' }, password: { type: 'string', example: 'password123' } } },
      UserLoginInput: { type: 'object', properties: { email: { type: 'string', example: 'jane.doe@example.com' }, password: { type: 'string', example: 'password123' } } },
      AuthResponse: { type: 'object', properties: { success: { type: 'boolean' }, token: { type: 'string' }, data: { type: 'object' } } },
      UserProfileResponse: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object' } } },
      ClassroomInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Room 101' },
          capacity: { type: 'number', example: 50 },
          equipment: { type: 'array', items: { type: 'string' }, example: ['Projector', 'Whiteboard'] },
          roomType: { type: 'string', enum: ['Lecture Hall', 'Laboratory', 'Seminar Room', 'Studio', 'Computer Lab'], example: 'Lecture Hall'},
          location: { type: 'string', example: 'Block A, 3rd Floor' },
          department: { type: 'string', example: 'Computer Science' },
        },
      },
      FacultyInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Dr. Alan Turing' },
          employeeId: { type: 'string', example: 'EMP101' },
          email: { type: 'string', example: 'alan.turing@example.com' },
          department: { type: 'string', example: 'Computer Science' },
          subjectsTaught: { type: 'array', items: { type: 'string' }, example: ['SubjectID1', 'SubjectID2'] },
        },
      },
       // --- Subject Schema ---
      SubjectInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Data Structures' },
          code: { type: 'string', example: 'CS201' },
          semester: { type: 'number', example: 3 },
          department: { type: 'string', example: 'Computer Science' },
          lectureHours: { type: 'number', example: 3 },
          labHours: { type: 'number', example: 2 },
          tutorialHours: { type: 'number', example: 1 },
          courseType: { type: 'string', enum: ['Core', 'Professional Elective', 'Open Elective', 'Skill'], example: 'Core' },
        },
      },
      // --- Section Schema ---
      SectionInput: {
        type: 'object',
        properties: {
          year: { type: 'number', example: 3 },
          semester: { type: 'number', example: 2 },
          department: { type: 'string', example: 'CSE' },
          sectionName: { type: 'string', example: 'A' },
          studentCount: { type: 'number', example: 60 },
          numLabBatches: { type: 'number', example: 2 },
          subjects: { type: 'array', items: { type: 'string' }, example: ['subjectId1', 'subjectId2'] },
        },
      },
    },
  },
};
module.exports = swaggerSpec;
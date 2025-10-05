// server/index.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

// --- ADDED: Import the new error handler ---
const errorHandler = require('./middleware/errorHandler');

// Import route files
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const facultyRoutes = require('./routes/faculty');
const subjectRoutes = require('./routes/subjects');
const sectionRoutes = require('./routes/sections');
const scheduleRoutes = require('./routes/schedule');
const dashboardRoutes = require('./routes/dashboard');

connectDB();
const app = express();

const defaultOrigins = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5000', 'http://localhost:3000'];
const whitelist = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : defaultOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.length === 0 || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- ADDED: Use the error handler middleware ---
// This MUST be after all the app.use() routes
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});
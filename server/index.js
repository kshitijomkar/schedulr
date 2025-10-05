// server/index.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import route files
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const facultyRoutes = require('./routes/faculty');
const subjectRoutes = require('./routes/subjects');
const sectionRoutes = require('./routes/sections');
const scheduleRoutes = require('./routes/schedule');
const dashboardRoutes = require('./routes/dashboard');
const healthRoutes = require('./routes/health');
const messageRoutes = require('./routes/messages.js');
connectDB();
const app = express();

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
  console.error('FATAL ERROR: CLIENT_URL environment variable is required in production');
  process.exit(1);
}

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow POST
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow these headers
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 8000;

app.use('/api/health', healthRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply general rate limiter to all API routes
app.use('/api', generalLimiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

// --- ADDED: Use the error handler middleware ---
// This MUST be after all the app.use() routes
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});
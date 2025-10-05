# Class Scheduling System

## Overview

The Class Scheduling System is a full-stack web application designed to automate and optimize class timetables for higher education institutions. The system manages classrooms, faculty, subjects, sections, and generates conflict-free schedules based on various constraints including room capacity, faculty availability, and time slot allocation.

The application enables administrators and schedulers to:
- Manage academic resources (classrooms, faculty, subjects, sectons)
- Import/export data via Excel files
- Generate optimized timetables automatically
- View dashboard statistics and analytics
- Handle multiple departments and course types

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 (App Router) with React 18 and TypeScript

The frontend follows a modern component-based architecture with these key patterns:

- **Server-Side Rendering (SSR)**: Next.js App Router for optimal performance and SEO
- **Component Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable UI elements
- **Styling**: Tailwind CSS wih custom design tokens for consistent theming (light/dark mode support)
- **State Management**: React Context API for authentication state, local component state for UI interactions
- **Data Fetching**: Axios for HTTP requests to the backend API
- **Form Handling**: React Hook Form with Zod validation for type-safe form inputs
- **Protected Routes**: Custom ProtectedRoute wrapper component that checks authentication status before rendering dashboard pages

**Key Design Decisions**:
- Chose Next.js App Roter over Pages Router for improved data fetching patterns and nested layouts
- Used shadcn/ui instead of a full component library for better customization and smaller bundle size
- Implemented client-side routing with protected routes to ensure secure access to authenticated pages

### Backend Architecture

**Framework**: Express.js 5 with Node.js

The backend follows a layered MVC architecture with these components:

- **Database Layer**: MongoDB with Mongoose ODM for schema definitions and data validaion
- **Controller Layer**: Business logic organized by resource (classrooms, faculty, subjects, sections, schedule)
- **Route Layer**: Express routers that define API endpoints and apply middleware
- **Middleware**: Custom middleware for authentication (JWT verification), error handling, and async operations
- **Models**: Mongoose schemas with validation rules, indexes, and relationships

**Key Design Decisions**:
- Chose MongoDB over SQL for flexible schema evolution as requirements change (e.g., addin equipment to classrooms)
- Implemented text indexes on frequently searched fields (classroom names, subject codes) for performance
- Used JWT tokens for stateless authentication to support horizontal scaling
- Created an async handler wrapper to eliminate repetitive try-catch blocks and centralize error handling

### Schedule Generation Algorithm

The system uses a constraint-based scheduling algorithm:

1. **Data Collection**: Fetch all classrooms, faculty, subjects, sections, and time slots
2. **Consraint Tracking**: Maintain maps to track faculty schedule, classroom availability, and section timetables
3. **Session Allocation**: For each section and subject:
   - Allocate lecture sessions based on `lectureHours`
   - Allocate lab sessions based on `labHours` (split into batches)
   - Allocate tutorial sessions based on `tutorialHours`
4. **Conflict Avoidance**: Check constraints before scheduling:
   - Faculty must be available for the time slot
   - Classroom must be free and have sufficient capacty
   - Section must not have another class at the same time
5. **Randomization**: Shuffle arrays to distribute classes across different days and times

**Trade-offs**:
- Chose a greedy algorithm over genetic algorithms for simplicity and predictable performance
- Schedules may not be globally optimal but are conflict-free and generated quickly
- Future optimization could include backtracking or AI-based approaches

### Data Import/Export

The application supports bulk operations via Excel files:

- **Eport**: Uses ExcelJS to generate `.xlsx` files with current data
- **Import**: Parses uploaded Excel files and validates data before inserting into the database
- **Relationship Linking**: During import, subject codes are resolved to database IDs to establish relationships (e.g., linking faculty to subjects they teach)

**Design Rationale**:
- Excel format chosen for familiarity with educational administrators
- In-memory file processing (multer with memory storage) to avoid disk I/O overhead
- Validatio occurs before database insertion to maintain data integrity

### Authentication & Authorization

**Mechanism**: JWT (JSON Web Tokens) with role-based access control

- Users register with name, email, password, and role (Admin or Scheduler)
- Passwords are hashed using bcryptjs before storage
- Upon login, a JWT token is issued containing user ID and role
- Protected routes verify the token via middleware before allowing access
- Frontend stores token in localStorage and includes it in Authorization heders

**Security Considerations**:
- Passwords are never stored in plain text
- JWT tokens have expiration times (default 7 days)
- Environment variables are used for sensitive configuration (JWT secret, database URI)

### Dashboard Analytics

The dashboard aggregates statistics from multiple collections:

- Uses MongoDB's aggregation pipeline for efficient calculations (total capacity, student counts, etc.)
- Parallel queries with `Promise.all` to minimize response time
- Distinct values extracted for fltering options (departments, course types)

**Performance Optimization**:
- Aggregation pipelines push computation to the database layer
- Indexes on department and semester fields speed up common queries

## External Dependencies

### Third-Party Services

**Database**: MongoDB Atlas (cloud-hosted MongoDB)
- Connection managed via Mongoose ODM
- Connection string configured through `MONGO_URI` environment variable
- Requires internet connectivity for cloud deployment

### Key NPM Packages

**Backend**
- `express`: Web application framework
- `mongoose`: MongoDB object modeling
- `jsonwebtoken`: JWT token generation and verification
- `bcryptjs`: Password hashing
- `exceljs`: Excel file parsing and generation
- `multer`: File upload handling
- `cors`: Cross-origin resource sharing
- `swagger-jsdoc` & `swagger-ui-express`: API documentation

**Frontend**:
- `next`: React framework with SSR
- `react` & `react-dom`: UI library
- `axios`: HTTP client
- `@radix-ui/*`: Unstyled, accessible UI primitives
- `tanstack/react-table`: Headless table library
- `react-hook-form`: Form state management
- `zod`: Schema validation
- `tailwindcss`: Utility-first CSS framework
- `lucide-react`: Icon library
- `next-themes`: Theme management (light/dark mode)
- `file-saver`: Client-side file downloads

### Environment Configuration

**Backend** (`.env`):
- `MONGO_URI`: MongoDB connection string (required)
- `JWT_SECRET`: Secret key for signing tokens (required)
- `JWT_EXPIRE`: Token expiration time (optional, default 7)
- `CLIENT_URL`: Allowed CORS origins (optional, for production)
- `NODE_ENV`: Environment mode (development/production)

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g., `http://localhost:8000`)

### API Integration

The frontend communicates with the backend via RESTful API endpoints:

- Authentication: `/api/auth/*`
- Classrooms: `/api/classrooms/*`
- Faculty: `/api/faculty/*`
- Subjects: `/api/subjects/*`
- Sections: `/api/sections/*`
- Schedule: `/api/schedule/*`
- ashboard: `/api/dashboard/*`

All protected endpoints require a Bearer token in the Authorization header.
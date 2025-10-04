# Class Scheduling System

This is a full-stack web application designed to automate and optimize class timetables for higher education institutions.

## Tech Stack

**Frontend:**
- Next.js (React)
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    ```
2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    # Create a .env file with MONGO_URI and JWT_SECRET
    npm run dev
    ```
3.  **Frontend Setup:**
    ```bash
    cd client
    npm install
    # Create a .env.local file with NEXT_PUBLIC_API_URL=http://localhost:8000
    npm run dev
    ```
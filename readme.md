# The Last of Goose - Technical Task

This project implements a browser-based game "The Last of Goose", where players tap a virtual goose to score points within time-limited rounds. The application consists of a Fastify (Node.js/TypeScript) backend and a React (TypeScript/Vite) frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)

- **npm** (comes with Node.js)

- **Docker** and **Docker Compose** (for running the database)

## Setup and Running Locally

### 1. Clone the Repository

```bash

git clone https://github.com/your-username/the-last-of-goose-tech-task.git

cd the-last-of-goose-tech-task

```

### 2. Database Setup

The project uses a PostgreSQL database, managed with Docker Compose.

a. **Start the PostgreSQL container:**

    ```bash

    docker-compose up -d db

    ```

    This will start a PostgreSQL container named `the_last_of_guss_db` on port `5432`.

b. **Create a `.env` file** in the `backend/` directory.

    ```

    # backend/.env

    PORT=3000

    DATABASE_URL="postgresql://user:password@localhost:5432/the_last_of_guss"

    # User: user, Password: password, Database: the_last_of_guss (as defined in docker-compose.yml)



    JWT_SECRET="your_secret_jwt_key" # Change this to a strong, random string

    ROUND_DURATION=2    # Default round duration in minutes

    COOLDOWN_DURATION=30 # Default cooldown duration in seconds

    ```

    Make sure `DATABASE_URL` matches the credentials from `docker-compose.yml`.

c. **Run migrations:** The backend will automatically run migrations on startup if the database is empty or requires updates.

### 3. Backend Setup

Navigate to the `backend/` directory, install dependencies, and build the project.

```bash
cd backend/
npm install
npm run build
```

The backend includes a background process that updates round statuses every 5 seconds.

### 4. Frontend Setup

Navigate to the `frontend/` directory, install dependencies, and build the project.

```bash
cd ../frontend/
npm install
npm run build # (This creates the static files in frontend/dist)
```

### 5. Running the Application

For a full-stack experience (backend serving frontend):

1.  Ensure you have run `npm run build` in both `backend/` and `frontend/` directories.
2.  Start the backend server (which will also serve the frontend static files):
    ```bash
    cd backend/
    npm start
    ```
    The application will be accessible at `http://localhost:3000`.

For development (separate frontend and backend servers):

1.  Start the backend server:
    ```bash
    cd backend/
    npm run dev # (Uses ts-node for live reloading)
    ```
2.  In a separate terminal, start the frontend development server:
    ```bash
    cd frontend/
    npm run dev # (Vite development server)
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is in use). The frontend dev server is configured to proxy `/api` requests to the backend (`http://localhost:3000`).

## Admin Functionality

- **Creating an Admin User**: The first user to log in with the username `admin` (case-insensitive) will automatically be assigned the `ADMIN` role.
- **Admin Controls**: As an admin, you will see additional controls on the "Rounds List" page to create and delete rounds, and set custom durations/cooldowns.
- **Default Credentials**: Default admin password is "123"

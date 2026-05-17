# Smart Leads Dashboard

A full-stack lead management dashboard with a Node.js / Express backend, MongoDB data store, and a React + Vite frontend.

## Project Structure

- `backend/` - Express API, Mongoose models, auth, leads, and seed logic
- `frontend/` - React app with Vite, Tailwind, React Router, and API integration
- `docker-compose.yml` - optional local Docker setup with MongoDB, backend, and frontend

## Tech Stack

- Backend: TypeScript, Express, Mongoose, bcrypt, JWT, Zod
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, React Query
- Database: MongoDB

## Local Setup

### Backend

1. `cd backend`
2. `npm install`
3. Create `.env` with the values below
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Create `.env` from `.env.example`
4. `npm run dev`

## Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_leads
JWT_SECRET=your-very-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Seed Data

The backend includes a seed script to create default users and leads.

Run from `backend/`:

```bash
npm run seed
```

Default seeded accounts:

- `admin@smartleads.local` / `Admin1234!`
- `sales@smartleads.local` / `Sales1234!`

## API Endpoints

### Auth

- `POST /api/v1/auth/register` - register a new user
- `POST /api/v1/auth/login` - log in and receive a JWT

### Leads

- `GET /api/v1/leads` - list leads (requires auth)
- `POST /api/v1/leads` - create a lead (requires auth)
- `GET /api/v1/leads/:id` - get lead details
- `PUT /api/v1/leads/:id` - update a lead
- `DELETE /api/v1/leads/:id` - delete a lead

> Note: the leads routes are protected by auth middleware.

## Docker Setup

Use the root `docker-compose.yml` to run MongoDB, backend, and frontend together:

```bash
docker compose up --build
```

The local Docker setup maps:

- MongoDB: `mongodb://root:root_password@mongodb:27017/smart_leads?authSource=admin`
- Backend: `http://localhost:5000`
- Frontend: `http://localhost`

## Deployment Notes

- Backend API base path: `/api/v1`
- Backend deployment URL: `https://smart-leads-dashboard-s4gw.onrender.com`
- Frontend deployment URL: `https://smart-leads-dashboard-livid.vercel.app`
- Frontend API base URL is configured in `frontend/.env.example`

## Helpful Commands

### Backend

- `npm run dev` - start backend in development
- `npm run build` - compile TypeScript
- `npm start` - run built backend
- `npm run seed` - seed sample users and leads

### Frontend

- `npm run dev` - start frontend dev server
- `npm run build` - build production assets
- `npm run preview` - preview production build

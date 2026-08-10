# Daily Time Record System

A simple attendance tracking web application for recording time-in and time-out activity, viewing attendance history, and managing secure access for users.

## Features

- Secure login with JWT-based authentication
- Time-in and time-out recording
- Attendance history tracking
- Role-based access for student and admin flows
- Dockerized API and database setup

## Tech Stack

- Backend: ASP.NET Core, C#, Entity Framework Core, PostgreSQL
- Frontend: React, TypeScript, Vite
- Tooling: Docker, pnpm

## Prerequisites

- .NET SDK 10+
- Node.js 20+
- pnpm
- Docker Desktop

## Getting Started

```bash
git clone <your-repository-url>
cd "Daily Time Record System"
```

Create a `.env` file in the project root with:

```env
DB_PASSWORD=your_password
JWT_SECRET_KEY=your_secret_key
```

Run the full stack with Docker:

```bash
docker compose up --build
```

For frontend development locally:

```bash
cd dtr-frontend
pnpm install
pnpm dev
```

## Usage

- Frontend: http://localhost:5173
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger

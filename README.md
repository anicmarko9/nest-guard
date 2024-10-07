# Nest.js app for JWT Authentiation & RBAC Authorization

A backend service built with **Nest.js** to handle user registration, login, email verification, organization creation, and user roles using JWT-based authentication and role-based authorization. Features asynchronous email sending with Redis queues.

## Tech Stack

- **TypeScript**
- **Nest.js** with **TypeORM** (PostgreSQL)
- **Bull Queue** (Redis)
- **JWT** Authentication
- **SendGrid** (for emails)
- **Prettier**, **ESLint**, **Jest** (unit & e2e testing)

## Features

- **User Registration**: Register with email confirmation via SendGrid.
- **Email Verification**: Verify email to receive a JWT.
- **Login**: Sign in to generate JWT cookie.
- **Organization Management**: Create organizations, invite users, assign roles.
- **Role-based Authorization**: Assign roles and control access to endpoints based on permissions.

## Setup Instructions

### 1. Clone the repository

`git clone https://github.com/anicmarko9/nest-guard.git`

### 2. Checkout to the new branch

`git checkout -b features/your-name`

### 3. Install dependencies

`npm ci`

### 4. Start Redis (in a separate terminal)

`sudo service redis-server start`

### 5. Create a PostgreSQL database (if you haven't)

`psql -U postgres -p 5432 -c 'create database nest_guard_db;'`

### 6. Create a SendGrid account

- Sign up at [SendGrid](https://sendgrid.com/) and generate your API key.

### 7. Configure environment variables

- Copy the `.env.example` file and create your own `.env` file in the root directory

### 8. Start development server

`npm run dev`

### 9. Running Tests & Linters

- **typecheck**: `npm run typecheck`
- **eslint**: `npm run ci:format`
- **prettier**: `npm run ci:lint`
- **jest**: `npm run ci:test`

# NIT Online Voting System Setup Guide

Complete source code for the College Election Voting System.

## Features
- **Student Authentication**: OTP-based login via email.
- **Admin Control**: Manage candidates, view real-time vote counts, and control election status.
- **Secure Voting**: Each student can vote only once with multiple checks.
- **Security**: JWT authentication, Bcrypt password hashing, and OTP expiry (5 minutes).

## Prerequisites
- Node.js installed.
- MongoDB Atlas account (with a Connection URI).
- Email account with App Password (for Nodemailer).

## Backend Setup
1. Open terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install express mongoose dotenv cors jsonwebtoken bcryptjs nodemailer @google/generative-ai
   ```
3. Configure Environment Variables (`.env`):
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI="your_mongodb_atlas_uri"
   JWT_SECRET="your_secure_random_string"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-gmail-app-password"
   GEMINI_API_KEY="your_api_key"
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## Frontend Setup
1. Open terminal in the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Default Admin Credentials
- **Admin ID**: `admin`
- **Password**: `admin123`
- **Riya ID**: `riya`
- **Riya Password**: `riya123`

## API Endpoints
### Authentication
- `POST /api/auth/student/send-otp`: Sends 6-digit OTP to student email.
- `POST /api/auth/student/verify-otp`: Verifies OTP and returns JWT.
- `POST /api/auth/admin/login`: Admin login.
- `POST /api/auth/admin/forgot-password`: Simulates sending reset link.

### Voting
- `POST /api/vote`: Cast a vote (Requires Student JWT).
- `GET /api/candidates`: Get all active candidates.

### Admin
- `GET /api/admin/dashboard`: View total students and vote logs.
- `POST /api/candidates`: Add new candidate.
- `DELETE /api/candidates/:id`: Remove candidate.
- `PUT /api/admin/election-status`: Open/Close voting.

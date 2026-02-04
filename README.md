# Trivo - Intelligent Reforestation Management Platform

## Overview
Trivo is an intelligent reforestation management platform designed to address the failure of static planning and reactive monitoring in forest restoration projects. The system manages the complete lifecycle of reforestation—from smart site and species selection using soil and climate data, to continuous post-plantation monitoring, predictive risk detection, and AI-driven decision support.

## Authentication System

### User Model
The user authentication system includes the following fields:
- **Name**: User's full name (required, 2-100 characters)
- **Email**: Unique email address (required, validated format)
- **Password**: Secure password (required, minimum 6 characters, hashed with bcrypt)
- **Profession**: User role (required, dropdown options: "ngo" or "forest officer")

### API Endpoints

#### Public Routes
- **POST** `/api/users/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "profession": "ngo"
  }
  ```

- **POST** `/api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Protected Routes (Require JWT Token)
- **GET** `/api/users/profile` - Get user profile
- **PUT** `/api/users/profile` - Update user profile
- **GET** `/api/users` - Get all users
- **DELETE** `/api/users/:id` - Delete user by ID

### Authentication Flow
1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Client includes token in Authorization header for protected routes: `Bearer <token>`
5. Server verifies token and grants access

### Security Features
- Password hashing using bcrypt (10 salt rounds)
- JWT token-based authentication (30-day expiration)
- Protected routes with middleware
- Role-based authorization support
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trivo
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

### Testing the API

#### Using the Frontend
1. Open `frontend/index.html` in your browser
2. Register a new account or login
3. Test the authentication flow

#### Using Postman or cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "profession": "ngo"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Profile (Protected):**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── Config/
│   └── db.js                 # Database connection
├── Controllers/
│   └── userControllers.js    # User business logic
├── Middlewares/
│   └── authMiddleware.js     # Authentication & authorization
├── Models/
│   └── user.js              # User schema
├── Routes/
│   └── userRoutes.js        # User API routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
└── server.js               # Main application file

frontend/
└── index.html              # Authentication UI
```

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - API integration

## Features Implemented

✅ User registration with validation
✅ User login with JWT token generation
✅ Password hashing and security
✅ Protected routes with middleware
✅ Role-based profession field (NGO, Forest Officer)
✅ User profile management
✅ Token-based authentication
✅ Error handling and validation
✅ CORS and security headers
✅ Responsive frontend UI

## Next Steps

- Implement password reset functionality
- Add email verification
- Create admin dashboard
- Implement refresh tokens
- Add rate limiting
- Create additional models for reforestation data
- Integrate soil and climate data APIs
- Build monitoring and analytics features

## Team
Nexus OP Team Members: Shivam, Shreshta, Mariam, Vaishnavi

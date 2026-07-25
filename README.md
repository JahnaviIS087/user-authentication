# SecureAuth – Role-Based Authentication & Authorization System

SecureAuth is a full-stack authentication and authorization system built using the MERN stack. It provides secure user authentication, role-based access control, email verification, password management, profile management, and administrative user controls.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes
- Email verification
- Forgot password and reset password
- Change password
- Logout functionality

### User Profile
- View account information
- Update profile details
- Upload/change profile picture
- Account role and status display
- Secure account management dashboard

### Role-Based Authorization
- User and Admin roles
- Admin-only protected routes
- Role-based access control middleware
- Unauthorized access protection

### Admin User Management
- View all registered users
- Block users
- Unblock users
- Delete users
- Prevent administrator from blocking/deleting their own account

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Security & Authentication
- JSON Web Token (JWT)
- Password hashing
- Authentication middleware
- Role-based authorization
- Email verification
- Secure password reset flow

## Project Structure

```text
secure-auth-system/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── adminController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
│
├── utils/
│   └── sendemail.js
│
├── uploads/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory.

Use `.env.example` as the template:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

Add your actual credentials only to `.env`.

> Never commit the `.env` file to GitHub.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/dhanushl-dev/user-autentication.git
cd user-autentication
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory and provide the required environment variables.

### 5. Start the backend

From the root directory:

```bash
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

## Security

SecureAuth implements multiple security mechanisms including:

- Hashed passwords instead of plain-text storage
- JWT authentication
- Protected backend routes
- Admin-only authorization middleware
- Email verification before account access
- Password reset tokens
- User blocking controls
- Environment variables for sensitive credentials

## Future Improvements

- Two-factor authentication (2FA)
- Google OAuth authentication
- Login activity history
- Refresh token implementation
- Rate limiting
- Account security notifications
- Production deployment

## Author

**Dhanush L**

Information Science Engineering  
Nitte Meenakshi Institute of Technology

## License

This project is developed for educational and portfolio purposes.
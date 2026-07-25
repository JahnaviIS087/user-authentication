// DNS Configuration
const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

// ==========================
// Imports
// ==========================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================
// Environment Variables
// ==========================

dotenv.config();

// ==========================
// Database
// ==========================

connectDB();

// ==========================
// Express App
// ==========================

const app = express();

// ==========================
// Middleware
// ==========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cors());

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);

// ==========================
// Rate Limiter
// ==========================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// ==========================
// Static Uploads
// ==========================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ==========================
// API Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Secure Authentication System API is running"
    });
});

// ==========================
// 404 Route
// ==========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==========================
// Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
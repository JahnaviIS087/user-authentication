const express = require("express");

const {
    registerUser,
    verifyEmail,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfileImage,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Register
router.post("/register", registerUser);

// Verify Email
router.get("/verify-email/:token", verifyEmail);

// Login
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

// ==========================
// Protected User Routes
// ==========================

// Get Profile
router.get(
    "/profile",
    protect,
    getProfile
);

// Update Profile
router.put(
    "/profile",
    protect,
    updateProfile
);

// Upload Profile Image
router.put(
    "/profile-image",
    protect,
    upload.single("profileImage"),
    uploadProfileImage
);

// Change Password
router.put(
    "/change-password",
    protect,
    changePassword
);

// ==========================
// Admin Test Route
// ==========================

router.get(
    "/admin",
    protect,
    adminOnly,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome Admin! You have access to this route.",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);

module.exports = router;
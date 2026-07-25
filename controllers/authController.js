const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ==========================
// Generate JWT
// ==========================

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// ==========================
// Register User
// ==========================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Generate email verification token
        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        // Hash token before storing
        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            isVerified: false,
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000
        });

        const verificationUrl =
            `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

        const message = `
Hello ${user.name},

Welcome to Secure Auth System.

Please verify your email address by opening the link below:

${verificationUrl}

This verification link will expire in 24 hours.

If you did not create this account, you can ignore this email.

Secure Auth System
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Secure Auth System - Verify Your Email",
                message
            });
        } catch (emailError) {
            // Registration remains successful even if email delivery fails.
            console.error(
                "Verification Email Error:",
                emailError.message
            );
        }

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully. Please check your email to verify your account.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error("Register Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Verify Email
// ==========================

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: {
                $gt: Date.now()
            }
        }).select(
            "+emailVerificationToken +emailVerificationExpire"
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Email verification link is invalid or has expired"
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save({
            validateBeforeSave: false
        });

        return res.status(200).json({
            success: true,
            message:
                "Email verified successfully. You can now login."
        });

    } catch (error) {
        console.error(
            "Verify Email Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Login User
// ==========================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been blocked. Contact administrator."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Email must be verified before login
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email before logging in."
            });
        }

        user.lastLogin = new Date();

        await user.save();

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profileImage: user.profileImage,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Get Profile
// ==========================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profileImage: user.profileImage,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error("Get Profile Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Update Profile
// ==========================

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) {
            user.name = name.trim();
        }

        if (email) {
            const normalizedEmail =
                email.toLowerCase().trim();

            const existingUser = await User.findOne({
                email: normalizedEmail
            });

            if (
                existingUser &&
                existingUser._id.toString() !==
                    user._id.toString()
            ) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }

            user.email = normalizedEmail;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error(
            "Update Profile Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Upload Profile Image
// ==========================

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a profile image"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.profileImage) {
            const oldImagePath = path.join(
                process.cwd(),
                user.profileImage.replace(/^\//, "")
            );

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const imagePath =
            `/uploads/profiles/${req.file.filename}`;

        user.profileImage = imagePath;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.error(
            "Profile Image Error:",
            error.message
        );

        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Change Password
// ==========================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide current password and new password"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(
            req.user.id
        ).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect"
            });
        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {
        console.error(
            "Change Password Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Forgot Password
// ==========================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide your email"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists, a password reset email has been sent."
            });
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save({
            validateBeforeSave: false
        });

        const resetUrl =
            `http://localhost:5000/api/auth/reset-password/${resetToken}`;

        const message = `
Hello ${user.name},

We received a request to reset your Secure Auth System password.

Password reset link:

${resetUrl}

This link expires in 15 minutes.

If you did not request this, ignore this email.

Secure Auth System
        `;

        try {
            await sendEmail({
                email: user.email,
                subject:
                    "Secure Auth System - Password Reset",
                message
            });

            return res.status(200).json({
                success: true,
                message:
                    "Password reset email sent successfully"
            });

        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({
                validateBeforeSave: false
            });

            console.error(
                "Email Send Error:",
                emailError.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Password reset email could not be sent"
            });
        }

    } catch (error) {
        console.error(
            "Forgot Password Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Reset Password
// ==========================

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a new password"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        }).select(
            "+resetPasswordToken +resetPasswordExpire"
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset token is invalid or has expired"
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error(
            "Reset Password Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ==========================
// Exports
// ==========================

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfileImage,
    changePassword,
    forgotPassword,
    resetPassword
};
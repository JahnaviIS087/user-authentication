const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        profileImage: {
            type: String,
            default: ""
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        lastLogin: {
            type: Date,
            default: null
        },

        // ==========================
        // Email Verification
        // ==========================

        isVerified: {
            type: Boolean,
            default: false
        },

        emailVerificationToken: {
            type: String,
            select: false
        },

        emailVerificationExpire: {
            type: Date,
            select: false
        },

        // ==========================
        // Forgot Password
        // ==========================

        resetPasswordToken: {
            type: String,
            select: false
        },

        resetPasswordExpire: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// ==========================
// Hash Password
// ==========================

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

// ==========================
// Compare Password
// ==========================

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(
        enteredPassword,
        this.password
    );
};

module.exports = mongoose.model("User", userSchema);
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================
// Upload Directory
// ==========================

const uploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    "profiles"
);

// Create folder automatically if missing
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// ==========================
// Storage Configuration
// ==========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const userId =
            req.user?._id || req.user?.id || "user";

        const uniqueName =
            `profile-${userId}-${Date.now()}${extension}`;

        cb(null, uniqueName);
    }
});

// ==========================
// File Type Validation
// ==========================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};

// ==========================
// Multer Configuration
// ==========================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

// ==========================
// Export
// ==========================

module.exports = upload;
const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    updateUserRole
} = require("../controllers/adminController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// ==============================
// GET ALL USERS
// ==============================
router.get(
    "/users",
    protect,
    adminOnly,
    getAllUsers
);


// ==============================
// BLOCK USER
// ==============================
router.put(
    "/users/:id/block",
    protect,
    adminOnly,
    blockUser
);


// ==============================
// UNBLOCK USER
// ==============================
router.put(
    "/users/:id/unblock",
    protect,
    adminOnly,
    unblockUser
);


// ==============================
// UPDATE USER ROLE
// ==============================
router.put(
    "/users/:id/role",
    protect,
    adminOnly,
    updateUserRole
);


// ==============================
// DELETE USER
// ==============================
router.delete(
    "/users/:id",
    protect,
    adminOnly,
    deleteUser
);


module.exports = router;
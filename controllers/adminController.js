const User = require("../models/User");

// ==============================
// GET ALL USERS
// ==============================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get Users Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==============================
// BLOCK USER
// ==============================
const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from blocking own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot block your own account"
            });
        }

        user.isBlocked = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {
        console.error("Block User Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==============================
// UNBLOCK USER
// ==============================
const unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isBlocked = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {
        console.error("Unblock User Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==============================
// DELETE USER
// ==============================
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete User Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==============================
// UPDATE USER ROLE
// ==============================
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Only these two roles are allowed
        if (!role || !["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either user or admin"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from changing own role
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: `User role changed to ${role} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Update Role Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==============================
// EXPORTS
// ==============================
module.exports = {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    updateUserRole
};
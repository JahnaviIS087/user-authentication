import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    // ==============================
    // GET ALL USERS
    // ==============================
    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await API.get("/admin/users");

            const userList =
                response.data.users || response.data;

            setUsers(
                Array.isArray(userList) ? userList : []
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ==============================
    // BLOCK USER
    // ==============================
    const handleBlock = async (id) => {
        try {
            const response = await API.put(
                `/admin/users/${id}/block`
            );

            setMessage(response.data.message);

            await fetchUsers();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to block user"
            );
        }
    };

    // ==============================
    // UNBLOCK USER
    // ==============================
    const handleUnblock = async (id) => {
        try {
            const response = await API.put(
                `/admin/users/${id}/unblock`
            );

            setMessage(response.data.message);

            await fetchUsers();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to unblock user"
            );
        }
    };

    // ==============================
    // CHANGE ROLE
    // ==============================
    const handleRoleChange = async (user) => {
        const newRole =
            user.role === "admin"
                ? "user"
                : "admin";

        const confirmed = window.confirm(
            `Change ${user.name}'s role from ${user.role} to ${newRole}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await API.put(
                `/admin/users/${user._id}/role`,
                {
                    role: newRole
                }
            );

            setMessage(response.data.message);

            await fetchUsers();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to change user role"
            );
        }
    };

    // ==============================
    // DELETE USER
    // ==============================
    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${user.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await API.delete(
                `/admin/users/${user._id}`
            );

            setMessage(response.data.message);

            await fetchUsers();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };

    // ==============================
    // SEARCH
    // ==============================
    const filteredUsers = users.filter((user) => {
        const value = search.toLowerCase();

        return (
            user.name
                ?.toLowerCase()
                .includes(value) ||
            user.email
                ?.toLowerCase()
                .includes(value) ||
            user.role
                ?.toLowerCase()
                .includes(value)
        );
    });

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    const blockedCount = users.filter(
        (user) => user.isBlocked
    ).length;

    return (
        <div className="admin-users-container">

            {/* HEADER */}
            <div className="admin-users-header">

                <div>
                    <p className="admin-page-label">
                        ADMINISTRATION
                    </p>

                    <h1>User Management</h1>

                    <p>
                        Manage registered users, roles and
                        account access.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            {/* STATISTICS */}
            <div className="admin-stats">

                <div className="admin-stat-card">
                    <span>Total Users</span>
                    <strong>{users.length}</strong>
                </div>

                <div className="admin-stat-card">
                    <span>Administrators</span>
                    <strong>{adminCount}</strong>
                </div>

                <div className="admin-stat-card">
                    <span>Active Users</span>
                    <strong>
                        {users.length - blockedCount}
                    </strong>
                </div>

                <div className="admin-stat-card">
                    <span>Blocked Users</span>
                    <strong>{blockedCount}</strong>
                </div>

            </div>


            {/* MESSAGE */}
            {message && (
                <div className="admin-message">
                    {message}
                </div>
            )}


            {/* SEARCH */}
            <div className="admin-toolbar">

                <div>
                    <h2>Registered Users</h2>

                    <p>
                        {filteredUsers.length} user
                        {filteredUsers.length !== 1
                            ? "s"
                            : ""}{" "}
                        found
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search name, email or role..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* TABLE */}
            {loading ? (

                <div className="admin-loading">
                    Loading users...
                </div>

            ) : (

                <div className="admin-table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredUsers.map((user) => (

                                <tr key={user._id}>

                                    <td>
                                        <div className="admin-user-cell">

                                            <div className="admin-user-avatar">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    "U"}
                                            </div>

                                            <strong>
                                                {user.name}
                                            </strong>

                                        </div>
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.role === "admin"
                                                    ? "role-badge role-admin"
                                                    : "role-badge role-user"
                                            }
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.isBlocked
                                                    ? "status-badge status-blocked"
                                                    : "status-badge status-active"
                                            }
                                        >
                                            <span className="badge-dot"></span>

                                            {user.isBlocked
                                                ? "Blocked"
                                                : "Active"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="admin-actions">

                                            <button
                                                className={
                                                    user.isBlocked
                                                        ? "action-unblock"
                                                        : "action-block"
                                                }
                                                onClick={() =>
                                                    user.isBlocked
                                                        ? handleUnblock(
                                                            user._id
                                                        )
                                                        : handleBlock(
                                                            user._id
                                                        )
                                                }
                                            >
                                                {user.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                            </button>

                                            <button
                                                className="action-role"
                                                onClick={() =>
                                                    handleRoleChange(
                                                        user
                                                    )
                                                }
                                            >
                                                {user.role ===
                                                "admin"
                                                    ? "Make User"
                                                    : "Make Admin"}
                                            </button>

                                            <button
                                                className="action-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        user
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="no-users">
                            No users match your search.
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default AdminUsers;
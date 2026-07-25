import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const firstLetter =
        user.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="dashboard-container">

            {/* =========================
                NAVBAR
            ========================= */}
            <nav className="dashboard-navbar">

                <div className="dashboard-brand">
                    <div className="dashboard-logo">
                        S
                    </div>

                    <div>
                        <h2>SecureAuth</h2>
                        <span>
                            Authentication & Authorization
                        </span>
                    </div>
                </div>

                <div className="dashboard-nav-user">

                    <div className="nav-user-info">
                        <strong>
                            {user.name || "User"}
                        </strong>

                        <span>
                            {user.role || "user"}
                        </span>
                    </div>

                    <div className="nav-avatar">
                        {firstLetter}
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* =========================
                MAIN CONTENT
            ========================= */}
            <main className="dashboard-main">

                {/* WELCOME */}
                <section className="dashboard-welcome">

                    <div>
                        <p className="dashboard-label">
                            DASHBOARD
                        </p>

                        <h1>
                            Welcome ,{" "}
                            {user.name || "User"}
                        </h1>

                        <p>
                            Manage your account and security
                            settings from your SecureAuth
                            dashboard.
                        </p>
                    </div>

                    <div className="account-status">
                        <span className="status-dot"></span>
                        Account Active
                    </div>

                </section>


                {/* =========================
                    ACCOUNT OVERVIEW
                ========================= */}
                <section>

                    <div className="section-heading">
                        <h2>Account Overview</h2>

                        <p>
                            Your SecureAuth account information
                        </p>
                    </div>

                    <div className="overview-grid">

                        <div className="overview-card">

                            <div className="overview-icon">
                                U
                            </div>

                            <div>
                                <span>Name</span>
                                <strong>
                                    {user.name || "User"}
                                </strong>
                            </div>

                        </div>


                        <div className="overview-card">

                            <div className="overview-icon">
                                @
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>
                                    {user.email ||
                                        "Not available"}
                                </strong>
                            </div>

                        </div>


                        <div className="overview-card">

                            <div className="overview-icon">
                                R
                            </div>

                            <div>
                                <span>Account Role</span>

                                <strong className="role-value">
                                    {user.role || "user"}
                                </strong>
                            </div>

                        </div>


                        <div className="overview-card">

                            <div className="overview-icon">
                                ✓
                            </div>

                            <div>
                                <span>Account Status</span>

                                <strong className="active-value">
                                    Active
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    QUICK ACTIONS
                ========================= */}
                <section className="dashboard-section">

                    <div className="section-heading">
                        <h2>Quick Actions</h2>

                        <p>
                            Manage your profile and account
                            security
                        </p>
                    </div>


                    <div className="action-grid">

                        {/* PROFILE */}
                        <div className="action-card">

                            <div className="action-icon">
                                U
                            </div>

                            <h3>My Profile</h3>

                            <p>
                                View and update your personal
                                information and profile picture.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/profile")
                                }
                            >
                                View Profile
                            </button>

                        </div>


                        {/* PASSWORD */}
                        <div className="action-card">

                            <div className="action-icon">
                                K
                            </div>

                            <h3>Change Password</h3>

                            <p>
                                Update your password to keep
                                your SecureAuth account secure.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/change-password"
                                    )
                                }
                            >
                                Change Password
                            </button>

                        </div>


                        {/* ADMIN ONLY */}
                        {user.role === "admin" && (

                            <div className="action-card admin-action">

                                <div className="action-icon">
                                    A
                                </div>

                                <h3>User Management</h3>

                                <p>
                                    Manage registered users,
                                    roles and account access.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/admin/users"
                                        )
                                    }
                                >
                                    Manage Users
                                </button>

                            </div>

                        )}

                    </div>

                </section>


                {/* =========================
                    SECURITY
                ========================= */}
                <section className="security-panel">

                    <div className="security-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Your account is protected</h3>

                        <p>
                            SecureAuth uses JWT authentication,
                            protected routes and role-based
                            authorization to secure your
                            account.
                        </p>
                    </div>

                    <span className="security-badge">
                        SECURE
                    </span>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}
            <footer className="dashboard-footer">

                <strong>SecureAuth</strong>

                <span>
                    Role-Based Authentication &
                    Authorization System
                </span>

            </footer>

        </div>
    );
}

export default Dashboard;
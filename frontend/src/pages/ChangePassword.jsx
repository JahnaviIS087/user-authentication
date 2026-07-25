import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ==============================
    // HANDLE INPUT
    // ==============================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ==============================
    // CHANGE PASSWORD
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.newPassword.length < 6) {
            setError(
                "New password must be at least 6 characters"
            );
            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirm password do not match"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await API.put(
                "/auth/change-password",
                {
                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword
                }
            );

            setMessage(
                response.data.message ||
                "Password changed successfully"
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-brand">
                    <div className="brand-icon">
                        S
                    </div>

                    <span>SecureAuth</span>
                </div>

                <div className="auth-heading">

                    <h1>Change Password</h1>

                    <p>
                        Update your account password securely
                    </p>

                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Enter current password"
                            value={
                                formData.currentPassword
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Minimum 6 characters"
                            value={
                                formData.newPassword
                            }
                            onChange={handleChange}
                            minLength="6"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter new password again"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            minLength="6"
                            required
                        />

                    </div>

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>

                </form>

                <div className="auth-footer">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Back to Profile
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ChangePassword;
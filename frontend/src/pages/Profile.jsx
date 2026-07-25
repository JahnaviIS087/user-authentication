import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // ==============================
    // GET PROFILE
    // ==============================
    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await API.get("/auth/profile");

            const profile = response.data.user;

            setUser(profile);

            setFormData({
                name: profile.name || "",
                email: profile.email || ""
            });

            // Keep localStorage user updated
            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ==============================
    // INPUT CHANGE
    // ==============================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ==============================
    // UPDATE PROFILE
    // ==============================
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            setMessage("");

            const response = await API.put(
                "/auth/profile",
                formData
            );

            setUser(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage(
                response.data.message ||
                "Profile updated successfully"
            );

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ==============================
    // UPLOAD PROFILE IMAGE
    // ==============================
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const imageData = new FormData();

        imageData.append(
            "profileImage",
            file
        );

        try {
            setMessage("");

            await API.put(
                "/auth/profile-image",
                imageData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            setMessage(
                "Profile image updated successfully"
            );

            await fetchProfile();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to upload profile image"
            );
        }
    };

    // ==============================
    // LOGOUT
    // ==============================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">

            <div className="profile-header">

                <div>
                    <h1>My Profile</h1>
                    <p>
                        Manage your SecureAuth account
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

            {message && (
                <div className="profile-message">
                    {message}
                </div>
            )}

            <div className="profile-card">

                <div className="profile-image-section">

                    {user?.profileImage ? (

                        <img
                            src={`http://localhost:5000${user.profileImage}`}
                            alt="Profile"
                            className="profile-image"
                        />

                    ) : (

                        <div className="profile-placeholder">
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                        </div>

                    )}

                    <h2>
                        {user?.name}
                    </h2>

                    <p>
                        {user?.email}
                    </p>

                    <span>
                        {user?.role}
                    </span>

                    <div>
                        <label>
                            Change Profile Picture
                        </label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                        />
                    </div>

                </div>

                <form
                    className="profile-form"
                    onSubmit={handleUpdate}
                >

                    <h2>Account Information</h2>

                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Role
                        </label>

                        <input
                            type="text"
                            value={user?.role || "user"}
                            disabled
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                    >
                        {updating
                            ? "Updating..."
                            : "Update Profile"}
                    </button>

                </form>

            </div>

            <div className="profile-actions">

                <button
                    onClick={() =>
                        navigate("/change-password")
                    }
                >
                    Change Password
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Profile;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditUser = ({ darkMode }) => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        username: "",
        isActive: true,
    });

    // =============================
    // FETCH SINGLE USER
    // =============================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `http://31.97.206.144:5002/api/users/${id}`
                );

                const user = res.data.data;

                setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    username: user.profile?.username || "",
                    isActive: user.accountStatus?.isActive ?? true,
                });
            } catch (err) {
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // =============================
    // HANDLE CHANGE
    // =============================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // =============================
    // UPDATE USER
    // =============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await axios.put(
                `https://apisocial.atozkeysolution.com/api/users/${id}`,
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    mobile: formData.mobile,
                    profile: {
                        username: formData.username,
                    },
                    accountStatus: {
                        isActive: formData.isActive,
                    },
                }
            );

            alert("User updated successfully ✅");
            navigate("/admin/users");
        } catch (err) {
            setError("Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading user...</div>;
    }

    return (
        <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className={`max-w-3xl mx-auto rounded-2xl shadow-lg p-6
        ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>

                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                    Edit User
                </h2>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border
                         focus:ring-2 focus:ring-blue-500 outline-none
                         dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border
                         focus:ring-2 focus:ring-blue-500 outline-none
                         dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border
                         focus:ring-2 focus:ring-blue-500 outline-none
                         dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mobile</label>
                        <input
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border
                         focus:ring-2 focus:ring-blue-500 outline-none
                         dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <span className="text-sm">Active Account</span>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Update User"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="px-6 py-2 rounded-lg border
                         hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;

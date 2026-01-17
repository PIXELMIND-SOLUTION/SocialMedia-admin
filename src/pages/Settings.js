import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Settings = ({ darkMode }) => {
  /* ------------------ SESSION DATA ------------------ */
  const adminId = JSON.parse(sessionStorage.getItem("adminId"));
  const adminEmail = JSON.parse(sessionStorage.getItem("adminemail"));
  const role = JSON.parse(sessionStorage.getItem("role"));

  console.log("Admin ID:", adminId);

  /* ------------------ FORM STATE ------------------ */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* ------------------ UPDATE PASSWORD ------------------ */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!adminId || !oldPassword || !newPassword) {
      setMessage({
        type: "error",
        text: "All fields are required",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await axios.put(
        "https://apisocial.atozkeysolution.com/api/updatepassword",
        {
          adminId,
          oldPassword,
          newPassword,
        }
      );

      setMessage({
        type: "success",
        text: "Password updated successfully",
      });

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* PAGE TITLE */}
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Settings
      </h1>

      {/* ACCOUNT INFO */}
      <div
        className={`grid md:grid-cols-3 gap-6 p-6 rounded-xl border ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <InfoCard label="Admin Email" value={adminEmail} darkMode={darkMode} />
        <InfoCard label="Role" value={role} darkMode={darkMode} />
        <InfoCard label="Admin ID" value={adminId} darkMode={darkMode} />
      </div>

      {/* UPDATE PASSWORD */}
      <div
        className={`p-6 rounded-xl border max-w-xl ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Update Password
        </h2>

        <form onSubmit={handleUpdatePassword} className={`space-y-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
          {/* OLD PASSWORD */}
          <PasswordInput
            label="Old Password"
            value={oldPassword}
            onChange={setOldPassword}
            show={showOld}
            setShow={setShowOld}
            darkMode={darkMode}
          />

          {/* NEW PASSWORD */}
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            darkMode={darkMode}
          />

          {message && (
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ------------------ REUSABLE COMPONENTS ------------------ */

const InfoCard = ({ label, value, darkMode }) => (
  <div
    className={`p-4 rounded-lg border ${
      darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-gray-50 border-gray-200"
    }`}
  >
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p
      className={`mt-1 font-medium break-all ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {value || "N/A"}
    </p>
  </div>
);

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
  darkMode,
}) => (
  <div>
    <label className="text-sm block mb-1">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg border text-sm pr-10 ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default Settings;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiImage,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import WalletAndSpins from "./WalletAndSpins";

const USERS_PER_PAGE = 8;

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://apisocial.atozkeysolution.com/api/users"
      );
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase();
    return users.filter(
      (u) =>
        u._id.toLowerCase().includes(value) ||
        u.fullName?.toLowerCase().includes(value) ||
        u.email?.toLowerCase().includes(value) ||
        u.mobile?.includes(value) ||
        u.profile?.username?.toLowerCase().includes(value)
    );
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://apisocial.atozkeysolution.com/api/users/${userId}`
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div
      className={`p-4 md:p-6 min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl shadow-lg p-5 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            Users Management
          </h1>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* TABLE */}
        <div
          className={`overflow-x-auto rounded-xl border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <table className="min-w-full text-sm">
            <thead
              className={`${
                darkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <tr>
                <th className="px-4 py-3 text-left">S NO</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Wallet & Spins</th>
                <th className="px-4 py-4">Payments</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-8">
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t transition ${
                      darkMode
                        ? "border-gray-700 text-white hover:bg-gray-700"
                        : "border-gray-200 text-gray-800 hover:bg-blue-50 hover:text-black"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {user._id || "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {user.fullName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {user.profile?.username || "-"}
                    </td>
                    <td className="px-4 py-3">{user.email || "-"}</td>
                    <td className="px-4 py-3">{user.mobile || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.accountStatus?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.accountStatus?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setOpen(true);
                          setUserId(user._id);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          darkMode
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                      >
                        <FaCoins />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/payment/user/${user._id}`)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          darkMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        <FiDollarSign size={18} />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/userposts/${user._id}`)
                          }
                          className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <FiImage size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/users/details/${user._id}`)
                          }
                          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                        >
                          <FiInfo size={18} />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-800">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : `border text-gray-800 ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {open && (
        <WalletAndSpins
          userId={userId}
          darkMode={darkMode}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Users;

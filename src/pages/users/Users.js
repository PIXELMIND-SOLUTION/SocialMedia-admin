import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiInfo, FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const USERS_PER_PAGE = 8;

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // =============================
  // FETCH USERS
  // =============================
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

  // =============================
  // SEARCH FILTER
  // =============================
  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(value) ||
        u.email?.toLowerCase().includes(value) ||
        u.mobile?.includes(value) ||
        u.profile?.username?.toLowerCase().includes(value)
    );
  }, [search, users]);

  // =============================
  // PAGINATION LOGIC
  // =============================
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // reset page on search
  }, [search]);

  // =============================
  // DELETE USER
  // =============================
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://apisocial.atozkeysolution.com/api/user/${userId}`
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-7xl mx-auto rounded-2xl shadow-lg p-5 
        ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Users Management
          </h1>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border
                         focus:ring-2 focus:ring-blue-500 outline-none
                         dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t dark:border-gray-700
                               hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3">
                      {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {user.fullName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {user.profile?.username || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {user.email || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {user.mobile || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${user.accountStatus?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}`}>
                        {user.accountStatus?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/admin/userposts/${user._id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View Posts"
                        >
                          <FiImage />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/users/details/${user._id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View Details"
                        >
                          <FiInfo />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 />
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
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border disabled:opacity-40
                           hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                <FiChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm
                    ${currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-blue-100 dark:hover:bg-gray-700"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border disabled:opacity-40
                           hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

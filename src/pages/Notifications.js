import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const PAGE_SIZE = 5;

const Notifications = ({ darkMode }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    /* ---------------- FETCH ---------------- */
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://apisocial.atozkeysolution.com/api/allnotifications"
            );

            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- DELETE ---------------- */
    const deleteNotification = async (id) => {
        if (!window.confirm("Delete this notification?")) return;

        try {
            await axios.delete(
                `https://apisocial.atozkeysolution.com/api/deletenotification/${id}`
            );

            setNotifications((prev) =>
                prev.filter((n) => n._id !== id)
            );
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    /* ---------------- SEARCH ---------------- */
    const filteredNotifications = useMemo(() => {
        return notifications.filter(
            (n) =>
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.message.toLowerCase().includes(search.toLowerCase())
        );
    }, [notifications, search]);

    /* ---------------- PAGINATION ---------------- */
    const totalPages = Math.ceil(
        filteredNotifications.length / PAGE_SIZE
    );

    const paginatedData = filteredNotifications.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    /* ---------------- TIME FORMAT ---------------- */
    const timeAgo = (date) => {
        const diff = Math.floor(
            (new Date() - new Date(date)) / 1000
        );
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"
                        }`}
                >
                    Notifications
                </h1>

                <input
                    type="text"
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm w-64
            ${darkMode
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300"
                        }`}
                />
            </div>

            {/* Table */}
            <div
                className={`overflow-x-auto rounded-xl border ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
            >
                <table className="w-full text-sm">
                    <thead>
                        <tr
                            className={`text-left ${darkMode
                                    ? "bg-gray-800 text-gray-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            <th className="p-4">S NO</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Message</th>
                            {/* <th className="p-4">Status</th> */}
                            <th className="p-4">Time</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center">
                                    No notifications found
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            paginatedData.map((item) => (
                                <tr
                                    key={item._id}
                                    className={`border-t transition
                  ${darkMode
                                            ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                                            : "border-gray-100 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <td className="p-4 font-medium">
                                        {notifications.indexOf(item) + 1}
                                    </td>
                                    <td className="p-4 font-medium">
                                        {item.title}
                                    </td>

                                    <td className="p-4 max-w-md">
                                        {item.message}
                                    </td>

                                    {/* <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                        ${
                          item.read
                            ? "bg-gray-200 text-gray-600"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {item.read ? "Read" : "Unread"}
                    </span>
                  </td> */}

                                    <td className="p-4 text-xs">
                                        {timeAgo(item.createdAt)}
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() =>
                                                deleteNotification(item._id)
                                            }
                                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end gap-2">
                    {Array.from({ length: totalPages }).map(
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-md text-sm
                ${currentPage === index + 1
                                        ? "bg-blue-600 text-white"
                                        : darkMode
                                            ? "bg-gray-800 text-gray-300"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;

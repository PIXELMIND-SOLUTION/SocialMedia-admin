import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PAGE_SIZES = [5, 10, 20];

const UserPayments = ({ darkMode }) => {
    const { userId } = useParams();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserPayments();
    }, [userId]);

    const fetchUserPayments = async () => {
        try {
            const res = await axios.get(
                `https://apisocial.atozkeysolution.com/api/payments/user/${userId}`
            );
            setPayments(res.data.data || []);
        } catch (error) {
            console.error("Error fetching user payments", error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= SEARCH & FILTER ================= */
    const filteredPayments = useMemo(() => {
        return payments.filter((p) => {
            const text = `${p.razorpayOrderId}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredPayments.length / pageSize);
    const paginatedData = filteredPayments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    /* ================= EXPORT CSV ================= */
    const exportCSV = () => {
        const headers = [
            "S NO",
            "Order ID",
            "Coins",
            "Amount",
            "Status",
            "Created At",
        ];

        const rows = filteredPayments.map((p, index) => [
            index + 1,
            p.razorpayOrderId,
            p.coins,
            p.amount,
            p.status,
            new Date(p.createdAt).toLocaleString(),
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "user-payments.csv";
        link.click();
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className={`inline-flex items-center gap-2 text-sm font-medium 
    ${darkMode ? "text-blue-400" : "text-blue-600"} 
    hover:underline`}
            >
                ← Back
            </button>

            {/* HEADER */}
            <h1
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"
                    }`}
            >
                User Payments
            </h1>

            {/* CONTROLS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search Order ID..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                            }`}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                            }`}
                    >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="created">Created</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className={`px-3 py-2 rounded-lg text-sm border ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                            }`}
                    >
                        {PAGE_SIZES.map((s) => (
                            <option key={s} value={s}>
                                {s} / page
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div
                className={`overflow-x-auto rounded-xl shadow ${darkMode ? "bg-gray-900" : "bg-white"
                    }`}
            >
                {loading ? (
                    <div className="p-6 text-center">Loading...</div>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead
                            className={`${darkMode
                                    ? "bg-gray-800 text-gray-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            <tr>
                                <th className="px-4 py-3">S NO</th>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Coins</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className={`border-t ${darkMode
                                            ? "border-gray-800 text-white hover:bg-gray-800"
                                            : "hover:bg-gray-50"
                                        }`}
                                >
                                    <td className="px-4 py-3 text-center">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-xs break-all">
                                        {item.razorpayOrderId}
                                    </td>
                                    <td className="px-4 py-3 text-center">{item.coins}</td>
                                    <td className="px-4 py-3 text-center">₹{item.amount}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "success"
                                                    ? darkMode
                                                        ? "bg-green-900 text-green-300"
                                                        : "bg-green-100 text-green-700"
                                                    : darkMode
                                                        ? "bg-yellow-900 text-yellow-300"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 py-1 rounded bg-gray-200">
                    {currentPage} / {totalPages || 1}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserPayments;

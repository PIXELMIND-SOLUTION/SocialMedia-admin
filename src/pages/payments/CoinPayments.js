import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PAGE_SIZES = [5, 10, 20];

const CoinPayments = ({ darkMode, collapsed }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://apisocial.atozkeysolution.com/api/coin-payments"
      );
      setPayments(res.data.data || []);
    } catch (error) {
      console.error("Error fetching payments", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE PAYMENT ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await axios.delete(
        `https://apisocial.atozkeysolution.com/api/payment/${id}`
      );

      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete payment", error);
      alert("Failed to delete payment");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const text =
        `${item.userId?.fullName} ${item.userId?.email} ${item.razorpayOrderId}`
          .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

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
      "User Name",
      "Email",
      "Order ID",
      "Coins",
      "Amount",
      "Status",
      "Created At",
    ];

    const rows = filteredPayments.map((p, index) => [
      index + 1,
      p.userId?.fullName,
      p.userId?.email,
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
    link.download = "coin-payments.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Payments Management
      </h1>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search name, email, order id..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-lg text-sm border ${
              darkMode
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
            className={`px-3 py-2 rounded-lg text-sm border ${
              darkMode
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
            className={`px-3 py-2 rounded-lg text-sm border ${
              darkMode
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
        className={`overflow-x-auto rounded-xl shadow ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead
              className={`${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <tr>
                <th className="px-4 py-3 text-left">S NO</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Coins</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item._id}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-800 text-white hover:bg-gray-800"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {item.userId?.fullName}
                  </td>
                  <td className="px-4 py-3">{item.userId?.email}</td>
                  <td className="px-4 py-3 text-xs break-all">
                    {item.razorpayOrderId}
                  </td>
                  <td className="px-4 py-3 text-center">{item.coins}</td>
                  <td className="px-4 py-3 text-center">₹{item.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "success"
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
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/admin/payment/${item._id}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View
                    </button>

                    <button
                      disabled={deletingId === item._id}
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No records found
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

export default CoinPayments;

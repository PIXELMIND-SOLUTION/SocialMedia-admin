import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PAGE_SIZES = [5, 10, 20];
const PAYMENT_TABS = ["completed", "pending"];

const CampaignPayments = ({ darkMode }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ===== Filters ===== */
  const [search, setSearch] = useState("");
  const [paymentTab, setPaymentTab] = useState("completed");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  /* ===== Pagination ===== */
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://apisocial.atozkeysolution.com/api/campaigns/payment/orderpayments"
      );
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteCampaign = async (id) => {
    if (!window.confirm("Delete this campaign order?")) return;
    try {
      setDeletingId(id);
      await axios.delete(
        `https://apisocial.atozkeysolution.com/api/campaigns/deletecamporder/${id}`
      );
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= PACKAGE OPTIONS ================= */
  const packageOptions = useMemo(() => {
    const set = new Set();
    payments.forEach((p) => {
      if (p.purchasedPackage?.packageName) {
        set.add(p.purchasedPackage.packageName);
      }
    });
    return Array.from(set);
  }, [payments]);

  /* ================= FILTER LOGIC ================= */
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const paymentStatus =
        item.purchasedPackage?.paymentStatus || "pending";
      if (paymentStatus !== paymentTab) return false;

      const text = `${item.fullName} ${item.email} ${item.userId?.fullName}`
        .toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;

      if (
        approvalFilter !== "all" &&
        item.adminApprovalStatus !== approvalFilter
      )
        return false;

      if (
        packageFilter !== "all" &&
        item.purchasedPackage?.packageName !== packageFilter
      )
        return false;

      const price = item.purchasedPackage?.price || 0;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      const created = new Date(item.createdAt);
      if (fromDate && created < new Date(fromDate)) return false;
      if (toDate && created > new Date(toDate)) return false;

      return true;
    });
  }, [
    payments,
    paymentTab,
    search,
    approvalFilter,
    packageFilter,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
  ]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;

  const paginatedData = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "S NO",
      "Campaign",
      "User",
      "Email",
      "Package",
      "Price",
      "Payment Status",
      "Approval Status",
      "Created At",
    ];

    const rows = filteredPayments.map((p, i) => [
      i + 1,
      p.fullName,
      p.userId?.fullName,
      p.email,
      p.purchasedPackage?.packageName || "-",
      p.purchasedPackage?.price || "-",
      p.purchasedPackage?.paymentStatus,
      p.adminApprovalStatus,
      new Date(p.createdAt).toLocaleString(),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "campaign-payments.csv";
    link.click();
  };

  const resetFilters = () => {
    setSearch("");
    setApprovalFilter("all");
    setPackageFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Campaign Payments
      </h1>

      {/* PAYMENT STATUS NAV */}
      <div className="flex gap-2 border-b pb-2">
        {PAYMENT_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setPaymentTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
              paymentTab === tab
                ? "bg-blue-600 text-white"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FILTERS */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-xl ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        >
          <option value="all">All Approval</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={packageFilter}
          onChange={(e) => setPackageFilter(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        >
          <option value="all">All Packages</option>
          {packageOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className={`px-3 py-2 rounded border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* EXPORT + PAGE SIZE */}
      <div className="flex justify-between items-center">
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Export CSV
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded border ${
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
                  : "bg-gray-100"
              }`}
            >
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Approval</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, i) => (
                <tr
                  key={item._id}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-800 text-white hover:bg-gray-800"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * pageSize + i + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {item.fullName}
                  </td>
                  <td className="px-4 py-3">
                    {item.userId?.fullName}
                  </td>
                  <td className="px-4 py-3">
                    {item.purchasedPackage?.packageName}
                  </td>
                  <td className="px-4 py-3">
                    ₹{item.purchasedPackage?.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.purchasedPackage?.paymentStatus ===
                        "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.purchasedPackage?.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.adminApprovalStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.adminApprovalStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.adminApprovalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={()=> navigate(`/admin/campaign-payment/${item._id}`)}
                      className="px-3 py-1 mr-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      View
                    </button>
                    <button
                      disabled={deletingId === item._id}
                      onClick={() => deleteCampaign(item._id)}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                    >
                      {deletingId === item._id
                        ? "Deleting..."
                        : "Delete"}
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

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1 rounded bg-gray-200">
          Page {currentPage} of {totalPages}
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

export default CampaignPayments;

import React, { useMemo, useState } from "react";

const PAGE_SIZES = [10, 20, 50];

const SpinHistory = ({ darkMode, spins, onDelete }) => {
    const [search, setSearch] = useState("");
    const [rewardFilter, setRewardFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    /* ================= FILTER + SEARCH ================= */
    const filteredSpins = useMemo(() => {
        return spins.filter((s) => {
            const text = `${s.userId?.fullName || ""} ${s.userId?.email || ""} ${s.reward || ""
                }`.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesReward =
                rewardFilter === "all" || s.reward === rewardFilter;

            return matchesSearch && matchesReward;
        });
    }, [spins, search, rewardFilter]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredSpins.length / pageSize);
    const paginatedSpins = filteredSpins.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    /* Reset page when filters change */
    React.useEffect(() => {
        setPage(1);
    }, [search, rewardFilter, pageSize]);

    /* ================= UI ================= */
    return (
        <section
            className={`p-6 rounded-xl shadow space-y-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                }`}
        >
            <h2 className="text-lg font-semibold">
                📊 Spin History <span className="text-red-500">*</span>
            </h2>

            {/* ================= CONTROLS ================= */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search user / email / reward"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border text-white focus:ring-2 focus:ring-indigo-500"
                />

                {/* Reward Filter */}
                <select
                    value={rewardFilter}
                    onChange={(e) => setRewardFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-white"
                >
                    <option value="all">All Rewards</option>
                    {[...new Set(spins.map((s) => s.reward))].map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                {/* Page Size */}
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border text-white"
                >
                    {PAGE_SIZES.map((s) => (
                        <option key={s} value={s}>
                            {s} / page
                        </option>
                    ))}
                </select>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                        <tr>
                            <th className="p-3 text-left">S NO</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Reward</th>
                            <th className="p-3 text-left">Coins</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedSpins.map((s) => (
                            <tr key={s._id} className="border-t">
                                <td className="p-3">{spins.indexOf(s) + 1}</td>
                                <td className="p-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {s.userId?.fullName || "Unknown"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {s.userId?.email}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-3">{s.reward}</td>
                                <td className="p-3">{s.coins}</td>
                                <td className="p-3">
                                    {new Date(s.createdAt).toLocaleString()}
                                </td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => onDelete(s._id)}
                                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {paginatedSpins.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">
                                    No spins found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                    ? "bg-indigo-600 text-white"
                                    : "border"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export default SpinHistory;

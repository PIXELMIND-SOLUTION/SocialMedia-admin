import React, { useEffect, useMemo, useState } from "react";

const API = "https://apisocial.atozkeysolution.com/api";
const PAGE_SIZES = [5, 10, 20];

const WalletAndSpins = ({ userId, darkMode, onClose }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    // filters & pagination
    const [search, setSearch] = useState("");
    const [coinFilter, setCoinFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [userRes, walletRes] = await Promise.all([
                    fetch(`${API}/users/${userId}`),
                    fetch(`${API}/wallet/${userId}`)
                ]);

                const userData = await userRes.json();
                const walletData = await walletRes.json();

                setUser(userData.data);
                setWallet(walletData.data);
            } catch (err) {
                console.error("Failed to fetch wallet/user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [userId]);

    /* ================= DERIVED DATA ================= */
    const spinHistory = useMemo(() => {
        if (!wallet?.history) return [];
        return wallet.history.filter((h) => h.type === "spin");
    }, [wallet]);

    const filteredHistory = useMemo(() => {
        return spinHistory.filter((h) => {
            const text = `${h.message || ""} ${h.coins}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());

            const matchesCoin =
                coinFilter === "all" ||
                (coinFilter === "credit" && h.coins > 0) ||
                (coinFilter === "debit" && h.coins < 0);

            return matchesSearch && matchesCoin;
        });
    }, [spinHistory, search, coinFilter]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredHistory.length / pageSize);

    const paginatedHistory = useMemo(() => {
        return filteredHistory.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
    }, [filteredHistory, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [search, coinFilter, pageSize]);

    /* ================= EARLY RETURNS (SAFE) ================= */
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !wallet) return null;

    /* ================= UI ================= */
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center">
            <div
                className={`w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
        `}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">👤 User Wallet & Spins</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* USER INFO */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    {user.profile?.image ? (
                        <img
                            src={user.profile.image}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border"
                        />
                    ) : (
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white
                            bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                        >
                            {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">@{user.profile?.username}</p>
                    </div>
                </div>

                {/* WALLET SUMMARY */}
                <div
                    className={`rounded-xl p-6 mb-8 flex justify-between items-center
            ${darkMode ? "bg-gray-800" : "bg-gray-100"}
          `}
                >
                    <div>
                        <p className="text-sm text-gray-500">Total Coins</p>
                        <p className="text-3xl font-bold text-indigo-500">
                            {wallet.coins}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Wallet ID: {wallet._id}
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search message or coins"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border"
                    />

                    <select
                        value={coinFilter}
                        onChange={(e) => setCoinFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border"
                    >
                        <option value="all">All</option>
                        <option value="credit">Credits</option>
                        <option value="debit">Debits</option>
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border"
                    >
                        {PAGE_SIZES.map((s) => (
                            <option key={s} value={s}>
                                {s} / page
                            </option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                            <tr>
                                <th className="p-3 text-left">Message</th>
                                <th className="p-3">Coins</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHistory.map((h) => (
                                <tr key={h._id} className="border-t">
                                    <td className="p-3">{h.message}</td>
                                    <td
                                        className={`p-3 font-semibold ${h.coins > 0 ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {h.coins > 0 ? `+${h.coins}` : h.coins}
                                    </td>
                                    <td className="p-3">
                                        {new Date(h.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {paginatedHistory.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-6 text-center text-gray-500">
                                        No spin history found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-6 flex-wrap">
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

                {/* FOOTER */}
                <div className="pt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletAndSpins;

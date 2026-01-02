import React, { useEffect, useState } from "react";

const API_BASE = "https://apisocial.atozkeysolution.com/api/admin";

const CoinPackage = ({ darkMode }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    coins: "",
    price: "",
    originalPrice: ""
  });
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH ALL PACKAGES ================= */
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/packages`);
      const data = await res.json();
      setPackages(data.data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API_BASE}/package/${editingId}`
      : `${API_BASE}/package`;

    const method = editingId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coins: Number(form.coins),
          price: Number(form.price),
          originalPrice: form.originalPrice
            ? Number(form.originalPrice)
            : null
        })
      });

      setForm({ coins: "", price: "", originalPrice: "" });
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;

    try {
      await fetch(`${API_BASE}/package/${id}`, {
        method: "DELETE"
      });
      fetchPackages();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setForm({
      coins: pkg.coins,
      price: pkg.price,
      originalPrice: pkg.originalPrice || ""
    });
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Coin Package Management
      </h1>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-xl shadow ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800"
        }`}
      >
        <input
          type="number"
          placeholder="Coins"
          value={form.coins}
          onChange={(e) => setForm({ ...form, coins: e.target.value })}
          required
          className="px-4 py-2 rounded border focus:outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          className="px-4 py-2 rounded border focus:outline-none"
        />

        <input
          type="number"
          placeholder="Original Price (optional)"
          value={form.originalPrice}
          onChange={(e) =>
            setForm({ ...form, originalPrice: e.target.value })
          }
          className="px-4 py-2 rounded border focus:outline-none"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 font-semibold"
        >
          {editingId ? "Update" : "Add"} Package
        </button>
      </form>

      {/* ===== TABLE ===== */}
      <div
        className={`overflow-x-auto rounded-xl shadow ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full text-sm">
          <thead
            className={`${
              darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="p-3 text-left">Coins</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Original</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  No packages found
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr
                  key={pkg._id}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-700 text-gray-200"
                      : "border-gray-200"
                  }`}
                >
                  <td className="p-3">{pkg.coins}</td>
                  <td className="p-3">₹{pkg.price}</td>
                  <td className="p-3">
                    {pkg.originalPrice ? `₹${pkg.originalPrice}` : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        pkg.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="px-3 py-1 rounded bg-yellow-500 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinPackage;

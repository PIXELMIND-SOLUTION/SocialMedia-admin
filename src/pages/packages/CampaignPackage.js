import React, { useEffect, useState } from "react";

const API_BASE = "https://apisocial.atozkeysolution.com/api";

const PACKAGE_OPTIONS = ["Basic", "Standard", "Premium", "Enterprise"];

const CampaignPackage = ({ darkMode }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [contentInput, setContentInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    durationHours: "",
    postsInterval: "",
    targetUsers: "",
    content: [],
    features: [],
    priority: ""
  });

  /* ================= FETCH ================= */
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/campaign-packages`);
      const data = await res.json();
      setPackages(data.data || []);
    } catch (err) {
      console.error(err);
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
      ? `${API_BASE}/campaign-packages/${editingId}`
      : `${API_BASE}/admin/campaign-packages`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        durationHours: Number(form.durationHours),
        postsInterval: Number(form.postsInterval),
        targetUsers: Number(form.targetUsers),
        priority: Number(form.priority),
        isAdmin: "true"
      })
    });

    resetForm();
    fetchPackages();
  };

  /* ================= EDIT ================= */
  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setForm({
      name: pkg.name,
      price: pkg.price,
      durationHours: pkg.durationHours,
      postsInterval: pkg.postsInterval,
      targetUsers: pkg.targetUsers,
      content: pkg.content || [],
      features: pkg.features || [],
      priority: pkg.priority
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    await fetch(`${API_BASE}/campaign-packages/${id}`, { method: "DELETE" });
    fetchPackages();
  };

  /* ================= TAG HANDLERS ================= */
  const addTag = (type) => {
    if (type === "content" && contentInput.trim()) {
      setForm({ ...form, content: [...form.content, contentInput.trim()] });
      setContentInput("");
    }
    if (type === "features" && featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeTag = (type, value) => {
    setForm({
      ...form,
      [type]: form[type].filter((v) => v !== value)
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      durationHours: "",
      postsInterval: "",
      targetUsers: "",
      content: [],
      features: [],
      priority: ""
    });
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Campaign Package Management
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-xl shadow ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* PACKAGE NAME DROPDOWN */}
        <select
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className={`px-4 py-2 rounded border focus:outline-none ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
          }`}
        >
          <option value="">Select Package</option>
          {PACKAGE_OPTIONS.map((pkg) => (
            <option key={pkg} value={pkg}>
              {pkg}
            </option>
          ))}
        </select>

        <Input label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
        <Input label="Duration (Hours)" type="number" value={form.durationHours} onChange={(v) => setForm({ ...form, durationHours: v })} />
        <Input label="Posts Interval" type="number" value={form.postsInterval} onChange={(v) => setForm({ ...form, postsInterval: v })} />
        <Input label="Target Users" type="number" value={form.targetUsers} onChange={(v) => setForm({ ...form, targetUsers: v })} />
        <Input label="Priority" type="number" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} />

        <TagInput
          label="Content"
          value={contentInput}
          onChange={setContentInput}
          onAdd={() => addTag("content")}
          tags={form.content}
          onRemove={(v) => removeTag("content", v)}
        />

        <TagInput
          label="Features"
          value={featureInput}
          onChange={setFeatureInput}
          onAdd={() => addTag("features")}
          tags={form.features}
          onRemove={(v) => removeTag("features", v)}
        />

        <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-3 pt-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
            {editingId ? "Update Package" : "Create Package"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className={`rounded-xl shadow overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <table className="w-full text-sm min-w-[900px]">
          <thead className={darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Target</th>
              <th className="p-3">Content</th>
              <th className="p-3">Features</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}>
            {packages.map((pkg) => (
              <tr key={pkg._id} className="border-t text-center">
                <td className="p-3">{pkg.name}</td>
                <td className="p-3">₹{pkg.price}</td>
                <td className="p-3">{pkg.durationHours}h</td>
                <td className="p-3">{pkg.targetUsers}</td>
                <td className="p-3">{pkg.content.join(", ")}</td>
                <td className="p-3">{pkg.features.join(", ")}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => handleEdit(pkg)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pkg._id)} className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, value, onChange, type = "text" }) => (
  <input
    type={type}
    placeholder={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    required
    className="px-4 py-2 rounded border focus:outline-none"
  />
);

/* ================= TAG INPUT ================= */
const TagInput = ({ label, value, onChange, onAdd, tags, onRemove }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold">{label}</label>
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded"
        placeholder={`Add ${label}`}
      />
      <button type="button" onClick={onAdd} className="px-4 py-2 bg-green-600 text-white rounded">
        Add
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => onRemove(tag)}>✕</button>
        </span>
      ))}
    </div>
  </div>
);

export default CampaignPackage;

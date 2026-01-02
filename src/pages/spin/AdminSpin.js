import React, { useEffect, useState } from "react";
import SpinConfig from "./SpinConfig";
import SpinSlots from "./SpinSlots";
import SpinHistory from "./SpinHistory";

const API = "https://apisocial.atozkeysolution.com/api";

const TABS = [
  { key: "config", label: "Spin Config" },
  { key: "slots", label: "Spin Slots" },
  { key: "history", label: "Spin History" }
];

const AdminSpinDashboard = ({ darkMode }) => {
  const [slots, setSlots] = useState([]);
  const [spins, setSpins] = useState([]);
  const [activeTab, setActiveTab] = useState("config");

  /* ================= FETCH ================= */
  const fetchWheel = async () => {
    const res = await fetch(`${API}/wheel`);
    const data = await res.json();
    setSlots(data.data || []);
  };

  const fetchSpins = async () => {
    const res = await fetch(`${API}/allspins`);
    const data = await res.json();
    setSpins(data.data || []);
  };

  useEffect(() => {
    fetchWheel();
    fetchSpins();
  }, []);

  /* ================= ACTIONS ================= */
  const saveSlot = async (slot) => {
    await fetch(`${API}/slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot)
    });
    fetchWheel();
  };

  const saveLimit = async (limit) => {
    await fetch(`${API}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxDailySpins: Number(limit) })
    });
    alert("Spin limit updated");
  };

  const deleteSpin = async (id) => {
    if (!window.confirm("Delete this spin?")) return;
    await fetch(`${API}/spin/${id}`, { method: "DELETE" });
    fetchSpins();
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* TITLE */}
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        🎡 Spin Wheel Admin Dashboard
      </h1>

      {/* ================= NAVBAR ================= */}
      <div
        className={`flex flex-wrap gap-2 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition
              ${
                activeTab === tab.key
                  ? darkMode
                    ? "bg-gray-800 text-white border-b-2 border-indigo-500"
                    : "bg-white text-indigo-600 border-b-2 border-indigo-500"
                  : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-indigo-600"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div>
        {activeTab === "config" && (
          <SpinConfig darkMode={darkMode} onSave={saveLimit} />
        )}

        {activeTab === "slots" && (
          <SpinSlots darkMode={darkMode} slots={slots} onSave={saveSlot} />
        )}

        {activeTab === "history" && (
          <SpinHistory
            darkMode={darkMode}
            spins={spins}
            onDelete={deleteSpin}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSpinDashboard;

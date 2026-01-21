import React, { useEffect, useState } from "react";

const SpinSlots = ({ darkMode, slots, onSave }) => {
  return (
    <section
      className={`p-6 rounded-xl shadow ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-lg font-semibold mb-6">
        🎯 Spin Slots (Exactly 8) <span className="text-red-500">*</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => {
          const slot = slots.find((s) => s.position === i + 1) || {};
          return (
            <SlotCard
              key={i}
              position={i + 1}
              slot={slot}
              darkMode={darkMode}
              onSave={onSave}
            />
          );
        })}
      </div>
    </section>
  );
};

const SlotCard = ({ position, slot, darkMode, onSave }) => {
  const [data, setData] = useState({
    position,
    label: "",
    coins: "",
    spinAgain: false,
    isActive: true
  });

  useEffect(() => {
    setData({
      position,
      label: slot.label || "",
      coins: slot.coins || "",
      spinAgain: slot.spinAgain || false,
      isActive: slot.isActive ?? true
    });
  }, [slot, position]);

  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <h3 className="font-semibold mb-2">Slot {position}</h3>

      <input
        value={data.label}
        onChange={(e) => setData({ ...data, label: e.target.value })}
        placeholder="Label"
        required
        className="w-full mb-2 px-3 py-2 rounded border text-white"
      />

      <input
        type="number"
        value={data.coins}
        onChange={(e) => setData({ ...data, coins: e.target.value })}
        placeholder="Coins"
        required
        className="w-full mb-2 px-3 py-2 rounded border text-white"
      />

      <label className="flex items-center gap-2 text-sm mb-2">
        <input
          type="checkbox"
          checked={data.spinAgain}
          onChange={(e) =>
            setData({ ...data, spinAgain: e.target.checked })
          }
        />
        Spin Again
      </label>

      <label className="flex items-center gap-2 text-sm mb-4">
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) =>
            setData({ ...data, isActive: e.target.checked })
          }
        />
        Active
      </label>

      <button
        onClick={() => onSave(data)}
        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
      >
        Save Slot
      </button>
    </div>
  );
};

export default SpinSlots;

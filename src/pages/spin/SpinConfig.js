import React, { useState } from "react";

const SpinConfig = ({ darkMode, onSave }) => {
  const [limit, setLimit] = useState("");

  return (
    <section
      className={`p-6 rounded-xl shadow ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">
        ⚙️ Spin Configuration <span className="text-red-500">*</span>
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="number"
          required
          placeholder="Max spins per day"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => onSave(limit)}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          Save
        </button>
      </div>
    </section>
  );
};

export default SpinConfig;

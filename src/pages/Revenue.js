import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const Revenue = ({ darkMode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        "https://apisocial.atozkeysolution.com/api/getrevenue"
      );
      setData(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`p-6 text-center ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading revenue...
      </div>
    );
  }

  /* ================= GRAPH DATA ================= */
  const barData = [
    { name: "Coins", revenue: data.totalCoinRevenue },
    { name: "Campaigns", revenue: data.totalCampaignRevenue },
  ];

  const pieData = [
    { name: "Coin Revenue", value: data.totalCoinRevenue },
    { name: "Campaign Revenue", value: data.totalCampaignRevenue },
  ];

  const lineData = [
    { name: "Coins", payments: data.totalCoinPayments },
    { name: "Campaigns", payments: data.totalCampaignPayments },
  ];

  const COLORS = ["#22c55e", "#3b82f6"];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Revenue Dashboard
      </h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            value: `₹${data.totalRevenue}`,
            color: "from-green-500 to-green-700",
          },
          {
            label: "Coin Revenue",
            value: `₹${data.totalCoinRevenue}`,
            color: "from-blue-500 to-blue-700",
          },
          {
            label: "Campaign Revenue",
            value: `₹${data.totalCampaignRevenue}`,
            color: "from-purple-500 to-purple-700",
          },
          {
            label: "Total Payments",
            value:
              data.totalCoinPayments + data.totalCampaignPayments,
            color: "from-orange-500 to-orange-700",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-xl p-5 text-white bg-gradient-to-r ${card.color} shadow`}
          >
            <p className="text-sm opacity-90">{card.label}</p>
            <h2 className="text-2xl font-bold mt-1">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div
          className={`rounded-xl p-4 shadow ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2
            className={`font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Revenue Comparison
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#22c55e" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div
          className={`rounded-xl p-4 shadow ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2
            className={`font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Revenue Distribution
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div
          className={`rounded-xl p-4 shadow lg:col-span-2 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2
            className={`font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Payments Count
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="payments"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Revenue;

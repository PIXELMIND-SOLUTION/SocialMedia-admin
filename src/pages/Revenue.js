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
        className={`p-10 text-center text-sm ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading revenue dashboard...
      </div>
    );
  }

  /* ================= DATA ================= */
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
    <div className="space-y-10">
      {/* HEADER */}
      <h1
        className={`text-3xl font-bold tracking-tight ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Revenue Dashboard
      </h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            value: `₹${data.totalRevenue}`,
            gradient: "from-emerald-500 to-emerald-700",
          },
          {
            label: "Coin Revenue",
            value: `₹${data.totalCoinRevenue}`,
            gradient: "from-blue-500 to-blue-700",
          },
          {
            label: "Campaign Revenue",
            value: `₹${data.totalCampaignRevenue}`,
            gradient: "from-violet-500 to-violet-700",
          },
          {
            label: "Total Payments",
            value:
              data.totalCoinPayments + data.totalCampaignPayments,
            gradient: "from-orange-500 to-orange-700",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl p-6 text-white
            bg-gradient-to-br ${card.gradient}
            shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1`}
          >
            <p className="text-sm opacity-90">{card.label}</p>
            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>

            {/* glow */}
            <div className="absolute inset-0 bg-white/10 blur-3xl opacity-20" />
          </div>
        ))}
      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* BAR CHART */}
        <ChartCard title="Revenue Comparison" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PIE CHART */}
        <ChartCard title="Revenue Distribution" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={4}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE CHART */}
        <ChartCard
          title="Payments Trend"
          darkMode={darkMode}
          full
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
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
        </ChartCard>
      </div>
    </div>
  );
};

/* ================= REUSABLE CARD ================= */

const ChartCard = ({ title, children, darkMode, full }) => (
  <div
    className={`rounded-2xl p-6 shadow-lg transition ${
      darkMode
        ? "bg-gray-900 border border-gray-800"
        : "bg-white border border-gray-200"
    } ${full ? "xl:col-span-2" : ""}`}
  >
    <h2
      className={`text-lg font-semibold mb-4 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {title}
    </h2>
    {children}
  </div>
);

export default Revenue;

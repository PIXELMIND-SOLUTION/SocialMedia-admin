import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  Heart,
  MessageCircle,
  Megaphone,
  DollarSign,
  Loader2,
  AlertCircle,
  BarChart3,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  CalendarDays,
  Grid3x3,
  PieChart,
  LineChart,
  Moon,
  Sun,
  Eye,
  EyeOff
} from "lucide-react";

/* ================= CONSTANTS & CONFIG ================= */
const API_BASE_URL = "https://apisocial.atozkeysolution.com/api";

const GROUP_BY_OPTIONS = [
  { value: "day", label: "Daily View", icon: CalendarDays },
  { value: "week", label: "Weekly View", icon: Grid3x3 },
  { value: "month", label: "Monthly View", icon: PieChart },
  { value: "year", label: "Yearly View", icon: LineChart }
];

const METRIC_OPTIONS = [
  { value: "all", label: "All Metrics" },
  { value: "registrations", label: "Registrations" },
  { value: "posts", label: "Posts" },
  { value: "likes", label: "Likes" },
  { value: "comments", label: "Comments" },
  { value: "campaigns", label: "Campaigns" },
  { value: "spins", label: "Spins" },
  { value: "revenue", label: "Revenue" }
];

/* ================= HELPER FUNCTIONS ================= */
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateString = (dateStr, groupBy) => {
  if (groupBy === "year") return dateStr;
  if (groupBy === "month") return dateStr;
  if (groupBy === "week") return dateStr;
  return dateStr; // day format YYYY-MM-DD
};

const formatDisplayDate = (dateStr, groupBy) => {
  if (groupBy === "year") return dateStr;
  if (groupBy === "month") {
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }
  if (groupBy === "week") {
    const [year, week] = dateStr.split("-W");
    return `Week ${week}, ${year}`;
  }
  // day
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const getDefaultDateRange = (groupBy) => {
  const today = new Date();
  const startDate = new Date(today);
  
  switch (groupBy) {
    case "day":
      startDate.setDate(today.getDate() - 30); // Last 30 days
      break;
    case "week":
      startDate.setDate(today.getDate() - 84); // Last 12 weeks
      break;
    case "month":
      startDate.setMonth(today.getMonth() - 11); // Last 12 months
      break;
    case "year":
      startDate.setFullYear(today.getFullYear() - 5); // Last 5 years
      break;
    default:
      startDate.setDate(today.getDate() - 30);
  }
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(today)
  };
};

/* ================= COMPONENTS ================= */
const MetricCard = ({ title, value, icon: Icon, change, darkMode, loading = false, index = 0 }) => {
  // Define gradients for dark mode
  const darkGradients = [
    "from-emerald-500 to-emerald-700",
    "from-blue-500 to-blue-700", 
    "from-violet-500 to-violet-700",
    "from-orange-500 to-orange-700",
    "from-rose-500 to-rose-700"
  ];
  
  const gradient = darkGradients[index % darkGradients.length];
  
  if (darkMode) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
        <div className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            {change !== undefined && (
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${change >= 0
                  ? "bg-green-900/40 text-green-200"
                  : "bg-red-900/40 text-red-200"
                }`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            )}
          </div>
          
          <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
          
          {loading ? (
            <div className="animate-pulse h-10 w-32 bg-white/20 rounded-lg mt-2"></div>
          ) : (
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          )}
        </div>
        
        {/* glow effect */}
        <div className="absolute inset-0 bg-white/10 blur-3xl opacity-20" />
      </div>
    );
  }
  
  // Light mode
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gray-100">
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
          {change !== undefined && (
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${change >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        
        {loading ? (
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-lg mt-2"></div>
        ) : (
          <h2 className="text-3xl font-bold mt-2 text-gray-900">{value}</h2>
        )}
      </div>
    </div>
  );
};

const DataTable = ({ data, columns, darkMode, loading = false }) => {
  if (darkMode) {
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-700"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="px-6 py-4">
                        <div className="animate-pulse h-4 rounded bg-gray-700"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="w-16 h-16 mb-4 text-gray-600" />
                      <p className="font-medium text-gray-400">
                        No data available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-800/30 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 whitespace-nowrap text-gray-300 border-b border-gray-800"
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  // Light mode
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 border-b border-gray-200"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="animate-pulse h-4 rounded bg-gray-200"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <BarChart3 className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="font-medium text-gray-600">
                      No data available
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 whitespace-nowrap text-gray-900 border-b border-gray-200"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const CalendarFilter = ({ darkMode }) => {
  // State for data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for filters
  const [groupBy, setGroupBy] = useState("day");
  const [dateRange, setDateRange] = useState(getDefaultDateRange("day"));
  const [selectedMetrics, setSelectedMetrics] = useState(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState({ field: "date", direction: "desc" });
  
  // State for UI
//   const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [exportLoading, setExportLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  // Fetch data function
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = dateRange;
      const url = `${API_BASE_URL}/analytics?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data);
        setTotals(data.totals);
        setFilteredData(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, groupBy]);
  
  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);
  
  // Apply filters
  useEffect(() => {
    if (!analyticsData?.data) return;
    
    let filtered = [...analyticsData.data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const dateStr = formatDisplayDate(item.date, groupBy).toLowerCase();
        return dateStr.includes(query);
      });
    }
    
    // Apply metric filter
    if (!selectedMetrics.includes("all") && selectedMetrics.length > 0) {
      filtered = filtered.filter(item => {
        return selectedMetrics.some(metric => item[metric]);
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy.field] || a.date;
      const bValue = b[sortBy.field] || b.date;
      
      if (sortBy.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredData(filtered);
  }, [analyticsData, searchQuery, selectedMetrics, sortBy, groupBy]);
  
  // Handle export as CSV with better formatting
const handleExport = async () => {
  setExportLoading(true);
  try {
    if (!filteredData.length) {
      throw new Error("No data to export");
    }

    // Get metric columns
    const columns = getMetricColumns();
    
    // Create CSV content
    const csvRows = [];
    
    // Add header row
    const headers = columns.map(col => `"${col.header}"`);
    csvRows.push(headers.join(','));
    
    // Add data rows
    filteredData.forEach(row => {
      const rowData = columns.map(col => {
        let cellValue = '';
        
        if (col.render) {
          cellValue = col.render(row);
        } else if (col.accessor) {
          // Handle nested accessors (e.g., "registrations.count")
          const keys = col.accessor.split('.');
          cellValue = keys.reduce((obj, key) => {
            if (obj && typeof obj === 'object') {
              return obj[key];
            }
            return undefined;
          }, row) || '';
        } else {
          cellValue = row[col.accessor] || '';
        }
        
        // Format the value
        if (cellValue === null || cellValue === undefined) {
          cellValue = '';
        }
        
        // Convert to string and escape quotes
        const stringValue = String(cellValue);
        const escapedValue = stringValue.replace(/"/g, '""');
        
        // Wrap in quotes if contains commas, quotes, or newlines
        if (stringValue.includes(',') || 
            stringValue.includes('"') || 
            stringValue.includes('\n') || 
            stringValue.includes('\r')) {
          return `"${escapedValue}"`;
        }
        
        return escapedValue;
      });
      
      csvRows.push(rowData.join(','));
    });
    
    // Add summary section if needed
    if (totals) {
      csvRows.push('\n'); // Empty line
      csvRows.push('"SUMMARY STATISTICS"');
      csvRows.push('"Metric","Value"');
      
      const summaryData = [
        ['Total Registrations', totals.registrations || 0],
        ['Total Posts', totals.posts || 0],
        ['Total Likes', totals.likes || 0],
        ['Total Comments', totals.comments || 0],
        ['Total Revenue', `₹${totals.totalRevenue || 0}`],
        ['Total Campaigns', totals.campaigns || 0],
        ['Total Spins', totals.spins || 0],
        ['Days Covered', analyticsData?.query?.daysCovered || 0]
      ];
      
      summaryData.forEach(([label, value]) => {
        csvRows.push(`"${label}","${value}"`);
      });
    }
    
    // Create CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${groupBy}-${formatDate(new Date())}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error("Export failed:", err);
    setError(`Export failed: ${err.message}`);
  } finally {
    setExportLoading(false);
  }
};
  
  // Handle date range change
  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Handle metric selection
  const handleMetricToggle = (metric) => {
    if (metric === "all") {
      setSelectedMetrics(["all"]);
    } else {
      setSelectedMetrics(prev => {
        const newSelection = prev.includes("all") 
          ? [metric]
          : prev.includes(metric)
            ? prev.filter(m => m !== metric)
            : [...prev, metric];
        
        return newSelection.length === 0 ? ["all"] : newSelection;
      });
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    // setDarkMode(!darkMode);
  };
  
  // Get metric columns based on groupBy
  const getMetricColumns = () => {
    const baseColumns = [
      {
        header: "Period",
        accessor: "date",
        render: (row) => formatDisplayDate(row.date, groupBy)
      }
    ];
    
    const metricColumns = [];
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("registrations")) {
      metricColumns.push({
        header: "Registrations",
        accessor: "registrations.count",
        render: (row) => row.registrations?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("posts")) {
      metricColumns.push({
        header: "Posts",
        accessor: "posts.count",
        render: (row) => row.posts?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("likes")) {
      metricColumns.push({
        header: "Likes",
        accessor: "likes.count",
        render: (row) => row.likes?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("comments")) {
      metricColumns.push({
        header: "Comments",
        accessor: "comments.count",
        render: (row) => row.comments?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("campaigns")) {
      metricColumns.push({
        header: "Campaigns",
        accessor: "campaigns.count",
        render: (row) => row.campaigns?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("spins")) {
      metricColumns.push({
        header: "Spins",
        accessor: "spins.count",
        render: (row) => row.spins?.count || 0
      });
    }
    
    if (selectedMetrics.includes("all") || selectedMetrics.includes("revenue")) {
      metricColumns.push({
        header: "Revenue",
        accessor: "campaigns.totalRevenue",
        render: (row) => `₹${row.campaigns?.totalRevenue || 0}`
      });
    }
    
    return [...baseColumns, ...metricColumns];
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-2xl ${darkMode 
                  ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20" 
                  : "bg-gradient-to-br from-indigo-100 to-purple-100"
                }`}>
                  <CalendarIcon className={`w-7 h-7 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <div>
                  <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Analytics Dashboard
                  </h1>
                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Comprehensive analytics across multiple time periods
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow"
                }`}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button> */}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow"
                }`}
              >
                {showFilters ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              <button
                onClick={fetchAnalyticsData}
                disabled={isLoading}
                className={`p-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        {showFilters && (
          <div className={`
            rounded-2xl p-8 mb-10 shadow-lg border transition-all duration-300
            ${darkMode
              ? "bg-gray-800/50 backdrop-blur-sm border-gray-700"
              : "bg-white border-gray-200"
            }
          `}>
            <h2 className={`text-xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Filters & Controls
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Time Period Selection */}
              <div>
                <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Time Period
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {GROUP_BY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setGroupBy(option.value);
                        setDateRange(getDefaultDateRange(option.value));
                      }}
                      className={`
                        flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5
                        ${groupBy === option.value
                          ? darkMode
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                          : darkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        }
                      `}
                    >
                      <option.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date Range */}
              <div>
                <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Date Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
                      className={`
                        w-full px-4 py-3.5 rounded-xl border text-sm transition-all
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                        ${darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }
                      `}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                      className={`
                        w-full px-4 py-3.5 rounded-xl border text-sm transition-all
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                        ${darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }
                      `}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Metrics Filter */}
            <div className="mt-8">
              <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Metrics to Show
              </label>
              <div className="flex flex-wrap gap-2">
                {METRIC_OPTIONS.map((metric) => (
                  <button
                    key={metric.value}
                    onClick={() => handleMetricToggle(metric.value)}
                    className={`
                      px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5
                      ${selectedMetrics.includes(metric.value)
                        ? darkMode
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                        : darkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      }
                    `}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search and Sort */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div>
                <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Search Periods
                </label>
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder="Search by date or period..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm transition-all
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                      ${darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }
                    `}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Sort By
                </label>
                <div className="flex gap-3">
                  <select
                    value={sortBy.field}
                    onChange={(e) => setSortBy(prev => ({ ...prev, field: e.target.value }))}
                    className={`
                      flex-1 px-4 py-3.5 rounded-xl border text-sm transition-all
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                      ${darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                      }
                    `}
                  >
                    <option value="date">Date</option>
                    <option value="registrations.count">Registrations</option>
                    <option value="posts.count">Posts</option>
                    <option value="likes.count">Likes</option>
                    <option value="comments.count">Comments</option>
                    <option value="campaigns.count">Campaigns</option>
                    <option value="spins.count">Spins</option>
                    <option value="campaigns.totalRevenue">Revenue</option>
                  </select>
                  
                  <button
                    onClick={() => setSortBy(prev => ({ 
                      ...prev, 
                      direction: prev.direction === "asc" ? "desc" : "asc" 
                    }))}
                    className={`
                      px-6 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5
                      ${darkMode
                        ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300 shadow-lg"
                        : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 shadow"
                      }
                    `}
                  >
                    {sortBy.direction === "asc" ? "↑ Asc" : "↓ Desc"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className={`
            rounded-2xl p-6 mb-8 shadow-lg border transition-all duration-300
            ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}
          `}>
            <div className="flex items-center gap-4">
              <AlertCircle className={`w-7 h-7 ${darkMode ? "text-red-400" : "text-red-500"}`} />
              <div>
                <p className={`font-bold text-lg ${darkMode ? "text-red-300" : "text-red-800"}`}>
                  Error loading data
                </p>
                <p className={`text-sm mt-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && !analyticsData ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${darkMode ? "border-indigo-500" : "border-indigo-600"} mb-6`}></div>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Loading analytics data...
            </p>
          </div>
        ) : (
          <>
            {/* Totals Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
              <div className="col-span-2 md:col-span-4 lg:col-span-5">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Overview
                </h2>
              </div>
              
              <MetricCard
                title="Total Registrations"
                value={totals?.registrations || 0}
                icon={Users}
                darkMode={darkMode}
                loading={isLoading}
                index={0}
              />
              
              <MetricCard
                title="Total Posts"
                value={totals?.posts || 0}
                icon={BarChart3}
                darkMode={darkMode}
                loading={isLoading}
                index={1}
              />
              
              <MetricCard
                title="Total Likes"
                value={totals?.likes || 0}
                icon={Heart}
                darkMode={darkMode}
                loading={isLoading}
                index={2}
              />
              
              <MetricCard
                title="Total Comments"
                value={totals?.comments || 0}
                icon={MessageCircle}
                darkMode={darkMode}
                loading={isLoading}
                index={3}
              />
              
              <MetricCard
                title="Total Revenue"
                value={`₹${totals?.totalRevenue || 0}`}
                icon={DollarSign}
                darkMode={darkMode}
                loading={isLoading}
                index={4}
              />
            </div>
            
            {/* Data Table */}
            <div className={`
              rounded-2xl p-8 mb-10 shadow-lg border transition-all duration-300
              ${darkMode
                ? "bg-gray-800/50 backdrop-blur-sm border-gray-700"
                : "bg-white border-gray-200"
              }
            `}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Detailed Analytics ({groupBy} view)
                  </h2>
                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Showing {filteredData.length} periods
                    {analyticsData?.query?.daysCovered && ` • ${analyticsData.query.daysCovered} days covered`}
                  </p>
                </div>
                
                <button
                  onClick={handleExport}
                  disabled={exportLoading || !filteredData.length}
                  className={`
                    px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2
                    ${darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    }
                  `}
                >
                  <Download className={`w-5 h-5 ${exportLoading ? "animate-spin" : ""}`} />
                  Export Data
                </button>
              </div>
              
              <DataTable
                data={filteredData}
                columns={getMetricColumns()}
                darkMode={darkMode}
                loading={isLoading}
              />
              
              {/* Summary Stats */}
              {filteredData.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-700/30">
                  <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Summary Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      {
                        label: "Avg. Daily Posts",
                        value: analyticsData?.query?.daysCovered 
                          ? Math.round((totals?.posts || 0) / analyticsData.query.daysCovered * 100) / 100 
                          : 0
                      },
                      {
                        label: "Avg. Revenue/Day",
                        value: `₹${analyticsData?.query?.daysCovered 
                          ? Math.round((totals?.totalRevenue || 0) / analyticsData.query.daysCovered) 
                          : 0}`
                      },
                      {
                        label: "Campaign Success Rate",
                        value: `${totals?.campaigns 
                          ? Math.round(((analyticsData?.data?.reduce((sum, day) => sum + (day.campaigns?.approved || 0), 0) || 0) / totals.campaigns) * 100)
                          : 0}%`
                      },
                      {
                        label: "Avg. Coins/Spin",
                        value: totals?.spins 
                          ? Math.round((totals?.totalCoinsWon || 0) / totals.spins * 100) / 100 
                          : 0
                      },
                      {
                        label: "Engagement Rate",
                        value: `${totals?.posts 
                          ? Math.round(((totals?.likes || 0) + (totals?.comments || 0)) / totals.posts * 100) 
                          : 0}%`
                      },
                      {
                        label: "Active Days",
                        value: `${analyticsData?.data?.filter(day => 
                          day.registrations?.count || 
                          day.posts?.count || 
                          day.campaigns?.count || 
                          day.spins?.count
                        ).length || 0}/${analyticsData?.data?.length || 0}`
                      }
                    ].map((stat, idx) => (
                      <div 
                        key={idx}
                        className={`
                          p-6 rounded-xl border transition-all duration-300 hover:-translate-y-0.5
                          ${darkMode 
                            ? "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50" 
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }
                        `}
                      >
                        <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-bold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Campaign Status Breakdown */}
            {(selectedMetrics.includes("all") || selectedMetrics.includes("campaigns")) && (
              <div className={`
                rounded-2xl p-8 shadow-lg border transition-all duration-300
                ${darkMode
                  ? "bg-gray-800/50 backdrop-blur-sm border-gray-700"
                  : "bg-white border-gray-200"
                }
              `}>
                <h2 className={`text-2xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Campaign Status Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      status: "Approved Campaigns",
                      value: analyticsData?.data?.reduce((sum, day) => sum + (day.campaigns?.approved || 0), 0) || 0,
                      description: `Total revenue: ₹${analyticsData?.data?.reduce((sum, day) => sum + (day.campaigns?.totalRevenue || 0), 0) || 0}`,
                      color: darkMode ? "from-green-900/30 to-emerald-900/20 border-green-800/30" : "from-green-50 to-emerald-50 border-green-200",
                      textColor: darkMode ? "text-green-300" : "text-green-800",
                      valueColor: darkMode ? "text-green-300" : "text-green-700",
                      iconColor: "text-green-500"
                    },
                    {
                      status: "Pending Campaigns",
                      value: analyticsData?.data?.reduce((sum, day) => sum + (day.campaigns?.pending || 0), 0) || 0,
                      description: "Requires review and approval",
                      color: darkMode ? "from-yellow-900/30 to-amber-900/20 border-yellow-800/30" : "from-yellow-50 to-amber-50 border-yellow-200",
                      textColor: darkMode ? "text-yellow-300" : "text-yellow-800",
                      valueColor: darkMode ? "text-yellow-300" : "text-yellow-700",
                      iconColor: "text-yellow-500"
                    },
                    {
                      status: "Rejected Campaigns",
                      value: analyticsData?.data?.reduce((sum, day) => sum + (day.campaigns?.rejected || 0), 0) || 0,
                      description: "Did not meet requirements",
                      color: darkMode ? "from-red-900/30 to-rose-900/20 border-red-800/30" : "from-red-50 to-rose-50 border-red-200",
                      textColor: darkMode ? "text-red-300" : "text-red-800",
                      valueColor: darkMode ? "text-red-300" : "text-red-700",
                      iconColor: "text-red-500"
                    }
                  ].map((campaign, idx) => (
                    <div
                      key={idx}
                      className={`
                        p-8 rounded-2xl shadow-lg border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1
                        ${campaign.color}
                      `}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <Megaphone className={`w-10 h-10 ${campaign.iconColor} mb-3`} />
                          <p className={`text-lg font-semibold ${campaign.textColor}`}>
                            {campaign.status}
                          </p>
                        </div>
                        <span className={`text-3xl font-bold ${campaign.valueColor}`}>
                          {campaign.value}
                        </span>
                      </div>
                      <div className={`text-sm ${darkMode ? 'opacity-80' : ''} ${campaign.textColor.replace('800', '600').replace('300', '400')}`}>
                        {campaign.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarFilter;
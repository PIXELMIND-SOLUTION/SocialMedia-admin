import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Megaphone,
  Coins,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";

/* ================= HELPERS ================= */
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDays = (baseDate) => {
  const start = getStartOfWeek(baseDate);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getMonthYear = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

/* ================= API CONFIG ================= */
const API_BASE_URL = "https://apisocial.atozkeysolution.com";

/* ================= PAGINATION COMPONENT ================= */
const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (i - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${darkMode
            ? "hover:bg-gray-800 text-gray-400 disabled:hover:bg-transparent"
            : "hover:bg-gray-100 text-gray-600 disabled:hover:bg-transparent"
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`
            min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors
            ${page === '...' ? "cursor-default" : ""}
            ${currentPage === page
              ? darkMode
                ? "bg-indigo-600 text-white"
                : "bg-indigo-600 text-white"
              : darkMode
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${darkMode
            ? "hover:bg-gray-800 text-gray-400 disabled:hover:bg-transparent"
            : "hover:bg-gray-100 text-gray-600 disabled:hover:bg-transparent"
          }
        `}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ================= SEARCH & FILTER COMPONENT ================= */
const SearchFilterBar = ({ 
  section, 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  availableFilters,
  darkMode 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder={`Search ${section}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              ${darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }
            `}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2
            ${darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
              : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            }
          `}
        >
          <Filter className="w-4 h-4" />
          Filters
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && availableFilters && (
        <div className={`
          mt-3 p-4 rounded-xl border
          ${darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
          }
        `}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(availableFilters).map(([filterKey, filterConfig]) => (
              <div key={filterKey}>
                <label className={`
                  block text-sm font-medium mb-2
                  ${darkMode ? "text-gray-300" : "text-gray-700"}
                `}>
                  {filterConfig.label}
                </label>
                {filterConfig.type === 'select' ? (
                  <select
                    value={filters[filterKey] || ''}
                    onChange={(e) => onFilterChange(filterKey, e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg border text-sm transition-all
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                      ${darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                      }
                    `}
                  >
                    <option value="">All</option>
                    {filterConfig.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filterConfig.type}
                    value={filters[filterKey] || ''}
                    onChange={(e) => onFilterChange(filterKey, e.target.value)}
                    placeholder={filterConfig.placeholder}
                    className={`
                      w-full px-3 py-2 rounded-lg border text-sm transition-all
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                      ${darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STAT CARD COMPONENT ================= */
const StatCard = ({
  label,
  value,
  icon: Icon,
  darkMode,
  highlight,
  trend,
  loading = false
}) => (
  <div
    className={`
      rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] 
      ${darkMode
        ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
        : "bg-white border border-gray-200 shadow-sm"
      }
      ${highlight ? "ring-2 ring-indigo-500/30 shadow-lg" : ""}
      relative overflow-hidden group
    `}
  >
    {highlight && (
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
    )}

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${darkMode
            ? "bg-gray-700/50"
            : "bg-gray-100"
          }`}>
          <Icon className={`w-5 h-5 ${highlight
              ? "text-indigo-500"
              : darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <p className={`text-xs font-medium tracking-wider uppercase mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"
        }`}>
        {label}
      </p>

      {loading ? (
        <div className="h-8 flex items-center">
          <div className="animate-pulse h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
          }`}>
          {value ?? 0}
        </p>
      )}

      {/* Subtle hover effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </div>
  </div>
);

/* ================= CALENDAR DAY BUTTON ================= */
const DayButton = ({
  day,
  dateStr,
  isSelected,
  isToday,
  hasData,
  onClick,
  darkMode
}) => {
  const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = day.getDate();
  const isCurrentMonth = day.getMonth() === new Date().getMonth();

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center p-3 md:p-4 rounded-xl transition-all duration-200
        relative group min-h-[80px] md:min-h-[90px] w-full
        ${isSelected
          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
          : darkMode
            ? "bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 border border-gray-700/50"
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
        }
        ${!isCurrentMonth && !isSelected ? "opacity-50" : ""}
      `}
    >
      {/* Data indicator */}
      {hasData && !isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      )}

      {/* Day name */}
      <span className={`
        text-xs font-medium mb-1 md:mb-2
        ${isSelected
          ? "text-white/90"
          : darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }
      `}>
        {dayName}
      </span>

      {/* Day number */}
      <span className={`
        text-xl md:text-2xl font-bold mb-1
        ${isSelected
          ? "text-white"
          : darkMode
            ? "text-gray-200"
            : "text-gray-900"
        }
      `}>
        {dayNumber}
      </span>

      {/* Today indicator */}
      {isToday && !isSelected && (
        <div className="w-5 h-1 rounded-full bg-indigo-500 mt-1" />
      )}

      {/* Hover effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 pointer-events-none
        ${darkMode && !isSelected ? "bg-gradient-to-br from-gray-700/20 to-transparent" : ""}
      `} />
    </button>
  );
};

/* ================= MAIN CALENDAR COMPONENT ================= */
const Calendar = ({ darkMode = false }) => {
  const today = new Date();
  const todayStr = formatDate(new Date());

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [baseDate, setBaseDate] = useState(today);
  const [weeklyData, setWeeklyData] = useState({});
  const [dailyDetails, setDailyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [monthYear, setMonthYear] = useState(getMonthYear(today));

  // Pagination states
  const [registrationsPage, setRegistrationsPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [spinsPage, setSpinsPage] = useState(1);
  const [campaignsPage, setCampaignsPage] = useState(1);
  
  const itemsPerPage = 5;

  // Search states
  const [registrationsSearch, setRegistrationsSearch] = useState("");
  const [postsSearch, setPostsSearch] = useState("");
  const [spinsSearch, setSpinsSearch] = useState("");
  const [campaignsSearch, setCampaignsSearch] = useState("");

  // Filter states
  const [registrationsFilters, setRegistrationsFilters] = useState({});
  const [postsFilters, setPostsFilters] = useState({});
  const [spinsFilters, setSpinsFilters] = useState({});
  const [campaignsFilters, setCampaignsFilters] = useState({});

  const weekDays = getWeekDays(baseDate);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Available filters for each section
  const availableFilters = {
    registrations: {
      username: {
        label: "Username",
        type: "text",
        placeholder: "Filter by username"
      }
    },
    posts: {
      likesMin: {
        label: "Min Likes",
        type: "number",
        placeholder: "Minimum likes"
      },
      likesMax: {
        label: "Max Likes",
        type: "number",
        placeholder: "Maximum likes"
      }
    },
    spins: {
      coinsMin: {
        label: "Min Coins",
        type: "number",
        placeholder: "Minimum coins"
      },
      coinsMax: {
        label: "Max Coins",
        type: "number",
        placeholder: "Maximum coins"
      }
    },
    campaigns: {
      status: {
        label: "Status",
        type: "select",
        options: [
          { value: "approved", label: "Approved" },
          { value: "pending", label: "Pending" },
          { value: "rejected", label: "Rejected" }
        ]
      },
      amountMin: {
        label: "Min Amount",
        type: "number",
        placeholder: "Minimum amount"
      },
      amountMax: {
        label: "Max Amount",
        type: "number",
        placeholder: "Maximum amount"
      }
    }
  };

  // Fetch weekly data
  const fetchWeeklyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const startDate = formatDate(getStartOfWeek(baseDate));
      const endDate = new Date(getStartOfWeek(baseDate));
      endDate.setDate(endDate.getDate() + 6);
      const endDateStr = formatDate(endDate);

      const response = await fetch(
        `${API_BASE_URL}/api/analytics?startDate=${startDate}&endDate=${endDateStr}&groupBy=day`
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        const statsMap = {};
        data.data.forEach(dayData => {
          statsMap[dayData.date] = {
            posts: dayData.posts?.count || 0,
            likes: dayData.likes?.count || 0,
            comments: dayData.comments?.count || 0,
            whatsPosts: 0,
            registeredUsers: dayData.registrations?.count || 0,
            campaignsBought: dayData.campaigns?.count || 0,
            coinsBought: dayData.spins?.totalCoinsWon || 0,
            totalPayments: dayData.campaigns?.totalRevenue || 0,
            spins: dayData.spins?.count || 0,
            notifications: dayData.notifications?.total || 0
          };
        });

        setWeeklyData(statsMap);
        setMonthYear(getMonthYear(baseDate));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching weekly data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseDate]);

  // Fetch daily details
  const fetchDailyDetails = useCallback(async (dateStr) => {
    if (!dateStr) return;

    setIsLoadingDetails(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/date/${dateStr}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setDailyDetails(null);
          return;
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDailyDetails(data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching daily details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Initial fetch and when baseDate changes
  useEffect(() => {
    fetchWeeklyData();
  }, [fetchWeeklyData]);

  // Fetch details when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchDailyDetails(selectedDate);
    }
  }, [selectedDate, fetchDailyDetails]);

  // Navigation handlers
  const navigateWeek = (direction) => {
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setBaseDate(newDate);
  };

  const handleTodayClick = () => {
    const now = new Date();
    const todayLocal = formatDate(now);

    setBaseDate(now);
    setSelectedDate(todayLocal);
  };

  // Filter and search functions
  const filterRegistrations = (registrations) => {
    if (!registrations) return [];
    
    return registrations.filter(reg => {
      // Search filter
      if (registrationsSearch) {
        const searchLower = registrationsSearch.toLowerCase();
        const matchesSearch = 
          (reg.fullName?.toLowerCase().includes(searchLower)) ||
          (reg.email?.toLowerCase().includes(searchLower)) ||
          (reg.profile?.username?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filter by username
      if (registrationsFilters.username && reg.profile?.username) {
        if (!reg.profile.username.toLowerCase().includes(registrationsFilters.username.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  };

  const filterPosts = (posts) => {
    if (!posts) return [];
    
    return posts.filter(post => {
      // Search filter
      if (postsSearch) {
        const searchLower = postsSearch.toLowerCase();
        const matchesSearch = 
          (post.userName?.toLowerCase().includes(searchLower)) ||
          (post.description?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filter by likes
      const likes = post.likesCount || 0;
      if (postsFilters.likesMin && likes < parseInt(postsFilters.likesMin)) return false;
      if (postsFilters.likesMax && likes > parseInt(postsFilters.likesMax)) return false;

      return true;
    });
  };

  const filterSpins = (spins) => {
    if (!spins) return [];
    
    return spins.filter(spin => {
      // Search filter
      if (spinsSearch) {
        const searchLower = spinsSearch.toLowerCase();
        const matchesSearch = 
          (spin.userId?.fullName?.toLowerCase().includes(searchLower)) ||
          (spin.reward?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filter by coins
      const coins = spin.coins || 0;
      if (spinsFilters.coinsMin && coins < parseInt(spinsFilters.coinsMin)) return false;
      if (spinsFilters.coinsMax && coins > parseInt(spinsFilters.coinsMax)) return false;

      return true;
    });
  };

  const filterCampaigns = (campaigns) => {
    if (!campaigns) return [];
    
    return campaigns.filter(campaign => {
      // Search filter
      if (campaignsSearch) {
        const searchLower = campaignsSearch.toLowerCase();
        const matchesSearch = 
          (campaign.fullName?.toLowerCase().includes(searchLower)) ||
          (campaign.email?.toLowerCase().includes(searchLower)) ||
          (campaign.link?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filter by status
      if (campaignsFilters.status && campaign.adminApprovalStatus !== campaignsFilters.status) {
        return false;
      }

      // Filter by amount
      const amount = campaign.purchasedPackage?.price || 0;
      if (campaignsFilters.amountMin && amount < parseInt(campaignsFilters.amountMin)) return false;
      if (campaignsFilters.amountMax && amount > parseInt(campaignsFilters.amountMax)) return false;

      return true;
    });
  };

  // Paginate data
  const paginateData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Get stats for selected date
  const getStatsForDate = (dateStr) => {
    if (dailyDetails?.date && formatDate(new Date(dailyDetails.date)) === dateStr) {
      const details = dailyDetails.details;
      const summary = dailyDetails.summary;

      return {
        posts: summary?.totalPosts || 0,
        likes: details.posts?.reduce((sum, post) => sum + (post.likesCount || 0), 0) || 0,
        comments: summary?.totalPosts ?
          details.posts?.reduce((sum, post) => sum + (post.commentsCount || 0), 0) || 0 : 0,
        whatsPosts: 0,
        registeredUsers: summary?.totalRegistrations || 0,
        campaignsBought: summary?.totalCampaigns || 0,
        coinsBought: details.spins?.reduce((sum, spin) => sum + (spin.coins || 0), 0) || 0,
        totalPayments: details.campaigns?.reduce((sum, campaign) => {
          if (campaign.purchasedPackage?.price) {
            return sum + campaign.purchasedPackage.price;
          }
          return sum;
        }, 0) || 0,
        spins: summary?.totalSpins || 0
      };
    }

    return weeklyData[dateStr] || null;
  };

  const stats = getStatsForDate(selectedDate);

  // Stats configuration with icons
  const statCards = [
    {
      key: 'posts',
      label: 'Posts Created',
      icon: BarChart3,
      value: stats?.posts
    },
    {
      key: 'likes',
      label: 'Likes Received',
      icon: Heart,
      value: stats?.likes
    },
    {
      key: 'comments',
      label: 'Comments',
      icon: MessageCircle,
      value: stats?.comments
    },
    {
      key: 'registeredUsers',
      label: 'New Users',
      icon: UserPlus,
      value: stats?.registeredUsers
    },
    {
      key: 'campaignsBought',
      label: 'Campaigns',
      icon: Megaphone,
      value: stats?.campaignsBought
    },
    {
      key: 'spins',
      label: 'Spins',
      icon: TrendingUp,
      value: stats?.spins
    },
    {
      key: 'coinsBought',
      label: 'Coins Won',
      icon: Coins,
      value: stats?.coinsBought
    },
    {
      key: 'totalPayments',
      label: 'Revenue',
      icon: DollarSign,
      value: stats?.totalPayments ? `₹${stats.totalPayments}` : '₹0',
      highlight: true
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${darkMode ? "bg-indigo-500/20" : "bg-indigo-100"}`}>
                  <CalendarIcon className={`w-6 h-6 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Analytics Calendar
                </h1>
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Track your platform performance day by day
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  setSelectedDate(e.target.value);
                  setBaseDate(d);
                }}
                className={`
                  px-4 py-2.5 rounded-xl border text-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }
                `}
              />

              <button
                onClick={handleTodayClick}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                  }
                `}
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Loading analytics data...
            </p>
          </div>
        ) : error ? (
          <div className={`
            rounded-xl p-6 mb-6 md:mb-8
            ${darkMode ? "bg-red-900/20 border border-red-800" : "bg-red-50 border border-red-200"}
          `}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-500"}`} />
              <div>
                <p className={`font-semibold ${darkMode ? "text-red-300" : "text-red-800"}`}>
                  Error loading data
                </p>
                <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Week Calendar Section */}
            <div className={`
              rounded-2xl p-4 md:p-6 mb-6 md:mb-8
              ${darkMode
                ? "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                : "bg-white border border-gray-200 shadow-lg"
              }
            `}>
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateWeek(-1)}
                  className={`
                    p-2 rounded-lg transition-colors hover:scale-105
                    ${darkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 md:gap-4">
                  <h2 className={`text-lg md:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {monthYear}
                  </h2>
                </div>

                <button
                  onClick={() => navigateWeek(1)}
                  className={`
                    p-2 rounded-lg transition-colors hover:scale-105
                    ${darkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days of Week Headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className={`text-center text-xs font-medium py-2
                      ${darkMode ? "text-gray-500" : "text-gray-400"}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const dateStr = formatDate(day);
                  const isSelected = dateStr === selectedDate;
                  const isToday = dateStr === todayStr;
                  const hasData = weeklyData[dateStr] || (dailyDetails?.date && formatDate(new Date(dailyDetails.date)) === dateStr);

                  return (
                    <DayButton
                      key={dateStr}
                      day={day}
                      dateStr={dateStr}
                      isSelected={isSelected}
                      isToday={isToday}
                      hasData={hasData}
                      onClick={() => setSelectedDate(dateStr)}
                      darkMode={darkMode}
                    />
                  );
                })}
              </div>
            </div>

            {/* Selected Date Info */}
            <div className={`
              rounded-2xl p-4 md:p-6 mb-6 md:mb-8
              ${darkMode
                ? "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                : "bg-white border border-gray-200 shadow-lg"
              }
            `}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {formatDateDisplay(selectedDate)}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Detailed analytics for the selected date
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Data available
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              {isLoadingDetails ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-4 animate-pulse ${darkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                    >
                      <div className={`h-4 w-16 rounded mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-300"
                        }`} />
                      <div className={`h-8 w-20 rounded ${darkMode ? "bg-gray-700" : "bg-gray-300"
                        }`} />
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {statCards.map((card) => (
                    <StatCard
                      key={card.key}
                      label={card.label}
                      value={card.value}
                      icon={card.icon}
                      darkMode={darkMode}
                      highlight={card.highlight}
                      loading={isLoadingDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800/50" : "bg-gray-100"
                  }`}>
                  <BarChart3 className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"
                    }`} />
                  <p className={`text-lg font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    No data available for this date
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Select a date with activity to view analytics
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Data Section */}
            {dailyDetails?.details && (
              <div className={`
                rounded-2xl p-4 md:p-6
                ${darkMode
                  ? "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                  : "bg-white border border-gray-200 shadow-lg"
                }
              `}>
                <h2 className={`text-xl md:text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Detailed Breakdown
                </h2>

                <div className="space-y-8">
                  {/* Registrations */}
                  {dailyDetails.details.registrations?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <UserPlus className="w-5 h-5" />
                          New Registrations ({dailyDetails.details.registrations.length})
                        </h3>
                      </div>
                      
                      <SearchFilterBar
                        section="registrations"
                        searchQuery={registrationsSearch}
                        onSearchChange={setRegistrationsSearch}
                        filters={registrationsFilters}
                        onFilterChange={(key, value) => setRegistrationsFilters(prev => ({ ...prev, [key]: value }))}
                        availableFilters={availableFilters.registrations}
                        darkMode={darkMode}
                      />

                      <div className="space-y-3">
                        {paginateData(filterRegistrations(dailyDetails.details.registrations), registrationsPage).map((user, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl transition-all hover:scale-[1.01] ${darkMode
                                ? "bg-gray-800/50 border border-gray-700"
                                : "bg-gray-50 border border-gray-200"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"
                                }`}>
                                <Users className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"
                                  }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"
                                  }`}>
                                  {user.fullName}
                                </p>
                                <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                  {user.email}
                                </p>
                                {user.profile?.username && (
                                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"
                                    }`}>
                                    @{user.profile.username}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={registrationsPage}
                        totalPages={Math.ceil(filterRegistrations(dailyDetails.details.registrations).length / itemsPerPage)}
                        onPageChange={setRegistrationsPage}
                        darkMode={darkMode}
                      />
                    </div>
                  )}

                  {/* Posts */}
                  {dailyDetails.details.posts?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <BarChart3 className="w-5 h-5" />
                          Posts Created ({dailyDetails.details.posts.length})
                        </h3>
                      </div>
                      
                      <SearchFilterBar
                        section="posts"
                        searchQuery={postsSearch}
                        onSearchChange={setPostsSearch}
                        filters={postsFilters}
                        onFilterChange={(key, value) => setPostsFilters(prev => ({ ...prev, [key]: value }))}
                        availableFilters={availableFilters.posts}
                        darkMode={darkMode}
                      />

                      <div className="space-y-3">
                        {paginateData(filterPosts(dailyDetails.details.posts), postsPage).map((post, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl transition-all hover:scale-[1.01] ${darkMode
                                ? "bg-gray-800/50 border border-gray-700"
                                : "bg-gray-50 border border-gray-200"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"
                                }`}>
                                <MessageCircle className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"
                                  }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium mb-1 ${darkMode ? "text-white" : "text-gray-900"
                                  }`}>
                                  {post.userName}
                                </p>
                                <p className={`text-sm line-clamp-2 mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}>
                                  {post.description || "No description"}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                    <Heart className="w-3 h-3" />
                                    {post.likesCount} likes
                                  </span>
                                  <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                    <MessageCircle className="w-3 h-3" />
                                    {post.commentsCount} comments
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={postsPage}
                        totalPages={Math.ceil(filterPosts(dailyDetails.details.posts).length / itemsPerPage)}
                        onPageChange={setPostsPage}
                        darkMode={darkMode}
                      />
                    </div>
                  )}

                  {/* Spins */}
                  {dailyDetails.details.spins?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <Coins className="w-5 h-5" />
                          Spins Completed ({dailyDetails.details.spins.length})
                        </h3>
                      </div>
                      
                      <SearchFilterBar
                        section="spins"
                        searchQuery={spinsSearch}
                        onSearchChange={setSpinsSearch}
                        filters={spinsFilters}
                        onFilterChange={(key, value) => setSpinsFilters(prev => ({ ...prev, [key]: value }))}
                        availableFilters={availableFilters.spins}
                        darkMode={darkMode}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {paginateData(filterSpins(dailyDetails.details.spins), spinsPage).map((spin, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl transition-all hover:scale-[1.01] ${darkMode
                                ? "bg-gray-800/50 border border-gray-700"
                                : "bg-gray-50 border border-gray-200"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"
                                }`}>
                                {spin.userId?.fullName || "User"}
                              </p>
                              <span className={`text-sm font-semibold ${spin.coins > 0 ? "text-green-500" : "text-gray-500"
                                }`}>
                                +{spin.coins}
                              </span>
                            </div>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"
                              }`}>
                              {spin.reward}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={spinsPage}
                        totalPages={Math.ceil(filterSpins(dailyDetails.details.spins).length / itemsPerPage)}
                        onPageChange={setSpinsPage}
                        darkMode={darkMode}
                      />
                    </div>
                  )}

                  {/* Campaigns */}
                  {dailyDetails.details.campaigns?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <Megaphone className="w-5 h-5" />
                          Campaigns ({dailyDetails.details.campaigns.length})
                        </h3>
                      </div>
                      
                      <SearchFilterBar
                        section="campaigns"
                        searchQuery={campaignsSearch}
                        onSearchChange={setCampaignsSearch}
                        filters={campaignsFilters}
                        onFilterChange={(key, value) => setCampaignsFilters(prev => ({ ...prev, [key]: value }))}
                        availableFilters={availableFilters.campaigns}
                        darkMode={darkMode}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {paginateData(filterCampaigns(dailyDetails.details.campaigns), campaignsPage).map((campaign, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${campaign.adminApprovalStatus === 'approved'
                                ? 'border-green-500/30 bg-green-500/5'
                                : campaign.adminApprovalStatus === 'pending'
                                  ? 'border-yellow-500/30 bg-yellow-500/5'
                                  : 'border-red-500/30 bg-red-500/5'
                              } ${darkMode ? 'border-opacity-20' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"
                                  }`}>
                                  {campaign.fullName}
                                </p>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                  {campaign.email}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.adminApprovalStatus === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : campaign.adminApprovalStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {campaign.adminApprovalStatus}
                              </span>
                            </div>
                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                              }`}>
                              <p className="truncate">
                                {campaign.link}
                              </p>
                              {campaign.purchasedPackage?.price && (
                                <p className="font-semibold text-green-500 mt-2">
                                  ₹{campaign.purchasedPackage.price}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={campaignsPage}
                        totalPages={Math.ceil(filterCampaigns(dailyDetails.details.campaigns).length / itemsPerPage)}
                        onPageChange={setCampaignsPage}
                        darkMode={darkMode}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
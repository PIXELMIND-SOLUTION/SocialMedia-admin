import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaCompress,
  FaExpand
} from 'react-icons/fa';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleDarkMode, darkMode, collapsed, sidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminEmail = JSON.parse(sessionStorage.getItem("adminemail"));
  const role = JSON.parse(sessionStorage.getItem("role"));

  // 🔹 Fetch Notifications API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://apisocial.atozkeysolution.com/api/allnotifications"
      );

      if (res.data.success) {
        const formatted = res.data.notifications.map((item) => ({
          id: item._id,
          text: item.title,
          message: item.message,
          unread: !item.read,
          time: formatTime(item.createdAt),
        }));

        setNotifications(formatted);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Convert ISO date → "x min ago"
  const formatTime = (date) => {
    const diff = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className={`
      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
      border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}
      px-4 py-3
      flex items-center justify-between
      transition-all duration-300
      sticky top-0 z-30
      ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}
    `}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          aria-label="Toggle menu"
        >
          {isMobile ? (
            <FiMenu className="text-xl" />
          ) : ("")}
        </button>

        {/* Breadcrumb/Page Title */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">
            Dashboard
            {collapsed && <span className="text-xs text-gray-500 ml-2">(Collapsed)</span>}
          </h1>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Welcome back, Admin
          </p>
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Search"
        >
          <FaSearch className="text-lg" />
        </button>
      </div>





      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FaSun className="text-lg text-yellow-400" />
          ) : (
            <FaMoon className="text-lg" />
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className={`relative p-2 rounded-lg transition-colors
    ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
  `}
        >
          {isFullscreen ? (
            <FaCompress className="text-lg" />
          ) : (
            <FaExpand className="text-lg" />
          )}
        </button>


        <div className="relative">
          {/* 🔔 Bell Button */}
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={`relative p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-colors`}
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 🔔 Dropdown */}
          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationOpen(false)}
              ></div>

              <div
                className={`absolute right-0 mt-2 w-80 z-50 rounded-lg shadow-xl border
            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                {/* Header */}
                <div
                  className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {unreadCount} new
                    </span>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                  {loading && (
                    <p className="p-4 text-center text-sm">Loading...</p>
                  )}

                  {!loading && notifications.length === 0 && (
                    <p className="p-4 text-center text-sm">
                      No notifications
                    </p>
                  )}

                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b cursor-pointer transition-colors
                  ${darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-100 hover:bg-gray-50"
                        }
                  ${notification.unread
                          ? darkMode
                            ? "bg-gray-700/50"
                            : "bg-blue-50/50"
                          : ""
                        }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.unread
                              ? "bg-blue-500"
                              : "bg-transparent"
                            }`}
                        ></div>

                        <div className="flex-1">
                          <p className="font-medium">
                            {notification.text}
                          </p>
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                          >
                            {notification.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                          >
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-2 text-center border-t dark:border-gray-700">
                  <button
                    className={`block w-full py-2 text-sm ${darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                      }`}
                    onClick={() => {
                      navigate('/admin/notifications');
                      setNotificationOpen(false);
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center space-x-2 p-1 pr-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff"
              alt="Admin"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700"
            />
            {!collapsed && (
              <>
                <div className="hidden md:block text-left">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin</p>
                </div>
                <FiChevronDown className="hidden md:block" />
              </>
            )}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className={`
                absolute right-0 mt-2 w-64
                ${darkMode ? 'bg-gray-800' : 'bg-white'}
                rounded-lg shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                z-50
              `}>
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff"
                      alt="Admin"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{role}</p>
                      <p className="text-sm opacity-75">{adminEmail}</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/admin/settings"
                  className={`block px-4 py-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <FaCog className="inline mr-2" /> Settings
                </a>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                <a
                  href="#"
                  onClick={() => {
                    navigate('/');
                    sessionStorage.clear();
                  }}
                  className={`block px-4 py-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} text-red-600 dark:text-red-400`}
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiUsers,
  FiUserPlus,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiSearch,
  FiBell,
  FiImage
} from "react-icons/fi";

const API = "https://apisocial.atozkeysolution.com/api";

const UserDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");

  /* ================= FETCH ALL DATA ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, dashboardRes, requestRes] = await Promise.all([
          axios.get(`${API}/users/${id}`),
          axios.get(`${API}/dashboard/${id}`),
          axios.get(`${API}/requests/${id}`)
        ]);

        setUser(userRes.data.data);
        setDashboard(dashboardRes.data.data);
        setRequests(requestRes.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  /* ================= FILTER LISTS ================= */
  const filteredFollowers = useMemo(() => {
    return (
      user?.followers?.filter(
        (f) =>
          f.fullName?.toLowerCase().includes(followersSearch.toLowerCase()) ||
          f.profile?.username
            ?.toLowerCase()
            .includes(followersSearch.toLowerCase())
      ) || []
    );
  }, [followersSearch, user]);

  const filteredFollowing = useMemo(() => {
    return (
      user?.following?.filter(
        (f) =>
          f.fullName?.toLowerCase().includes(followingSearch.toLowerCase()) ||
          f.profile?.username
            ?.toLowerCase()
            .includes(followingSearch.toLowerCase())
      ) || []
    );
  }, [followingSearch, user]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading user details…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-red-500">
        User not found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div
        className={`max-w-7xl mx-auto rounded-3xl shadow-xl p-6 md:p-8
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}
      >
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
        >
          <FiArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-6 items-center mb-10">
          {dashboard?.user?.image ? (
            <img
              src={dashboard?.user?.image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white
              bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
            >
              {dashboard?.user?.fullName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold">{dashboard?.user?.fullName}</h2>
            <p className="text-sm text-gray-500">
              @{dashboard?.user?.username}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1">
                <FiMail /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <FiPhone /> {user.mobile || "-"}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar />{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Notifications */}
          {/* <div className="relative">
            <FiBell className="text-2xl" />
            {dashboard?.notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {dashboard.notifications}
              </span>
            )}
          </div> */}
        </div>

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard label="Posts" onClick={() => navigate(`/admin/userposts/${user._id}`)} value={dashboard?.stats?.posts} icon={<FiImage />} />
          <StatCard label="Followers" value={dashboard?.stats?.followers} icon={<FiUsers />} />
          <StatCard label="Following" value={dashboard?.stats?.following} icon={<FiUserPlus />} />
        </div>

        {/* FOLLOW REQUESTS */}
        <div className="mb-10">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <FiUserPlus /> Follow Requests ({requests.length})
          </h3>

          {requests.length === 0 ? (
            <p className="text-sm text-gray-500">No pending requests</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {requests.map((r) => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/admin/users/details/${r._id}`)}
                  className={`px-4 py-2 rounded-xl text-sm
                    ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  {r.fullName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOLLOWERS / FOLLOWING */}
        <div className="grid lg:grid-cols-2 gap-8">
          <FollowCard
            title="Followers"
            list={filteredFollowers}
            search={followersSearch}
            setSearch={setFollowersSearch}
            darkMode={darkMode}
            navigate={navigate}
          />

          <FollowCard
            title="Following"
            list={filteredFollowing}
            search={followingSearch}
            setSearch={setFollowingSearch}
            darkMode={darkMode}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ label, value, icon, darkMode, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl p-4 border cursor-pointer transition-all
      ${darkMode
        ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:shadow-xl"
        : "bg-gradient-to-br from-blue-50 to-indigo-50 border-gray-200 hover:shadow-lg"
      }
    `}
  >
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
          }`}
      >
        {label}
      </span>

      <span
        className={`text-xl ${darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
      >
        {icon}
      </span>
    </div>

    <p
      className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"
        }`}
    >
      {value ?? 0}
    </p>
  </div>
);


const FollowCard = ({ title, list, search, setSearch, darkMode, navigate }) => (
  <div
    className={`rounded-2xl border p-5
      ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
  >
    <h3 className="font-semibold mb-3">
      {title} ({list.length})
    </h3>

    <div className="relative mb-4">
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${title.toLowerCase()}...`}
        className="w-full pl-9 pr-3 py-2 rounded-xl border"
      />
    </div>

    <div className="space-y-2 max-h-72 overflow-y-auto">
      {list.map((u) => (
        <div
          key={u._id}
          onClick={() => navigate(`/admin/users/details/${u._id}`)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
            ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}`}
        >
          {u.profile?.image ? (
            <img
              src={u.profile.image}
              alt={u.fullName}
              className="w-9 h-9 rounded-full object-cover border-4 border-indigo-500/20"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center 
    bg-indigo-600 text-white font-bold text-xl border-4 border-indigo-500/20"
            >
              {u.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{u.fullName}</p>
            <p className="text-xs text-gray-500">@{u.profile?.username}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserDetails;

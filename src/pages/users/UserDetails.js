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
  FiMapPin,
  FiShield,
  FiSearch
} from "react-icons/fi";

const UserDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search states
  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");

  // =============================
  // FETCH USER DETAILS
  // =============================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://31.97.206.144:5002/api/users/${id}`
        );
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // =============================
  // FILTERED LISTS
  // =============================
  const filteredFollowers = useMemo(() => {
    return (
      user?.followers?.filter((f) =>
        f.fullName?.toLowerCase().includes(followersSearch.toLowerCase()) ||
        f.profile?.username?.toLowerCase().includes(followersSearch.toLowerCase())
      ) || []
    );
  }, [followersSearch, user]);

  const filteredFollowing = useMemo(() => {
    return (
      user?.following?.filter((f) =>
        f.fullName?.toLowerCase().includes(followingSearch.toLowerCase()) ||
        f.profile?.username?.toLowerCase().includes(followingSearch.toLowerCase())
      ) || []
    );
  }, [followingSearch, user]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user details…</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">User not found</div>;
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-7xl mx-auto rounded-3xl shadow-xl p-6 md:p-8
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
        >
          <FiArrowLeft /> Back
        </button>

        {/* PROFILE HEADER */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start mb-10">
          <img
            src={user.profile?.image || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-blue-600">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500">@{user.profile?.username}</p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1">
                <FiMail /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <FiPhone /> {user.mobile || "-"}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar /> {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold
              ${user.accountStatus?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}`}
          >
            {user.accountStatus?.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* INFO CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <InfoCard
            title="Personal Info"
            icon={<FiMapPin />}
            items={[
              ["Gender", user.personalInfo?.gender],
              ["Country", user.personalInfo?.country],
              ["Birthdate", user.personalInfo?.birthdate
                ? new Date(user.personalInfo.birthdate).toLocaleDateString()
                : "-"]
            ]}
            darkMode={darkMode}
          />

          <InfoCard
            title="Account Info"
            icon={<FiShield />}
            items={[
              ["Coins", user.wallet?.coins],
              ["Profile Visibility", user.privacy?.profileVisibility],
              ["Search Indexed", user.privacy?.searchEngineIndexing ? "Yes" : "No"]
            ]}
            darkMode={darkMode}
          />
        </div>

        {/* FOLLOWERS / FOLLOWING */}
        <div className="grid lg:grid-cols-2 gap-8">
          <FollowCard
            title="Followers"
            icon={<FiUsers />}
            list={filteredFollowers}
            search={followersSearch}
            setSearch={setFollowersSearch}
            darkMode={darkMode}
          />

          <FollowCard
            title="Following"
            icon={<FiUserPlus />}
            list={filteredFollowing}
            search={followingSearch}
            setSearch={setFollowingSearch}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

/* =============================
   REUSABLE COMPONENTS
============================= */

const InfoCard = ({ title, icon, items, darkMode }) => (
  <div className={`rounded-2xl p-5 border
    ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
    <h3 className="flex items-center gap-2 font-semibold text-blue-600 mb-4">
      {icon} {title}
    </h3>
    <div className="space-y-2 text-sm">
      {items.map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value || "-"}
        </p>
      ))}
    </div>
  </div>
);

const FollowCard = ({ title, icon, list, search, setSearch, darkMode }) => (
  <div className={`rounded-2xl border p-5 flex flex-col
    ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>

    <div className="flex items-center justify-between mb-4">
      <h3 className="flex items-center gap-2 font-semibold text-blue-600">
        {icon} {title} ({list.length})
      </h3>
    </div>

    {/* SEARCH */}
    <div className="relative mb-4">
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm
          focus:ring-2 focus:ring-blue-500 outline-none
          ${darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"}`}
      />
    </div>

    {/* LIST */}
    <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mt-10">
          No results found
        </p>
      ) : (
        list.map((u) => (
          <div
            key={u._id}
            className={`flex items-center gap-3 p-3 rounded-xl transition
              ${darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"}`}
          >
            <img
              src={u.profile?.image || "https://via.placeholder.com/40"}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{u.fullName}</p>
              <p className="text-xs text-gray-500">@{u.profile?.username}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default UserDetails;

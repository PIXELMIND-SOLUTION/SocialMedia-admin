import React, { useEffect, useState } from "react";
import axios from "axios";

const ROOMS_API = "https://apisocial.atozkeysolution.com/api/allrooms";
const ROOM_DETAIL_API = "https://apisocial.atozkeysolution.com/api/room";
const DELETE_ROOM_API = "https://apisocial.atozkeysolution.com/api/deleteroom";

const PAGE_SIZES = [5, 8, 10, 20];
const MODAL_ITEMS_PER_PAGE = 5;

const Rooms = ({ darkMode }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  /* ===== Pagination ===== */
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== Modal ===== */
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPage, setMemberPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("");

  /* ================= FETCH ROOMS ================= */
  const fetchRooms = async () => {
    try {
      const res = await axios.get(ROOMS_API);
      setRooms(res.data.data || []);
      setFilteredRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const data = rooms.filter(
      (r) =>
        r.roomId.toLowerCase().includes(search.toLowerCase()) ||
        r.createdBy?.fullName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRooms(data);
    setCurrentPage(1);
  }, [search, rooms]);

  /* ================= PAGINATION ================= */
  const totalPages =
    Math.ceil(filteredRooms.length / pageSize) || 1;

  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= VIEW MEMBERS ================= */
  const viewMembers = async (room) => {
    try {
      const res = await axios.get(`${ROOM_DETAIL_API}/${room.roomId}`);
      setMembers(res.data.data.members || []);
      setSelectedRoom(room.roomId);
      setMemberSearch("");
      setMemberPage(1);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`${DELETE_ROOM_API}/${roomId}`);
      fetchRooms();
      alert("Room deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete room");
    }
  };

  /* ================= MEMBER FILTER ================= */
  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.username.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const modalPages =
    Math.ceil(filteredMembers.length / MODAL_ITEMS_PER_PAGE) ||
    1;

  const modalMembers = filteredMembers.slice(
    (memberPage - 1) * MODAL_ITEMS_PER_PAGE,
    memberPage * MODAL_ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Rooms Management
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search Room ID or Creator..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`px-4 py-2 rounded-xl w-full md:w-80 border ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-300"
        }`}
      />

      {/* TABLE */}
      <div
        className={`rounded-2xl overflow-hidden shadow border ${
          darkMode ? "border-gray-800" : ""
        }`}
      >
        <table className="w-full text-sm">
          <thead
            className={`${
              darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100"
            }`}
          >
            <tr>
              <th className="px-6 py-4 text-left">Room ID</th>
              <th className="px-6 py-4 text-left">Creator</th>
              <th className="px-6 py-4 text-center">Members</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : paginatedRooms.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No rooms found
                </td>
              </tr>
            ) : (
              paginatedRooms.map((room) => (
                <tr
                  key={room._id}
                  className={`border-b ${
                    darkMode
                      ? "border-gray-800 text-white hover:bg-gray-800"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">
                    {room.roomId}
                  </td>
                  <td className="px-6 py-4">
                    {room.createdBy?.fullName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {room.members.length}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        room.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => viewMembers(room)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteRoom(room.roomId)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded border text-sm ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">
            Page <b>{currentPage}</b> of <b>{totalPages}</b>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div
            className={`w-full max-w-xl rounded-2xl p-6 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Room Members – {selectedRoom}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <input
              placeholder="Search members..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className={`w-full mb-3 px-3 py-2 rounded border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            />

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {modalMembers.map((m) => (
                <div
                  key={m.userId}
                  className={`flex items-center gap-3 p-3 rounded ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
                    {m.profileImage ? (
                      <img
                        src={m.profileImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-sm">
                        {m.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{m.fullName}</p>
                    <p className="text-xs text-gray-400">
                      @{m.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL PAGINATION */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                disabled={memberPage === 1}
                onClick={() => setMemberPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                {memberPage} / {modalPages}
              </span>
              <button
                disabled={memberPage === modalPages}
                onClick={() => setMemberPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;

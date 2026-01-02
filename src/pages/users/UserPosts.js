import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminUserPosts = ({ darkMode }) => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://apisocial.atozkeysolution.com/api/posts/user/${userId}`
      );
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE POST ================= */
  const handleDeletePost = async (postId, userId1) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingId(postId);

      const res = await fetch(
        `https://apisocial.atozkeysolution.com/api/deletePost/${userId1}/${postId}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Failed to delete post");
        return;
      }

      // Remove from UI instantly
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Something went wrong while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        User Posts ({posts.length})
      </h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty */}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          No posts found for this user.
        </p>
      )}

      {/* POSTS GRID */}
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            darkMode={darkMode}
            onDelete={handleDeletePost}
            deleting={deletingId === post._id}
          />
        ))}
      </div>
    </div>
  );
};

/* ================= POST CARD ================= */
const PostCard = ({ post, darkMode, onDelete, deleting }) => {
  const media = post.media?.[0];

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow transition
        ${darkMode ? "bg-gray-800 text-white" : "bg-white"}
      `}
    >
      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(post._id, post.userId._id)}
        disabled={deleting}
        className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full shadow"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {/* MEDIA */}
      <div className="relative aspect-square bg-black">
        {media?.type === "video" ? (
          <video
            src={media.url}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media?.url}
            alt="post"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={post.userId?.profile?.image || "/assets/images/profile.png"}
            alt="user"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">
              {post.userId?.fullName}
            </p>
            <p className="text-xs text-gray-500">
              @{post.userId?.profile?.username}
            </p>
          </div>
        </div>

        {post.description && (
          <p className="text-sm line-clamp-2">
            {post.description}
          </p>
        )}

        <div className="flex justify-between text-xs text-gray-500 pt-2">
          <span>❤️ {post.likes?.length || 0}</span>
          <span>💬 {post.comments?.length || 0}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPosts;

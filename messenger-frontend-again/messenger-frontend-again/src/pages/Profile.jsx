import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileHeader from "../components/ProfileHeader";

import {
  getMyPostsRequest,
  createPostRequest,
  deletePostRequest,
} from "../backend/posts";

import {
  getFollowersCountRequest,
  getFollowingCountRequest,
} from "../backend/follow";

import PostCard from "../components/PostCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Profile() {
  /* ---------------- AUTH USER (FROM REDUX) ---------------- */
  const authUser = useSelector(
    (state) => state.auth.userData?.data
  );

  /* ---------------- FOLLOW COUNTS ---------------- */
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  /* ---------------- POSTS STATE ---------------- */
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");

  /* ---------------- CREATE POST STATE ---------------- */
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);

  /* ---------------- FETCH FOLLOW COUNTS ---------------- */
  useEffect(() => {
  console.log("FOLLOW COUNT EFFECT TRIGGERED");
  console.log("authUser inside effect:", authUser);

  if (!authUser?._id) {
    console.log("❌ authUser._id not available yet");
    return;
  }

  const fetchFollowCounts = async () => {
    try {
      const userId = authUser._id;
      console.log("✅ Fetching follow counts for userId:", userId);

      const followersPromise = getFollowersCountRequest(userId);
      const followingPromise = getFollowingCountRequest(userId);

      console.log("➡️ Requests created:", {
        followersPromise,
        followingPromise,
      });

      const [followersRes, followingRes] = await Promise.all([
        followersPromise,
        followingPromise,
      ]);

      console.log("✅ Followers response FULL:", followersRes);
      console.log("✅ Following response FULL:", followingRes);

      console.log("➡️ followersRes.data:", followersRes.data);
      console.log("➡️ followingRes.data:", followingRes.data);

      setFollowersCount(
        followersRes.data?.data.followersCount ?? 0
      );
      setFollowingCount(
        followingRes.data?.data.followingCount ?? 0
      );
    } catch (err) {
      console.error("❌ Error fetching follow counts:", err);
    }
  };

  fetchFollowCounts();
}, [authUser]);

  /* ---------------- FETCH MY POSTS ---------------- */
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await getMyPostsRequest();
        setPosts(res.data || []);
      } catch {
        setPostsError("Failed to load posts");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (!authUser) {
    return <p>No user data available</p>;
  }

  /* ---------------- CREATE POST ---------------- */
  const handleCreatePost = async () => {
    if (!imageFile) {
      alert("Image is required");
      return;
    }

    try {
      setPosting(true);

      await createPostRequest({
        imageFile,
        caption,
      });

      setImageFile(null);
      setCaption("");

      const res = await getMyPostsRequest();
      setPosts(res.data || []);
    } catch {
      alert("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- DELETE POST ---------------- */
  const handleDeletePost = async (postId) => {
    try {
      await deletePostRequest(postId);

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } catch {
      alert("Failed to delete post");
    }
  };

  return (
  <div>
    {/* ================= PROFILE HEADER ================= */}
    <ProfileHeader
  user={authUser}
  postsCount={posts.length}
  followersCount={followersCount}
  followingCount={followingCount}
/>


    {/* ================= CREATE POST ================= */}
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">
        Create Post
      </h2>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        rows={3}
        className="w-full mt-3 p-2 border rounded"
      />

      <Button
        onClick={handleCreatePost}
        disabled={posting}
        className="mt-3"
      >
        {posting ? "Posting..." : "Create Post"}
      </Button>
    </div>

    {/* ================= POSTS GRID ================= */}
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        My Posts
      </h2>

      {loadingPosts && <p>Loading posts...</p>}
      {postsError && (
        <p className="text-red-500">{postsError}</p>
      )}

      {!loadingPosts && posts.length === 0 && (
        <p>No posts yet</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
    </div>
  </div>
);

}

export default Profile;

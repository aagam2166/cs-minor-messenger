import { useEffect, useState } from "react";
import { getUserFeedRequest } from "../backend/feed";
import PostCard from "../components/PostCard";


function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getUserFeedRequest();
        console.log("FEED DATA:", data); // 🔴 IMPORTANT
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed Test</h1>

      {posts.length === 0 ? (
        <p>No posts</p>
      ) : (
        posts.map((post) => (
  <PostCard key={post._id} post={post} />
))

      )}
    </div>
  );
}

export default Home;

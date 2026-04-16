import PostCard from "../components/PostCard";
import photo from "../sandbox/aagamPhoto.jpeg";

export default function ProfileDesign() {
  const fakePosts = [
    { _id: "1", caption: "First post", image: "https://picsum.photos/400/300" },
    { _id: "2", caption: "Another post", image: "https://picsum.photos/401/300" },
    { _id: "3", caption: "Designing UI", image: "https://picsum.photos/402/300" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* ---------------- PROFILE HEADER ---------------- */}
      <div className="flex bg-black gap-x-10 p-6 rounded-lg">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white p-1">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={photo}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-4 text-amber-50">
          <div className="text-3xl font-semibold">aagam5218</div>
          <div className="text-2xl font-bold">Aagam</div>

          <div className="flex space-x-6 text-sm opacity-90">
            <span><strong>0</strong> Posts</span>
            <span><strong>197</strong> Followers</span>
            <span><strong>229</strong> Following</span>
          </div>
        </div>
      </div>

      {/* ---------------- POSTS SECTION ---------------- */}
      <div className="mt-8 px-2">
        <h2 className="text-xl font-semibold mb-4">
          Posts
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {fakePosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

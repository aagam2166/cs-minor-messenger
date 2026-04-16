import { useSelector } from "react-redux";

function PostCard({ post, onDelete }) {
  const loggedInUserId = useSelector(
    (state) => state.auth.userData?.data?._id
  );

  const isOwner = post.owner === loggedInUserId;

  return (
    <div className="max-w-xl mx-auto mb-6 bg-gray-100 rounded-xl p-4">
      {/* Owner */}
      <div className="mb-2 font-semibold">
        @{post.owner?.username}
      </div>

      {/* Image */}
      {post.image && (
        <div className="w-full flex justify-center mb-4">
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      )}

      {/* Caption */}
      <h2 className="text-lg">
        {post.caption}
      </h2>

      {/* Meta */}
      <div className="mt-3 flex gap-6 text-sm text-gray-600">
        <span>❤️ {post.likesCount}</span>
        <span>💬 {post.commentsCount}</span>
        {post.isLiked && <span>✓ liked</span>}
      </div>

      {isOwner && (
        <button
          onClick={() => onDelete(post._id)}
          style={{ color: "red", marginTop: 8 }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default PostCard;

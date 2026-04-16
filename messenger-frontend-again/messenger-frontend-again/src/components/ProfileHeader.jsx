function ProfileHeader({
  user,
  postsCount,
  followersCount,
  followingCount,
}) {
  if (!user) return null;

  return (
    <div className="bg-black p-6">
      <div className="flex gap-x-10">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white p-1">
          <div className="w-full h-full rounded-full overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-4 text-amber-50">
          <div className="text-3xl">@{user.username}</div>
          <div className="text-2xl font-bold">
            {user.fullName}
          </div>

          <div className="flex gap-6">
            <span>{postsCount} Posts</span>
            <span>{followersCount} Followers</span>
            <span>{followingCount} Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileHeader from "../components/ProfileHeader";
import { getFollowersCountRequest, getFollowingCountRequest } from "../backend/follow";
import { getUserByUsernameRequest } from "../backend/user";
import { getUserProfileByUsernameRequest } from "../backend/user";

function UserProfile() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRes = await getUserProfileByUsernameRequest(username);
        const userData = userRes.data?.data;

        setUser(userData);

        const [followersRes, followingRes] = await Promise.all([
          getFollowersCountRequest(userData._id),
          getFollowingCountRequest(userData._id),
        ]);

        setFollowersCount(
          followersRes.data?.data.followersCount ?? 0
        );
        setFollowingCount(
          followingRes.data?.data.followingCount ?? 0
        );
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      <ProfileHeader
        user={user}
        postsCount={0}
        followersCount={followersCount}
        followingCount={followingCount}
      />

      {/* deliberately empty for now */}
    </div>
  );
}

export default UserProfile;

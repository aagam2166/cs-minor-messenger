import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getInboxRequest } from "../backend/conversation";
import { getUserByIdRequest } from "../backend/auth";
import ConversationList from "../components/inbox/ConversationList";

function Inbox() {
  const navigate = useNavigate();

  /* ---------------- AUTH USER ---------------- */
  const authUser = useSelector(
    (state) => state.auth.userData?.data
  );

  /* ---------------- STATE ---------------- */
  const [conversations, setConversations] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH INBOX ---------------- */
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await getInboxRequest();
        setConversations(res.data?.data || []);
      } catch {
        setError("Failed to load inbox");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  /* ---------------- FETCH OTHER USERS ---------------- */
  useEffect(() => {
    if (!authUser?._id || conversations.length === 0) return;

    const fetchOtherUsers = async () => {
      try {
        const ids = conversations.map((conv) =>
          conv.participants.find(
            (id) => id !== authUser._id
          )
        );

        const uniqueIds = [...new Set(ids)];

        const results = await Promise.all(
          uniqueIds.map((id) => getUserByIdRequest(id))
        );

        const map = {};
        results.forEach((res) => {
          map[res.data.data._id] = res.data.data;
        });

        setUserMap(map);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchOtherUsers();
  }, [conversations, authUser?._id]);

  /* ---------------- HELPERS ---------------- */
  const getOtherUserId = (participants) =>
    participants.find((id) => id !== authUser._id);

  /* ---------------- RENDER ---------------- */
  return (
    <div style={{ padding: 20 }}>
      <h1>Inbox</h1>

      {loading && <p>Loading inbox...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && conversations.length === 0 && (
        <p>No conversations yet</p>
      )}

      {!loading && conversations.length > 0 && (
        <ConversationList>
          {conversations.map((conv) => {
            const otherUserId = getOtherUserId(
              conv.participants
            );

            return (
              <div
                key={conv._id}
                onClick={() =>
  navigate(`/chat/${conv._id}`, {
    state: {
      otherUsername: userMap[otherUserId]?.username,
    },
  })
}

                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {userMap[otherUserId]?.username ||
                      "Loading…"}
                  </span>

                  <span className="text-sm text-gray-500">
                    {conv.lastMessage
                      ? conv.lastMessage.content
                      : "No messages yet"}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  →
                </span>
              </div>
            );
          })}
        </ConversationList>
      )}
    </div>
  );
}

export default Inbox;

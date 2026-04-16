import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../socket/socket";
import {
  getMessagesByConversationRequest,
  sendMessageRequest,
} from "../backend/message";
import { useLocation } from "react-router-dom";


function Chat() {
  const { conversationId } = useParams();

  const authUser = useSelector(
    (state) => state.auth.userData?.data
  );
  const location = useLocation();
const otherUsername = location.state?.otherUsername;


  const myUserId = authUser?._id;

  const [otherUser, setOtherUser] = useState(null);


  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const joinedRef = useRef(false);
  const isSenderRef = useRef(false);



  const messagesRef = useRef(null);

  /* ---------------- FETCH CHAT HISTORY ---------------- */
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getMessagesByConversationRequest(
          conversationId
        );

        // authoritative shape
        setMessages(res.data?.data.reverse() || []);
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(()=>{
    if(!conversationId) return;
    if(joinedRef.current) return;

    console.log("🟡 joining conversation:", conversationId);

    socket.emit("join-conversation",conversationId);
    joinedRef.current = true;
  },[conversationId])

  useEffect(()=>{
    const handleNewMessage = (message) => {
        if(isSenderRef.current) return;

        setMessages((prev)=>[...prev,message]);
    };
    socket.on("new-message",handleNewMessage);

    return () => {
        socket.off("new-message",handleNewMessage);
    }
  },[]);

  

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (e) => {
  e.preventDefault();
  if (!content.trim()) return;

  isSenderRef.current = true; // ✅ MARK SENDER
  setSending(true);

  try {
    const res = await sendMessageRequest(
      conversationId,
      content.trim()
    );

    // append sent message from HTTP
    setMessages((prev) => [...prev, res.data.data]);
    setContent("");
  } catch {
    setError("Failed to send message");
  } finally {
    setSending(false);

    // release sender lock next tick
    setTimeout(() => {
      isSenderRef.current = false;
    }, 0);
  }
};


  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="h-14 flex items-center px-4 border-b bg-white">
        <button
          onClick={() => window.history.back()}
          className="mr-3 text-gray-600"
        >
          ←
        </button>
        <span className="font-semibold">
  {otherUsername || "Chat"}
</span>

      </div>

      {/* MESSAGES */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {loading && (
          <p className="text-center text-gray-400">
            Loading chat…
          </p>
        )}

        {!loading &&
          messages.map((msg) => {
            const senderId =
              typeof msg.sender === "string"
                ? msg.sender
                : msg.sender?._id;

            const isMine = senderId === myUserId;

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSend}
        className="h-16 flex items-center gap-3 px-4 border-t bg-white"
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message…"
          disabled={sending}
          className="flex-1 h-10 px-4 rounded-full border
                     focus:outline-none"
        />
       <button
  type="submit"
  disabled={sending || !content.trim()}
  className="px-4 py-2 bg-blue-500 text-white rounded-full
             hover:bg-blue-900 disabled:opacity-50"
>
  Send
</button>

      </form>
    </div>
  );
}

export default Chat;

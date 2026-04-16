import React from "react";

export default function ConversationList({ children }) {
  return (
    <div
      className="flex flex-col divide-y border rounded-lg overflow-hidden bg-white"
    >
      {children}
    </div>
  );
}

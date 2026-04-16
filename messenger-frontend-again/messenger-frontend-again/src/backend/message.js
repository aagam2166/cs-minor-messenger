import api from "./axios";

export const getMessagesByConversationRequest = (conversationId) => {
  return api.get(`/messages/${conversationId}`);
};

export const sendMessageRequest = (conversationId, content) => {
  return api.post(`/messages/${conversationId}`, { content });
};

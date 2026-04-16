import api from "./axios";

export const getInboxRequest = () => {
    return api.get("/conversations/inbox");
};
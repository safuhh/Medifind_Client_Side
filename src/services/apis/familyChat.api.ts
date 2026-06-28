import api from "./api";

export const sendFamilyChat = (data: {
  message: string;
  familyMemberId?: string;
  sessionId?: string;
}) => api.post("/ai/family/chat", data);

export const getChatHistory = (sessionId: string) =>
  api.get(`/ai/family/chat/history?sessionId=${sessionId}`);

export const getFamilyHealthSummary = () => api.get("/ai/family/summary");

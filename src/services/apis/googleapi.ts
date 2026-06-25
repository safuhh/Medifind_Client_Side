import api from "@/services/apis/authApi";

export const googleAuth = (payload: {
  accessToken?: string;
  access_token?: string;
  token?: string;
  role?: string;
}) =>
  api.post("/google", payload);

export const fetchCurrentUser = () => api.get("/current");
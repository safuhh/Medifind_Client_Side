import api from "./api";
export const fetchCurrentUser = () => {
  return api.get("/auth/current");
};
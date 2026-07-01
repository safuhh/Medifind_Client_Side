

import axios from "axios";
import { store } from "@/store/redux/store";
import { setCredentials, logout } from "@/store/redux/authSlice";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://medifindapiii.duckdns.org/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});



// refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        store.dispatch(
          setCredentials({
            user: res.data.user,
          })
        );

        return api(original);
      } catch (err) {
        store.dispatch(logout());
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;


import axios from "axios";
import { store } from "../redux/store";
import { setCredentials, logout } from "../redux/authSlice";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com";

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
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : "https://medifindapiii.duckdns.org/api/auth",
  withCredentials: true,
});

export default authApi;

import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : "http://localhost:5000/api/auth",
  withCredentials: true,
});

export default authApi;

import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : "http://medifind-env.eba-6rdig2er.eu-north-1.elasticbeanstalk.com/auth",
  withCredentials: true,
});

export default authApi;

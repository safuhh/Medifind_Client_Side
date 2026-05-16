import api from "./api";

export const getDoctorRevenueDashboard = async () => {
  try {
    const response = await api.get("/doctor-revenue/today");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
import api from "@/services/apis/api";
export const blockDoctorApi = async (doctorId: string) => {
  try {
    const response = await api.post(`/admin/doctor/block-doctor/${doctorId}`);
    return response;
  } catch (error) {
    console.error("BLOCK_DOCTOR_ERROR:", error);
    throw error;
  }
};
export const unblockDoctorApi = async (doctorId: string) => {
  try {
    const response = await api.post(`/admin/doctor/unblock-doctor/${doctorId}`);
    return response;
  } catch (error) {
    console.error("UNBLOCK_DOCTOR_ERROR:", error);
    throw error;
  }
};
export const getAllDoctorsApi = async () => {
  try {
    const response = await api.get(`/admin/doctor/all-doctors`);
    return response;
  } catch (error) {
    console.error("GET_ALL_DOCTORS_ERROR:", error);
    throw error;
  }
};

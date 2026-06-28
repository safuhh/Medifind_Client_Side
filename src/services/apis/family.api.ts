import api from "./api";

export const getFamilyMembers = () => api.get("/family");

export const addFamilyMember = (data: {
  name: string;
  relationship: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  profileImage?: string;
  emergencyContact?: { name: string; phone: string };
}) => api.post("/family", data);

export const verifyFamilyMember = (id: string, code: string) =>
  api.post(`/family/${id}/verify`, { code });

export const resendFamilyMemberOTP = (id: string) =>
  api.post(`/family/${id}/resend-otp`);

export const updateFamilyMember = (id: string, data: Record<string, any>) =>
  api.patch(`/family/${id}`, data);

export const deleteFamilyMember = (id: string) => api.delete(`/family/${id}`);

export const getFamilyMemberHealthReports = (id: string) =>
  api.get(`/family/${id}/health-reports`);

export const getFamilyMemberBookings = (id: string) =>
  api.get(`/family/${id}/bookings`);

export const getFamilyMemberOrders = (id: string) =>
  api.get(`/family/${id}/orders`);

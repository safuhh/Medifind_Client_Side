import api from "./api";

export const applyDoctor = (data: any) => {
  return api.post("/api/v1/doctor/apply", data);
};

export const getApplicationStatus = () => {
  return api.get("/api/v1/doctor/status");
};

export const getAllDoctorApplications = () => {
  return api.get("/api/v1/doctor/admin/applications");
};

export const reviewDoctorApplication = (id: string, status: string, rejectionReason?: string) => {
  return api.put(`/api/v1/doctor/admin/review/${id}`, { status, rejectionReason });
};
export const getDoctorsBySpecialization = (specialization?: string) => {
  const url = specialization ? `/api/v1/doctor/all?specialization=${encodeURIComponent(specialization)}` : "/api/v1/doctor/all";
  return api.get(url);
};
export const getSingleDoctor = (id: string) => {
  return api.get(`/api/v1/doctor/profile/${id}`);
};

export const updateDoctorProfile = (data: any) => {
  return api.put("/api/v1/doctor/profile-update", data);
};

import api from "./api";

export const applyDoctor = (data: any) => {
  return api.post("/doctor/apply", data);
};

export const getApplicationStatus = () => {
  return api.get("/doctor/status");
};

export const getAllDoctorApplications = () => {
  return api.get("/doctor/admin/applications");
};

export const reviewDoctorApplication = (id: string, status: string, rejectionReason?: string) => {
  return api.put(`/doctor/admin/review/${id}`, { status, rejectionReason });
};
export const getDoctorsBySpecialization = (specialization?: string) => {
  const url = specialization ? `/doctor/all?specialization=${encodeURIComponent(specialization)}` : "/doctor/all";
  return api.get(url);
};
export const getSingleDoctor = (id: string) => {
  return api.get(`/doctor/profile/${id}`);
};

export const updateDoctorProfile = (data: any) => {
  return api.put("/doctor/profile-update", data);
};
export const deliveryBoyEarnings = () => {
  return api.get("/delivery/earnings");
};
export const getCommissions = () => {
  return api.get("/commissions");
};
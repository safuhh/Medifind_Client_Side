import api from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getApplicationStatus = () => {
    return api.get(`${BASE_URL}/doctor/status`);
};

export const updateDoctorProfile = (data: FormData) => {
    return api.put(`${BASE_URL}/doctor/profile-update`, data);
};

export const getDoctorPatients = () => {
    return api.get(`${BASE_URL}/booking/doctor-patients`);
};

export const getPatientDetails = (patientId: string) => {
    return api.get(`${BASE_URL}/booking/patient-details/${patientId}`);
};

export const getDoctorsBySpecialization = (specialization?: string) => {
    return api.get(`${BASE_URL}/doctor/all`, {
        params: specialization ? { specialization } : {}
    });
};

export const getSingleDoctor = (id: string) => {
    return api.get(`${BASE_URL}/doctor/profile/${id}`);
};

export const applyDoctor = (data: FormData) => {
    return api.post(`${BASE_URL}/doctor/apply`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllDoctorApplications = () => {
    return api.get(`${BASE_URL}/doctor/admin/applications`);
};

export const reviewDoctorApplication = (id: string, status: string, rejectionReason?: string) => {
    return api.put(`${BASE_URL}/doctor/admin/review/${id}`, { status, rejectionReason });
};

export const getCommissions = () => {
    return api.get(`${BASE_URL}/commissions`);
};
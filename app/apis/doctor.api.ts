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
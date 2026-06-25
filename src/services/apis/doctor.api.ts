import api from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const getDoctorsBySpecialization = (specialization?: string, lat?: number, lng?: number) => {
    return api.get(`${BASE_URL}/doctor/all`, {
        params: {
            ...(specialization ? { specialization } : {}),
            ...(lat !== undefined && lng !== undefined ? { lat, lng } : {})
        }
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

export const getNearbyDoctors = (lat?: number, lng?: number) => {
    return api.get(`${BASE_URL}/doctor/nearby`, {
        params: lat && lng ? { lat, lng } : {}
    });
};

export const submitDoctorReview = (data: { doctorId: string, rating: number, reviewText?: string, bookingId?: string }) => {
    return api.post(`${BASE_URL}/doctor/review`, data);
};

export const getDoctorReviews = (doctorId: string) => {
    return api.get(`${BASE_URL}/doctor/reviews/${doctorId}`);
};
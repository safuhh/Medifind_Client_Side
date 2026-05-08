import api from "./api";

export const getAvailableSlots = (doctorId: string, date: string) => {
    return api.post("/api/v1/booking/get-slots", { doctorId, date });
};

export const bookSlot = (bookingData: { doctorId: string; date: string; timeSlot: string; reason?: string }) => {
    return api.post("/api/v1/booking/book", bookingData);
};

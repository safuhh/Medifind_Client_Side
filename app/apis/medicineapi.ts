import api from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// 📦 GET all medicines (Public)
export const getAllMedicines = (lat?: number, lng?: number, search?: string, radius?: number) => {
  let url = `${BASE_URL}/medicines/all?`;
  if (lat) url += `lat=${lat}&`;
  if (lng) url += `lng=${lng}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (radius) url += `radius=${radius}&`;
  console.log("FETCHING_FROM:", url);
  return api.get(url);
};

// 📦 GET single
export const getMedicine = (id: string, lat?: number, lng?: number) => {
  let url = `${BASE_URL}/medicines/${id}?`;
  if (lat) url += `lat=${lat}&`;
  if (lng) url += `lng=${lng}&`;
  return api.get(url);
};

// ... keep other functions but use absolute URLs
export const getMedicines = (category?: string, search?: string) => {
  return api.get(`${BASE_URL}/medicines?search=${search || ""}`);
};
export const createMedicine = (data: any) => api.post(`${BASE_URL}/medicines`, data);
export const updateMedicine = (id: string, data: any) => api.put(`${BASE_URL}/medicines/${id}`, data);
export const deleteMedicine = (id: string) => api.delete(`${BASE_URL}/medicines/${id}`);
export const getMedicineByBarcode = (barcode: string) => api.get(`${BASE_URL}/medicines/barcode/${barcode}`);
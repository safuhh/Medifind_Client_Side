import api from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://medifindapiii.duckdns.org/api";

// 📦 GET all medicines (Public)
export const getAllMedicines = (
  lat?: number,
  lng?: number,
  search?: string,
  radius?: number,
  limit?: number,
  categories?: string
) => {
  const params = new URLSearchParams();
  if (lat != null && !isNaN(lat)) params.set("lat", String(lat));
  if (lng != null && !isNaN(lng)) params.set("lng", String(lng));
  if (search) params.set("search", search);
  if (radius) params.set("radius", String(radius));
  if (limit) params.set("limit", String(limit));
  if (categories) params.set("categories", categories);
  const query = params.toString();
  const url = `${BASE_URL}/medicines/all${query ? `?${query}` : ""}`;
  console.log("FETCHING_FROM:", url);
  return api.get(url);
};

// 📦 GET single
export const getMedicine = (id: string, lat?: number, lng?: number) => {
  const params = new URLSearchParams();
  if (lat != null && !isNaN(lat)) params.set("lat", String(lat));
  if (lng != null && !isNaN(lng)) params.set("lng", String(lng));
  const query = params.toString();
  const url = `${BASE_URL}/medicines/${id}${query ? `?${query}` : ""}`;
  return api.get(url);
};

// ... keep other functions but use absolute URLs
export const getMedicines = (category?: string, search?: string) => {
  return api.get(`${BASE_URL}/medicines?search=${search || ""}`);
};
export const createMedicine = (data: any) =>
  api.post(`${BASE_URL}/medicines`, data);
export const updateMedicine = (id: string, data: any) =>
  api.put(`${BASE_URL}/medicines/${id}`, data);
export const deleteMedicine = (id: string) =>
  api.delete(`${BASE_URL}/medicines/${id}`);
export const getMedicineByBarcode = (barcode: string) =>
  api.get(`${BASE_URL}/medicines/barcode/${barcode}`);

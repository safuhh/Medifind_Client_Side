import api from "../apis/api";

// apply seller (already ok)
export const applySeller = (data: {
  shopName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  lat?: number | null;
  lng?: number | null;
}) => {
  return api.post("/seller/apply", data);
};

// dashboard
export const getSellerDashboard = () => {
  return api.get("/seller/dashboard");
};

// ⭐ NEW: update seller info
export const updateSellerInfo = (data: {
  shopName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  lat?: number;
  lng?: number;
}) => {
  return api.put("/seller/update", data);
};

export const getsellerinfo = () => {
  return api.get("/seller/current");
};
export const getSellerEarnings = () => {
  return api.get("/seller-earnings/earnings");
};

// 💳 connect stripe
export const connectStripe = () => {
  return api.post("/stripe/connect");
};
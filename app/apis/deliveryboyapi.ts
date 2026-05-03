import api from "../apis/api";

// 🚴 apply delivery boy
export const applyDeliveryBoy = (data: {
  name: string;
  phone: string;
  vehicleType: "bike" | "scooter" | "cycle";
  vehicleNumber: string;
  address: string;
  aadhaarNumber: string;
  aadhaarImage: string;
  lat: number | null;
  lng: number | null;
}) => {
  return api.post("/delivery/apply", data);
};

// 📊 dashboard
export const getDeliveryBoyDashboard = () => {
  return api.get("/delivery/dashboard");
};

// ✏️ update delivery boy info
export const updateDeliveryBoyInfo = (data: {
  name?: string;
  phone?: string;
  vehicleType?: "bike" | "scooter" | "cycle";
  vehicleNumber?: string;
}) => {
  return api.put("/delivery/update", data);
};

// 👤 current delivery boy info
export const getCurrentDeliveryBoyInfo = () => {
  return api.get("/delivery/current");
};
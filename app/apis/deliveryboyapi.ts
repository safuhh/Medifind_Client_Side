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

// 📦 available orders
export const getAvailableOrders = () => {
  return api.get("/delivery/available-orders");
};

// ✅ accept order
export const acceptOrder = (data: { orderId: string }) => {
  return api.post("/delivery/accept-order", data);
};

// 📦 pickup order
export const pickupOrder = (data: { orderId: string }) => {
  return api.post("/delivery/pickup-order", data);
};

// 🏁 deliver order
export const deliverOrder = (data: { orderId: string }) => {
  return api.post("/delivery/deliver-order", data);
};

// 💳 connect stripe
export const connectStripe = () => {
  return api.post("/stripe/connect");
};
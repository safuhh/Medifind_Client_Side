import api from "../apis/api";

// 🚴 apply delivery boy
export const applyDeliveryBoy = (data: FormData) => {
  return api.post("/delivery/apply", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  address?: string;
  lat?: number | null;
  lng?: number | null;
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

export const acceptOrder = (data: { orderId: string }) => {
  return api.post("/delivery/accept-order", data);
};


export const pickupOrder = (data: { orderId: string; sellerId?: string }) => {
  return api.post("/delivery/pickup-order", data);
};

export const deliverOrder = (data: { orderId: string }) => {
  return api.post("/delivery/deliver-order", data);
};


export const connectStripe = () => {
  return api.post("/stripe/connect");
};

export const deliveryBoyEarnings = () => {
  return api.get("/delivery/earnings");
};

import api from "./api";

export const addToCart = (data: { medicineId: string; quantity: number; prescribedQty?: number }) => {
  return api.post("/cart/add-to-cart", data);
};

export const increaseQuantity = (data: { medicineId: string }) => {
  return api.post("/cart/increase-quantity", data);
};

export const decreaseQuantity = (data: { medicineId: string }) => {
  return api.post("/cart/decrease-quantity", data);
};

export const deleteCart = (data: { medicineId: string }) => {
  return api.post("/cart/delete-cart", data);
};

export const getCart = () => {
  return api.post("/cart/get-cart");
};

export const optimizeOrderSplits = (data?: { patientCoords?: [number, number]; prescriptionId?: string }) => {
  return api.post("/orders/optimize-split", data || {});
};

export const getRemainingPrescribedLimit = (medicineId: string) => {
  return api.get(`/cart/remaining-prescription/${medicineId}`);
};

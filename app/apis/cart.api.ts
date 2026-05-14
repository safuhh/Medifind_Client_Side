import api from "./api";

export const addToCart = (data: { medicineId: string; quantity: number }) => {
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

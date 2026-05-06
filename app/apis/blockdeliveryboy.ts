import api from "./api";

export const getAllDeliveryBoys = async () => {
  return api.get("/admin/deliveryboy/all");
};

export const blockDeliveryBoy = (id: string) => {
  return api.put(`/admin/deliveryboy/block/${id}`);
};

export const unblockDeliveryBoy = (id: string) => {
  return api.put(`/admin/deliveryboy/unblock/${id}`);
};

export const updateDeliveryBoy = (id: string, data: any) => {
  return api.put(`/admin/deliveryboy/update/${id}`, data);
};

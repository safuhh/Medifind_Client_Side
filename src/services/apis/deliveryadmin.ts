import api from "@/services/apis/api";
export const getDeliveryBoyRequests = () => {
  return api.get("/admin/delivery/requests");
}
export const approveDeliveryBoy = (id: string) => {
  return api.put(`/admin/delivery/approve/${id}`);
};
export const rejectDeliveryBoy = (id: string) => {
  return api.put(`/admin/delivery/reject/${id}`);
};
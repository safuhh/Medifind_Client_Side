import api from "@/services/apis/api";

// approve seller
export const getSellerRequests = () => {
  return api.get("/admin/seller-requests");
};

export const approveSeller = (id: string) => {
  return api.put(`/admin/approve/${id}`);
};

export const rejectSeller = (id: string) => {
  return api.put(`/admin/reject/${id}`);
};
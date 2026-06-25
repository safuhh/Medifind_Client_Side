import api from "@/services/apis/api";

export const getAllSellers = async () => {
  return api.get("/admin/sellerblock/sellers");
};

// 🚫 block seller
export const blockSeller = (id: string) => {
  return api.put(`/admin/sellerblock/block/${id}`);
};

// ✅ unblock seller
export const unblockSeller = (id: string) => {
  return api.put(`/admin/sellerblock/unblock/${id}`);
};
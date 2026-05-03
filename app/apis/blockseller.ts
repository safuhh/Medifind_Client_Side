import api from "../apis/api";

export const getAllSellers = async () => {
  const res = await fetch("http://localhost:5000/admin/sellerblock/sellers");
  return await res.json();
};

// 🚫 block seller
export const blockSeller = (id: string) => {
  return api.put(`/admin/sellerblock/block/${id}`);
};

// ✅ unblock seller
export const unblockSeller = (id: string) => {
  return api.put(`/admin/sellerblock/unblock/${id}`);
};
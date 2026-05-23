import api from "../apis/api";
export const getMostSellingProducts = async (sellerId: string, range?: string) => {
  try {
    const url = range && range !== "all"
      ? `/mostsellingproduct/mostselingproductsinpharmacy/${sellerId}?range=${range}`
      : `/mostsellingproduct/mostselingproductsinpharmacy/${sellerId}`;
    const res = await api.get(url);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get most selling products";
  }
};  
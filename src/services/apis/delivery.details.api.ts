import api from "@/services/apis/api"
export const deliveryDetailsApi={
    createDeliveryDetails: async (data: any) => {
        const res = await api.post("/delivery-details", data);
        return res.data;
    },
    getDeliveryDetails: async () => {
        const res = await api.get("/delivery-details");
        return res.data;
    },
    updateDeliveryDetails: async (id: string, data: any) => {
        const res = await api.put(`/delivery-details/${id}`, data);
        return res.data;
    },
    deleteDeliveryDetails: async (id: string) => {
        const res = await api.delete(`/delivery-details/${id}`);
        return res.data;
    },
    getUserDeliveryDetails: async (id: string) => {
        const res = await api.get(`/delivery-details/${id}`);
        return res.data;
    },
}
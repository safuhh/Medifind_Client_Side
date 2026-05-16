import api from "./api";

export async function getlowstocks(){
  
    const response = await api.get("/restock/lowstock");
    return response.data;
}
    
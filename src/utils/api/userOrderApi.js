import axiosClient from "./axiosClient";

const userOrderApi = {
  create: (payload) => axiosClient.post("user_order/create", payload),
  update: (payload) =>
    axiosClient.put(`user_order/update/${payload._id}`, payload),
  get: (payload) => axiosClient.get(`user_order/${payload._id}`),
  getAll: () => axiosClient.get("user_order/getAll"),
};

export default userOrderApi;

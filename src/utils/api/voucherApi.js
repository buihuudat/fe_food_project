import axiosClient from "./axiosClient";

const voucherApi = {
  create: (payload) => axiosClient.post("voucher/create", payload),
  update: (payload) => axiosClient.put("voucher/update", payload),
  delete: (payload) => axiosClient.post("voucher/delete", payload),
  get: (payload) => axiosClient.get(`voucher/${payload.voucher}`),
  getAll: () => axiosClient.get("voucher/getAll"),
};

export default voucherApi;

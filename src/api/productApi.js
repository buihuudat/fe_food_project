import axiosClient from './axiosClient'

const productApi = {
  create: payload => axiosClient.post('product/create', payload),
  update: payload => axiosClient.put('product/update', payload),
  delete: payload => axiosClient.post('product/delete', payload),
  get: payload => axiosClient.post('product/get', payload),
  getAll: () => axiosClient.get('product/getAll')
}

export default productApi
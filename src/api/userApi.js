import axiosClient from "./axiosClient";

const userApi = {
  update: payload => axiosClient.put('/user/update', payload),
  updateAvatar: payload => axiosClient.put('/user/update-avatar', payload),
  delete: payload => axiosClient.post('/user/delete', payload),
  get: payload => axiosClient.post(`/user/${payload._id}`, payload),
  getAll: () => axiosClient.get('/user/getAll'),
  feedBack: payload => axiosClient.post('/user/feedback', payload),
  getFeedback: () => axiosClient.get('user/get_feedback'),
  updateFeedback: payload => axiosClient.put('/user/feedback/update', payload),

  createNotification: payload => axiosClient.post('/user/notification/create', payload),
  getNotification: payload => axiosClient.post('/user/notification/get', payload),
  
}

export default userApi
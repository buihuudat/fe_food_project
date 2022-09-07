import axiosClient from './axiosClient'

const authApi = {
  signup: payload => axiosClient.post('auth/signup', payload),
  signin: payload => axiosClient.post('auth/signin', payload),
  verifyToken: () => axiosClient.post('auth/verify-token')
}

export default authApi
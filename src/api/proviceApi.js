const axios = require('axios').default;
const url = 'https://provinces.open-api.vn/api/'

const proviceApi = {
  get: async () => {
    try {
      const response = await axios.get(url, {
        params: {
          depth:3
        }
      })
      return response.data
    } catch (error) {
      return error
    }
  }
}

export default proviceApi
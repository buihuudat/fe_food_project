import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  login: false
}

export const loadingReducer = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.status = action.payload
    },

    setLogin: (state, action) => {
      state.login = action.payload
    }
  }
})

export const { setLoading, setLogin } = loadingReducer.actions
export default loadingReducer.reducer
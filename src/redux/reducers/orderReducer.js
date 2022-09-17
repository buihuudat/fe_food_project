import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  order: {
    data: {},
    status: false
  },

  getAll: {}
}

export const orderReducer = createSlice({
  name: 'userOrder',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload
    },

    setAllOrder: (state, action) => {
      state.getAll = action.payload
    }
  }
})

export const { setOrder, setAllOrder } = orderReducer.actions
export default orderReducer.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: []
}

export const cartReducer = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.data = action.payload
    }
  }
})

export const { setCart } = cartReducer.actions
export default cartReducer.reducer
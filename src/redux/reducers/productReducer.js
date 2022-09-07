import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: {}
}

export const productReducer = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload
    }
  }
})

export const { setProducts } = productReducer.actions
export default productReducer.reducer
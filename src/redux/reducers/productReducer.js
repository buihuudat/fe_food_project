import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  details: {
    status: false,
    data: {},
  },
};

export const productReducer = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload;
    },
    setProductDetails: (state, action) => {
      state.details = action.payload;
    },
  },
});

export const { setProducts, setProductDetails } = productReducer.actions;
export default productReducer.reducer;

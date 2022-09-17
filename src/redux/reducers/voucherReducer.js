import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: {}
}

export const voucherReducer = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    setVoucher: (state, action) => {
      state.data = action.payload
    }
  }
})

export const { setVoucher } = voucherReducer.actions
export default voucherReducer.reducer
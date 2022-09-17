import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
  allUser: {},
  allFeedback: {}
};

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },
    setAllUser: (state, action) => {
      state.allUser = action.payload
    },
    setAllFeedback: (state, action) => {
      state.allFeedback = action.payload
    }
  }
})

export const { setUser, setAllUser, setAllFeedback } = userReducer.actions
export default userReducer.reducer
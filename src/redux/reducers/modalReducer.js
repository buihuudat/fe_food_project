import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  signinModal: false,
  signupModal: false,

  addModal: false,
  updateModal: {
    type: false,
    data: {}
  },

  adminUpdateModal: {
    type: false,
    data: {}
  },

}

export const modalReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setSigninModal: (state, action) => {
      state.signinModal = action.payload
    },
    setSignupModal: (state, action) => {
      state.signupModal = action.payload
    },

    setAddModal: (state, action) => {
      state.addModal = action.payload
    },
    setUpdateModal: (state, action) => {
      state.updateModal = action.payload
    },

    setAdminUpdateModal: (state, action) => {
      state.adminUpdateModal = action.payload
    },
  }
})

export const { 
  setSigninModal, 
  setSignupModal,
  setAddModal,
  setUpdateModal,
  setAdminUpdateModal,
} = modalReducer.actions
export default modalReducer.reducer
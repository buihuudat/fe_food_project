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

  addVoucher: false,
  deleteVoucher: {
    data: {},
    type: false
  },

  pay: {
    type: false,
    data: {}
  },

  notification: false,
  message: false,
  support: false
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

    setAddVoucherModal: (state, action) => {
      state.addVoucher = action.payload
    },

    setDeleteVoucherModal: (state, action) => {
      state.deleteVoucher = action.payload
    },

    setPayModal: (state, action) => {
      state.pay = action.payload
    },

    setNotificationModal: (state, action) => {
      state.notification = action.payload
    },

    setMessageModal: (state, action) => {
      state.message = action.payload
    },

    setSupportModal: (state, action) => {
      state.support = action.payload
    }
  }
})

export const { 
  setSigninModal, 
  setSignupModal,
  setAddModal,
  setUpdateModal,
  setAdminUpdateModal,
  setAddVoucherModal,
  setDeleteVoucherModal,
  setPayModal,
  setNotificationModal,
  setMessageModal,
  setSupportModal
} = modalReducer.actions
export default modalReducer.reducer
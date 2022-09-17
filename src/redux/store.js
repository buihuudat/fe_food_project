import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/userReducer";
import modalReducer from "./reducers/modalReducer";
import handlerReducer from "./reducers/handlerReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";
import voucherReducer from "./reducers/voucherReducer";
import orderReducer from "./reducers/orderReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    handler: handlerReducer,
    products: productReducer,
    cart: cartReducer,
    voucher: voucherReducer,
    userOrder: orderReducer,
  },
});

export default store;

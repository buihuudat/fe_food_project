import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/userReducer";
import modalReducer from "./reducers/modalReducer";
import handlerReducer from "./reducers/handlerReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    handler: handlerReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export default store;

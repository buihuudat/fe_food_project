import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import userOrderApi from "../../api/userOrderApi";
import { setLoading, setLogin } from "../../redux/reducers/handlerReducer";
import { setSigninModal } from "../../redux/reducers/modalReducer";
import { setOrder } from "../../redux/reducers/orderReducer";
import { setProducts } from "../../redux/reducers/productReducer";
import { setUser } from "../../redux/reducers/userReducer";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import Navbar from "../common/Navbar";
import Signin from "../pages/Auth/Signin";
import Signup from "../pages/Auth/Signup";
import Notification from "../pages/Notification";
import Message from "../pages/Message";
import Support from "../pages/Support";
import ProductDetail from "../common/ProductDetail";

const AppLayout = () => {
  const [loadingState, setLoadingState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split("/")[1];

  useEffect(() => {
    const getUser = async () => {
      dispatch(setLoading(true));
      const auth = await authUtils.isAuthenticated();
      const products = await productApi.getAll();
      dispatch(setProducts(products));
      if (!auth) {
        if (path === "profile" || path === "bought" || path === "bills") {
          dispatch(setSigninModal(true));
        }
        dispatch(setLoading(false));
        setLoadingState(true);
        navigate("/");
      } else {
        const orders = await userOrderApi.get(auth);
        setLoadingState(true);
        dispatch(setOrder({ data: orders, status: false }));
        dispatch(setUser(auth));
        dispatch(setLoading(false));
        dispatch(setLogin(true));
      }
    };
    getUser();
  }, [navigate, dispatch, path]);

  !loadingState && dispatch(setLoading(true));

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Loading />
        {loadingState ? (
          <Outlet />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}
        <Signin />
        <Signup />
        <Notification />
        <Message />
        <Support />
        <ProductDetail />
      </Box>
    </Box>
  );
};

export default AppLayout;

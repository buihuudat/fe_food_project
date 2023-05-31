import { Box, LinearProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import SideBar from "../pages/Admin/Sidebar";
import { setProducts } from "../../redux/reducers/productReducer";
import productApi from "../../api/productApi";
import { useDispatch } from "react-redux";
import {
  setAllFeedback,
  setAllUser,
  setUser,
} from "../../redux/reducers/userReducer";
import { setVoucher } from "../../redux/reducers/voucherReducer";

import userApi from "../../api/userApi";
import voucherApi from "../../api/voucherApi";
import userOrderApi from "../../api/userOrderApi";
import { setAllOrder } from "../../redux/reducers/orderReducer";
import ProductDetail from "../common/ProductDetail";

const AdminLayout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await authUtils.isAuthenticated();
      if (isAdmin.permission !== 0) {
        alert("Use are not administrator");
        setLoading(false);
        navigate("/");
      } else {
        const [products, vouchers, orders, users, feedbacks] =
          await Promise.all([
            productApi.getAll(),
            voucherApi.getAll(),
            userOrderApi.getAll(),
            userApi.getAll(),
            userApi.getFeedback(),
          ]);
        dispatch(setAllOrder(orders));
        dispatch(setProducts(products));
        dispatch(setVoucher(vouchers));
        dispatch(setAllUser(users));
        dispatch(setAllFeedback(feedbacks));
        dispatch(setUser(isAdmin));
        setLoading(true);
      }
    };
    checkAdmin();
  }, [navigate, dispatch]);

  return loading ? (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
        <ProductDetail />
      </Box>
    </Box>
  ) : (
    <LinearProgress />
  );
};

export default AdminLayout;

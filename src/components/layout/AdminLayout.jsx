import { Box, LinearProgress } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import authUtils from "../../utils/authUtils";
import SideBar from "../AdminSidebar";
import { setProducts } from "../../redux/reducers/productReducer";
import productApi from "../../utils/api/productApi";
import {
  setAllFeedback,
  setAllUser,
  setUser,
} from "../../redux/reducers/userReducer";
import { setVoucher } from "../../redux/reducers/voucherReducer";
import userApi from "../../utils/api/userApi";
import voucherApi from "../../utils/api/voucherApi";
import userOrderApi from "../../utils/api/userOrderApi";
import { setAllOrder } from "../../redux/reducers/orderReducer";
import ProductDetail from "../../components/common/ProductDetail";

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
        <Suspense fallback={<LinearProgress color="warning" />}>
          <Outlet />
        </Suspense>
        <ProductDetail />
      </Box>
    </Box>
  ) : (
    <LinearProgress />
  );
};

export default AdminLayout;

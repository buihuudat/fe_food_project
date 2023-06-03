import React, { useState } from "react";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import userOrderApi from "../../../api/userOrderApi";
import { setOrder } from "../../../redux/reducers/orderReducer";
import CardOrder from "./CardOrder";
import voucherApi from "../../../api/voucherApi";

const Bill = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getOrder = async () => {
      const orders = await userOrderApi.get(user);
      dispatch(setOrder({ data: orders, status: false }));
      setProducts(orders.products ?? []);
      setLoading(false);
    };
    getOrder();
  }, [dispatch, user]);

  return loading ? (
    <LinearProgress />
  ) : (
    <Box>
      {products.length ? (
        <Grid container spacing={3} p={3}>
          {products.map((product, index) => {
            if (!product.status) {
              return (
                <Grid key={index} item>
                  <CardOrder props={product} amount={product.amount} />
                </Grid>
              );
            }
          })}
        </Grid>
      ) : (
        <Typography align="center" fontWeight={600} fontSize={30}>
          Bạn chưa có hóa đơn
        </Typography>
      )}
    </Box>
  );
};

export default Bill;

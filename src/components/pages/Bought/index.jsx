import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import userOrderApi from "../../../api/userOrderApi";
import { setOrder } from "../../../redux/reducers/orderReducer";
import CardBought from "./CardBought";

const Bought = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getOrder = async () => {
      const orders = await userOrderApi.get(user);
      dispatch(setOrder({ data: orders, status: false }));
      setProducts(
        orders.products ? orders.products.filter((p) => p.status === true) : []
      );
      setLoading(false);
    };
    getOrder();
  }, [dispatch, user]);

  return (
    <Box>
      {!products?.length ? (
        <Typography align="center" fontWeight={600} fontSize={30}>
          Bạn chưa có đơn hàng
        </Typography>
      ) : (
        <Grid container spacing={3} p={3}>
          {products.map((product, index) => {
            if (product.status) {
              return (
                <Grid key={index} item>
                  <CardBought props={product} amount={product.amount} />
                </Grid>
              );
            }
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Bought;

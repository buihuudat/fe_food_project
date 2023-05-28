import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CardOrder from "./CardOrder";
import _ from "lodash";

const Bill = () => {
  const orders = useSelector((state) => state.userOrder.getAll);
  let products = [];
  orders.map(
    (order) =>
      (products = [
        ...order.products.map((data) => (data = { ...data, UID: order.user })),
      ])
  );

  products = _.filter((p) => p.status === false);

  return !products.length ? (
    <Typography align="center" fontSize={30}>
      Chưa có order
    </Typography>
  ) : (
    <Box>
      <Grid container spacing={3} p={3}>
        {products.map((product, index) => {
          if (product.status === false) {
            return (
              <Grid key={index} item>
                <CardOrder
                  props={product}
                  amount={product.amount}
                  id={orders._id}
                />
              </Grid>
            );
          }
        })}
      </Grid>
    </Box>
  );
};

export default Bill;

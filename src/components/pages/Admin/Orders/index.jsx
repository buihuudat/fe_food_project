import React from "react";
import { Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CardOrder from "./CardOrder";

const Bill = () => {
  const orders = useSelector((state) => state.userOrder.getAll);
  let products = [];
  orders.map(
    (order) =>
      (products = [
        ...order.products.map((data) => (data = { ...data, UID: order.user })),
      ])
  );
  return (
    <Box>
      <Grid container spacing={3} p={3}>
        {products.map((product, index) => {
          if (product.status === false) {
            return (
              <Grid key={index} item>
                <CardOrder props={product} amount={product.amount} id={orders._id} />
              </Grid>
            )
          }
        })}
      </Grid>
    </Box>
  );
};

export default Bill;

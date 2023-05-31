import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CardOrder from "./CardOrder";
import * as _ from "lodash";
import userOrderApi from "../../../../api/userOrderApi";

const Bill = () => {
  const [statusProduct, setStatusProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const rs = await userOrderApi.getAll();
      setOrders(rs);
    };
    getOrders();
  }, [loading]);
  let products = [];
  orders.map(
    (order) =>
      (products = [
        ...order.products.map((data) => (data = { ...data, UID: order.user })),
      ])
  );

  products = _.filter(products, { status: statusProduct });

  const handleChange = (e) => {
    setStatusProduct(e.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ width: 200, mt: 2 }}>
        <InputLabel id="demo-simple-select-label">
          Trạng thái đơn hàng
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={statusProduct}
          label="Trạng thái đơn hàng"
          onChange={handleChange}
        >
          <MenuItem value={false}>Chưa xác nhận</MenuItem>
          <MenuItem value={true}>Đã xác nhận</MenuItem>
        </Select>
      </FormControl>
      {!products.length ? (
        <Typography align="center" fontSize={30}>
          Chưa có order
        </Typography>
      ) : (
        <Grid container spacing={3} p={3}>
          {products.map((product, index) => {
            return (
              <Grid key={index} item>
                <CardOrder
                  props={product}
                  amount={product.amount}
                  id={orders._id}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Bill;

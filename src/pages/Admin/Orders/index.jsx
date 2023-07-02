import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CardOrder from "../../../components/CardOrder";
import userOrderApi from "../../../utils/api/userOrderApi";
import ControlStatus from "../../../components/ControlStatus";

const Bill = () => {
  document.title = "Orders | Administrator";
  const [statusProduct, setStatusProduct] = useState("Chờ xác nhận");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const rs = await userOrderApi.getAll();
      setOrders(rs);
    };
    getOrders();
  }, [loading]);

  const extractedData = () => {
    let pr2 = [];
    orders.map((item) => {
      const _id = item._id;
      const UID = item.user;

      return item.products.map(
        (product) =>
          (pr2 = [
            ...pr2,
            {
              ...product,
              product: product.product,
              amount: product.amount,
              status: product.status,
              voucher_used: product.voucher_used,
              product_id: product._id,
              _id,
              UID,
            },
          ])
      );
    });
    return pr2;
  };

  return (
    <Box>
      <ControlStatus
        statusProduct={statusProduct}
        setStatusProduct={setStatusProduct}
      />
      {!extractedData().filter((p) => p.status === statusProduct).length ? (
        <Typography align="center" fontSize={30}>
          Chưa có đơn hàng
        </Typography>
      ) : (
        <Grid container spacing={5} p={3} justifyContent={"center"}>
          {extractedData()
            .filter((p) => p.status === statusProduct)
            .map((product, index) => {
              return (
                <Grid key={index} item>
                  <CardOrder
                    props={product}
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

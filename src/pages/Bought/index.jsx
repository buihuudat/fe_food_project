import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";

import userOrderApi from "../../utils/api/userOrderApi";
import { setOrder } from "../../redux/reducers/orderReducer";
import CardOrder from "../../components/CardOrder";

const Bought = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getOrder = async () => {
      const rs = await userOrderApi.get(user);
      setProducts(() => {
        let pr2 = [];
        const _id = rs._id;
        const UID = user._id;
        rs.products.map(
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
        return pr2;
      });
      setLoading(false);
      dispatch(setOrder({ data: rs, status: false }));
    };
    getOrder();
  }, [dispatch, user, loading]);

  return loading ? (
    <LinearProgress />
  ) : (
    <Box>
      {products.filter((product) => product.status === "Hoàn tất").length ? (
        <Grid container spacing={3} p={3}>
          {products
            .filter((product) => product.status === "Hoàn tất")
            .map((product, index) => (
              <Grid key={index} item>
                <CardOrder props={product} setLoading={setLoading} />
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography align="center" fontWeight={600} fontSize={30}>
          Bạn chưa có hóa đơn
        </Typography>
      )}
    </Box>
  );
};

export default Bought;

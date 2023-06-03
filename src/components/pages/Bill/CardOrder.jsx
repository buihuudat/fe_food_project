import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import currentFormat from "../../../handler/currentFormat";
import { useDispatch } from "react-redux";
import { setProductDetails } from "../../../redux/reducers/productReducer";
import voucherApi from "../../../api/voucherApi";
const CardOrder = ({ props, amount }) => {
  const [discount, setDiscount] = useState(0);
  const products = props.product;
  const dispatch = useDispatch();

  const handleViewProductDetails = (product) => {
    dispatch(
      setProductDetails({
        status: true,
        data: product,
      })
    );
  };

  useEffect(() => {
    const getDiscount = async () => {
      const rs = await voucherApi.get({ voucher: props.voucher_used });
      setDiscount(rs.discount ? "-" + rs.discount + "%" : 0);
    };
    getDiscount();
  }, [props.voucher_used]);

  const CartProduct = (product) => (
    <Paper
      component={CardActionArea}
      onClick={() => handleViewProductDetails(product)}
      sx={{
        mt: 3,
        p: 1,
        minWidth: 300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Avatar
          src={product.image}
          variant={"square"}
          alt={product.name}
          sx={{ width: 80, height: 80 }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "start",
            width: 200,
          }}
        >
          <Typography fontWeight={600} variant="h6">
            {product.name}
          </Typography>
          {/* <Typography variant="subtitle2">{product.description}</Typography> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography color="orange" fontWeight={600}>
              {currentFormat(
                product.price - (product.price * product.discount) / 100
              )}
            </Typography>
            <Typography color="orange">SL:{product.count}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item>
          <Card>
            <CardContent>
              <Paper sx={{ maxHeight: 240, overflow: "auto" }}>
                {products.map((product) => (
                  <CartProduct key={product.id} {...product} />
                ))}
              </Paper>
              {/* <Paper>
                  <Typography>{props.voucher_used}</Typography>
                </Paper> */}
              <Typography
                sx={{
                  background: "orange",
                  m: "10px 0",
                  borderRadius: "5px",
                }}
                variant="h5"
                align="center"
                fontWeight={600}
                color="white"
                p={1}
              >
                {currentFormat(amount)} <i>{discount === 0 ? "" : discount}</i>
              </Typography>
              <Typography
                sx={{
                  m: "10px 0",
                  borderRadius: "5px",
                  outline: "1px solid orange",
                }}
                variant="h6"
                align="center"
                fontWeight={600}
                color="orange"
                p={1}
              >
                Đang giao ...
              </Typography>
              <Button fullWidth variant="contained" color="success">
                Liên hệ với người bán
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardOrder;

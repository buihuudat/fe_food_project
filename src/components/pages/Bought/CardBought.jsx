import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import currentFormat from "../../../handler/currentFormat";
import PayModal from "../Home/Pay/PayModal";
import { useDispatch, useSelector } from "react-redux";
import { setPayModal } from "../../../redux/reducers/modalReducer";
import moment from "moment";

const CardOrder = ({ props, amount }) => {
  const dispatch = useDispatch();
  const products = props.product;
  const user = useSelector((state) => state.user.value);

  const CartProduct = (product) => (
    <Paper
      sx={{
        mt: 3,
        p: 1,
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
          }}
        >
          <Typography fontWeight={600} variant="h6">
            {product.name}
          </Typography>
          <Typography variant="subtitle2">{product.description}</Typography>
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
            <Typography color="orange">*{product.count}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  let assignProducts = [];
  props.product.map((product) =>
    assignProducts.push({ ...product, countCartUser: product.count })
  );
  const handleReBought = () => {
    const data = {
      products: assignProducts,
      user: user,
      amount: props.amount,
    };
    dispatch(setPayModal({ data: data, type: true }));
  };
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item>
          <Card>
            <Typography
              align="right"
              fontWeight={600}
              p={1}
              sx={{ fontStyle: "italic" }}
            >
              {moment(props.createdAt).format("L")}
            </Typography>
            <CardContent>
              {products.map((product) => (
                <CartProduct key={product.id} {...product} />
              ))}

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
                {currentFormat(amount)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleReBought}
                sx={{ mb: 1 }}
              >
                Mua lại
              </Button>
              <Button fullWidth variant="contained" color="success">
                Liên hệ với người bán
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <PayModal />
    </Box>
  );
};

export default CardOrder;

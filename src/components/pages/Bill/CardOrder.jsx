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
const CardOrder = ({ props, amount }) => {
  const products = props.product;

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
              {currentFormat(product.price - (product.price * product.discount) / 100)}
            </Typography>
            <Typography color="orange">*{product.count}</Typography>
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
              {products.map((product) => (
                <CartProduct key={product.id} {...product} />
              ))}

              <Typography
                sx={{
                  background: "orange",
                  m: '10px 0',
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
              <Typography
                sx={{
                  m: '10px 0',
                  borderRadius: "5px",
                  outline: '1px solid orange'
                }}
                variant="h6"
                align="center"
                fontWeight={600}
                color="orange"
                p={1}
              >
                ??ang giao ...
              </Typography>
              <Button fullWidth variant='contained' color='success'>Li??n h??? v???i ng?????i b??n</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardOrder;

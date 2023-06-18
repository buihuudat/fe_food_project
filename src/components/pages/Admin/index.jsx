import React from "react";
import _, { filter } from "lodash";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useSelector } from "react-redux";

const dataInfo = [
  {
    icon: <GroupIcon sx={{ width: 60, height: 60 }} />,
    title: "Users",
    count: 0,
  },
  {
    icon: <Inventory2Icon sx={{ width: 60, height: 60 }} />,
    title: "Product",
    count: 0,
  },
  {
    icon: <ShoppingCartIcon sx={{ width: 60, height: 60 }} />,
    title: "Order",
    count: 0,
  },
  {
    icon: <SellIcon sx={{ width: 60, height: 60 }} />,
    title: "Total Sell",
    count: 0,
  },
];

const Information = () => (
  <Box>
    <Grid container spacing={3} justifyContent="center">
      {dataInfo.map((data, index) => (
        <Grid key={index} item xs={3}>
          <Paper
            sx={{
              width: "300px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              m: "0 auto",
              mt: 4,
              p: 2,
            }}
          >
            {data.icon}
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box>
              <Typography align="center">{data.title}</Typography>
              <Typography
                align="center"
                color="orange"
                fontWeight={600}
                variant={"h5"}
              >
                {data.count}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const Admin = () => {
  document.title = "Administrator";

  const usersRedux = useSelector((state) => state.user.allUser);
  const productsRedux = useSelector((state) => state.products.data);
  const orderRedux = useSelector((state) => state.userOrder.getAll);
  const filterData = (arr, key, value) =>
    _.filter(arr, {
      [key]: value,
    });

  let products = [];
  orderRedux.map(
    (order) =>
      (products = [
        ...order.products.map((data) => (data = { ...data, UID: order.user })),
      ])
  );

  dataInfo[0].count = filterData(usersRedux, "permission", 1).length;
  dataInfo[1].count = productsRedux.length;
  dataInfo[2].count = filter(products, {
    status: false,
  }).length;
  dataInfo[3].count = filter(products, {
    status: true,
  }).length;

  return (
    <Box>
      <Information />
    </Box>
  );
};

export default Admin;

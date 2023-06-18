import * as React from "react";
import Box from "@mui/material/Box";
import _ from "lodash";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DiscountIcon from "@mui/icons-material/Discount";
import FeedbackIcon from "@mui/icons-material/Feedback";

import { useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Chip, ListItemSecondaryAction } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

const drawerWidth = 200;

export default function SideBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [countOrder, setCountOrder] = useState(0);

  const orders = useSelector((state) => state.userOrder.getAll);
  const products = useSelector((state) => state.products.data);
  const users = useSelector((state) => state.user.allUser);
  const vouchers = useSelector((state) => state.voucher.data);
  const feedbacks = useSelector((state) => state.user.allFeedback);

  useEffect(() => {
    orders.map((order) =>
      setCountOrder(_.filter(order.products, { status: false }).length)
    );
  }, [orders]);

  const headerData = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      path: "/admin",
      noti: 0,
    },
    {
      icon: <AddShoppingCartOutlinedIcon />,
      text: "Products",
      path: "/admin/products",
      noti: products.length,
    },
    {
      icon: <ShoppingCartOutlinedIcon />,
      text: "Orders",
      path: "/admin/orders",
      noti: countOrder,
    },
    {
      icon: <DiscountIcon />,
      text: "Vouchers",
      path: "/admin/vouchers",
      noti: vouchers.length,
    },
    {
      icon: <AccountCircleOutlinedIcon />,
      text: "Users",
      path: "/admin/users",
      noti: users.length,
    },
    // {
    //   icon: <MessageIcon />,
    //   text: "Messages",
    //   path: "/admin/message",
    //   noti: users.length,
    // },
    {
      icon: <FeedbackIcon />,
      text: "Feedbacks",
      path: "/admin/feedback",
      noti: _.filter(feedbacks, { resolve: false }).length,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            align="center"
            fontWeight={600}
            color="orange"
            variant="h4"
            sx={{ textDecoration: "none" }}
          >
            Food SF
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {headerData.map((data, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={
                data.path === pathname
                  ? { background: "orange", color: "white" }
                  : {}
              }
            >
              <ListItemButton component={NavLink} to={data.path}>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.text} />
                {data.noti !== 0 && (
                  <ListItemSecondaryAction>
                    <Chip label={data.noti} />
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            mt: "auto",
          }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

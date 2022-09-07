import * as React from "react";
import Box from "@mui/material/Box";
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

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAllUser, setUser } from "../../../redux/reducers/userReducer";

const drawerWidth = 200;

const headerData = [
  {
    icon: <DashboardIcon />,
    text: "Dashboard",
    path: "/admin",
  },
  {
    icon: <AddShoppingCartOutlinedIcon />,
    text: "Products",
    path: "/admin/products",
  },
  {
    icon: <ShoppingCartOutlinedIcon />,
    text: "Orders",
    path: "/admin/orders",
  },
  {
    icon: <AccountCircleOutlinedIcon />,
    text: "Users",
    path: "/admin/users",
  },
];

export default function SideBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
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
            <ListItem key={index} disablePadding>
              <ListItemButton to={data.path}>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.text} />
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

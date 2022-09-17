import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import { Button, Chip, ListItemSecondaryAction } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import authUtils from "../../../utils/authUtils";
import { setUser } from "../../../redux/reducers/userReducer";
import {
  setMessageModal,
  setNotificationModal,
  setSigninModal,
  setSignupModal,
  setSupportModal,
} from "../../../redux/reducers/modalReducer";
import { setLogin } from "../../../redux/reducers/handlerReducer";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;

export default function Navbar() {
  const [countOrders, setCountOrders] = useState(0);
  const [countBoughts, setCountBoughts] = useState(0);

  const dispatch = useDispatch();

  const login = useSelector((state) => state.handler.login);
  const permission = useSelector((state) => state.user.value).permission;
  const orders = useSelector((state) => state.userOrder.order).data.products;

  useEffect(() => {
    const setCountOrder = () => {
      setCountOrders(
        _.filter(orders, {
          status: false,
        }).length
      );
    };
    const setCountBought = () => {
      setCountBoughts(
        _.filter(orders, {
          status: true,
        }).length
      );
    };
    setCountOrder();
    setCountBought();
  }, [orders, login]);

  const headers = [
    {
      icon: <HomeOutlinedIcon />,
      text: "Trang chủ",
      path: "/",
      noti: 0,
    },
    {
      icon: <DescriptionOutlinedIcon />,
      text: "Hóa đơn",
      path: "/bills",
      noti: countOrders,
    },
    {
      icon: <HistoryOutlinedIcon />,
      text: "Đã Mua",
      path: "/bought",
      noti: countBoughts,
    },
  ];

  const otherHeaders = [
    {
      icon: <NotificationsNoneOutlinedIcon />,
      text: "Thông báo",
      display: true,
      handler: () => dispatch(setNotificationModal(true)),
      noti: 0,
    },
    // {
    //   icon: <MessageOutlinedIcon />,
    //   text: "Tin nhắn",
    //   display: true,
    //   handler: () => dispatch(setMessageModal(true)),
    //   noti: 0,
    // },
    {
      icon: <ContactSupportOutlinedIcon />,
      text: "Hỗ Trợ",
      display: true,
      handler: () => dispatch(setSupportModal(true)),
      noti: 0,
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      const auth = await authUtils.isAuthenticated();
      if (!auth) {
        dispatch(setLogin(false));
      } else {
        dispatch(setUser(auth));
      }
    };
    getUser();
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(setSigninModal(true));
  };
  const handleSignup = () => {
    dispatch(setSignupModal(true));
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
        <Typography
          align="center"
          fontWeight={600}
          color="orange"
          p={1}
          variant="h4"
          component={Link}
          to="/"
          sx={{ textDecoration: "none" }}
        >
          Food SF
        </Typography>
        <Divider />
        <List>
          {headers.map((data, index) => (
            <ListItem key={index}>
              <ListItemButton to={data.path}>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText>{data.text}</ListItemText>
                {login && data.noti !== 0 && (
                  <ListItemSecondaryAction>
                    <Chip label={data.noti} />
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box>
          <Divider component="div" role="presentation">
            <Chip label="Khác" />
          </Divider>
        </Box>
        <List>
          {otherHeaders.map((data, index) => (
            <ListItem key={index}>
              <ListItemButton onClick={
                login ? data.handler : () => dispatch(setSigninModal(true))
              }>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText>{data.text}</ListItemText>
                {login && data.noti !== 0 && (
                  <ListItemSecondaryAction>
                    <Chip label={data.noti} />
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            </ListItem>
          ))}
          {permission === 0 && login && (
            <ListItem>
              <ListItemButton href="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon color="primary" />
                </ListItemIcon>
                <ListItemText>Admin Page</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Box sx={{ mt: "auto" }}>
          {login ? (
            <Profile />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button
                fullWidth
                size="large"
                sx={{ mb: 3 }}
                startIcon={<LoginIcon />}
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mb: 3 }}
                color="secondary"
                startIcon={<ExitToAppIcon />}
                onClick={handleSignup}
              >
                Đăng ký
              </Button>
            </Box>
          )}
          <Typography variant={"body2"} align="center" color="#333">
            @2022 Designer by Bui Huu Dat
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

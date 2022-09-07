import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import { Button, Chip } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import authUtils from "../../../utils/authUtils";
import { setUser } from "../../../redux/reducers/userReducer";
import { setSigninModal } from "../../../redux/reducers/modalReducer";
import { setLogin } from "../../../redux/reducers/handlerReducer";
import Profile from "./Profile";

const drawerWidth = 240;

export default function Navbar() {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.handler.login);
  const permission = useSelector((state) => state.user.value).permission;

  const headers = [
    {
      icon: <HomeOutlinedIcon />,
      text: "Trang chủ",
    },
    {
      icon: <DescriptionOutlinedIcon />,
      text: "Hóa đơn",
    },
    {
      icon: <HistoryOutlinedIcon />,
      text: "Đã Mua",
    },
  ];

  const otherHeaders = [
    {
      icon: <NotificationsNoneOutlinedIcon />,
      text: "Thông báo",
      display: true,
    },
    {
      icon: <MessageOutlinedIcon />,
      text: "Tin nhắn",
      display: true,
    },
    {
      icon: <ContactSupportOutlinedIcon />,
      text: "Hỗ Trợ",
      display: true,
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
        >
          Food SF
        </Typography>
        <Divider />
        <List>
          {headers.map((data, index) => (
            <ListItem key={index}>
              <ListItemButton>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText>{data.text}</ListItemText>
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
              <ListItemButton>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText>{data.text}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          {permission === 0 && (
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
            <Button
              fullWidth
              size="large"
              sx={{ mb: 3 }}
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
          )}
          <Typography variant={"body2"} align="center" color="#333">
            @2022 Designer by Bui Huu Dat
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

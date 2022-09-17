import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, Button, Paper } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import LogoutIcon from "@mui/icons-material/Logout";

import { setLogin } from "../../../redux/reducers/handlerReducer";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: '10px',
};

const Profile = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLogin(false));
    setOpen(false);
    navigate('/')
  };

  return (
    user && (
      <Box>
        <Paper
          sx={{
            m: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            alt={user.fullname}
            src={user.image}
            sx={{ m: "0 auto", width: "70px", height: "70px" }}
          />
          <Typography fontWeight={600} variant="h5">
            {user.fullname}
          </Typography>
          <Typography variant="body2">{user.permission === 0 ? 'Quản trị viên' : 'Người dùng'}</Typography>
          <Button href={"/profile"}  variant="outlined">Profile</Button>
        </Paper>
        <Button
          fullWidth
          size="large"
          sx={{ mb: 3 }}
          startIcon={<LogoutIcon />}
          onClick={() => setOpen(true)}
        >
          Đăng xuất
        </Button>
        {open && (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 1000,
            }}
          >
            <Box sx={style}>
              <Typography pb={5} variant="h5" align='center' component="h2">
                Bạn có chắc muốn đăng xuất?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 5
                }}
              >
                <Button fullWidth variant='outlined' color="success" onClick={handleLogout}>
                  Đăng xuất
                </Button>
                <Button fullWidth variant='outlined' color="warning" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    )
  );
};

export default Profile;

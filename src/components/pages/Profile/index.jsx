import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import proviceApi from "../../../api/proviceApi";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import FileBase64 from "react-file-base64";
import userApi from "../../../api/userApi";
import { setUser } from "../../../redux/reducers/userReducer";
import Toast from "../../common/Toast";
import authUtils from "../../../utils/authUtils";
import imageUpload from "../../../handler/ImageUpload";

const Profile = () => {
  const [fullnameErrText, setFullnameErrText] = useState("");
  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
  const [phoneErrText, setPhoneErrText] = useState("");
  const [streetErrText, setStreetErrText] = useState("");
  const [apartmentNumberErrText, setApartmentNumberErrText] = useState("");

  const [provice, setProvice] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [city, setCity] = useState(0);
  const [district, setDistrict] = useState(0);
  const [ward, setWard] = useState(0);

  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const user = useSelector((state) => state.user.value);
  const address = user.address[0] || [];

  const dispatch = useDispatch();

  // get user
  useEffect(() => {
    const getUser = async () => {
      const user = await authUtils.isAuthenticated();
      dispatch(setUser(user));
    };
    getUser();
  }, [loading]);

  // get provice
  useEffect(() => {
    const getProvice = async () => {
      const data = await proviceApi.get();
      setProvice(data);
    };
    getProvice();
  }, [hidden]);
  // get districts
  useEffect(() => {
    const districts = () => {
      provice.forEach((data, index) => {
        if (index === city) {
          setDistricts(data.districts);
        }
      });
    };
    districts();
  }, [city, provice]);
  // get ward
  useEffect(() => {
    const wards = () => {
      districts.forEach((data, index) => {
        if (index === district) {
          setWards(data.wards);
        }
      });
    };
    wards();
  }, [districts, district]);

  const handleEdit = () => {
    setHidden(false);
    setDisable(false);
  };

  const handleChangeAvatar = async (e) => {
    setLoading(true);
    try {
      const changed = await userApi.updateAvatar({
        UID: user._id,
        image: imageUpload(e.base64),
      });
      dispatch(setUser(changed));
      setLoading(false);
      Toast("success", "Đã cập nhật ảnh đại diện");
    } catch (error) {
      Toast("error", "Cập nhật ảnh đại diện thất bại");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      _id: user._id,
      fullname: formData.get("fullname").trim(),
      email: formData.get("email").trim().toLowerCase(),
      phone: formData.get("phone").trim(),
      password: formData.get("password").trim(),
      confirmPassword: formData.get("confirmPassword").trim(),
      address: {
        city: provice[city].name,
        district: districts[district].name,
        ward: wards[ward].name,
        street: formData.get("street"),
        apartmentNumber: formData.get("apartmentNumber").trim(),
        more: formData.get("more"),
      },
    };

    let err = false;
    if (data.fullname === "") {
      err = true;
      setFullnameErrText("Bạn chưa nhập tên");
    }
    if (data.email === "") {
      err = true;
      setEmailErrText("Bạn chưa nhập email");
    }
    if (data.phone === "") {
      err = true;
      setPhoneErrText("Bạn chưa nhập số điện thoại");
    }
    if (data.password === "") {
      err = true;
      setPasswordErrText("Bạn chưa nhập mật khẩu");
    }
    if (data.confirmPassword === "") {
      err = true;
      setConfirmPasswordErrText("Bạn chưa nhập mật khẩu");
    }
    if (data.confirmPassword !== data.password) {
      err = true;
      setConfirmPasswordErrText("Mật khẩu không khớp");
    }
    if (data.address.street === "") {
      err = true;
      setStreetErrText("Bạn chưa nhập tên đường");
    }
    if (data.address.apartmentNumber === "") {
      err = true;
      setApartmentNumberErrText("Bạn chưa nhập số nhà");
    }

    if (err) return;

    setLoading(true);
    setFullnameErrText("");
    setEmailErrText("");
    setPhoneErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");
    setStreetErrText("");
    setApartmentNumberErrText("");

    try {
      const user = await userApi.update(data);
      dispatch(setUser(user));
      setLoading(false);
      setHidden(true);
      setDisable(true);

      setFullnameErrText("");
      setEmailErrText("");
      setPhoneErrText("");
      setPasswordErrText("");
      setConfirmPasswordErrText("");
      setStreetErrText("");
      setApartmentNumberErrText("");

      Toast("success", "Cập nhật thành công");
    } catch (error) {
      const errors = error.data.errors;
      setLoading(false);
      errors.map((e) => {
        if (e.param === "email") {
          setEmailErrText(e.msg);
        }
        if (e.param === "phone") {
          setPhoneErrText(e.msg);
        }
        if (e.param === "password") {
          setPasswordErrText(e.msg);
        }
        if (e.param === "confirmPassword") {
          setConfirmPasswordErrText(e.msg);
        }
      });
    }
  };

  const handleCancel = () => {
    setHidden(true);
    setDisable(true);
    setLoading(false);

    setFullnameErrText("");
    setEmailErrText("");
    setPhoneErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");
    setStreetErrText("");
    setApartmentNumberErrText("");
  };

  return (
    <Box>
      <Container maxWidth={"md"}>
        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography pb={3} align="center" fontWeight={600} variant="h4">
            Hello {user.fullname}
          </Typography>
          <Avatar
            alt={user.fullname}
            src={user.image}
            sx={{ m: "0 auto", width: "90px", height: "90px" }}
          />
          <Box sx={{ m: "0 auto" }}>
            <Typography>Đổi ảnh đại diện</Typography>
            <FileBase64
              type="file"
              multiple={false}
              onDone={(e) => handleChangeAvatar(e)}
            />
          </Box>
          <Box component={"form"} onSubmit={handleSubmit} sx={{}}>
            <TextField
              fullWidth
              margin="normal"
              label="Tên"
              name="fullname"
              defaultValue={user.fullname}
              disabled={disable}
              error={fullnameErrText !== ""}
              helperText={fullnameErrText}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              defaultValue={user.email}
              disabled={disable}
              error={emailErrText !== ""}
              helperText={emailErrText}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Số điện thoại"
              name="phone"
              disabled={disable}
              defaultValue={user.phone}
              error={phoneErrText !== ""}
              helperText={phoneErrText}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mật khẩu"
              name="password"
              type={"password"}
              disabled={disable}
              defaultValue={user.password}
              error={passwordErrText !== ""}
              helperText={passwordErrText}
            />
            {!hidden && (
              <TextField
                fullWidth
                margin="normal"
                label="Xác minh Mật khẩu"
                name="confirmPassword"
                type={"password"}
                disabled={disable}
                defaultValue={user.password}
                error={confirmPasswordErrText !== ""}
                helperText={confirmPasswordErrText}
              />
            )}
            {hidden && (
              <TextField
                fullWidth
                margin="normal"
                label="Địa chỉ"
                name="address"
                disabled={disable}
                defaultValue={
                  address.city
                    ? `${address.apartmentNumber} ${address.street} ${address.ward} ${address.district} ${address.city}`
                    : ""
                }
              />
            )}
            {!hidden && (
              <Box pt={2}>
                <Divider>
                  <Chip label="Địa chỉ" />
                </Divider>
                <Grid pt={4} container spacing={3} justifyContent="center">
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel>Thành phố</InputLabel>
                      <Select
                        label="Thành phố"
                        value={city}
                        name="city"
                        onChange={(e) => setCity(e.target.value)}
                      >
                        {provice.map((data, index) => (
                          <MenuItem key={index} value={index}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel>Quận/Huyện</InputLabel>
                      <Select
                        label="Quận/Huyện"
                        name="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                        {districts.map((data, index) => (
                          <MenuItem key={index} value={index}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel>Phường/Xã</InputLabel>
                      <Select
                        name="ward"
                        label="Phường/Xã"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                      >
                        {wards.map((data, index) => (
                          <MenuItem key={index} value={index}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                  }}
                >
                  <TextField
                    label="Tên đường"
                    name="street"
                    margin="normal"
                    fullWidth
                    defaultValue={address.street || ""}
                    error={streetErrText !== ""}
                    helperText={streetErrText}
                  />
                  <TextField
                    label="Số nhà"
                    margin="normal"
                    fullWidth
                    name="apartmentNumber"
                    defaultValue={address.apartmentNumber || ""}
                    error={apartmentNumberErrText !== ""}
                    helperText={apartmentNumberErrText}
                  />
                </Box>
                <TextField
                  label="Mô tả thêm"
                  multiline
                  fullWidth
                  name="more"
                  margin="normal"
                  rows={3}
                  defaultValue={address.more && ""}
                />
              </Box>
            )}
            {hidden ? (
              <Button
                color="primary"
                fullWidth
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={handleEdit}
              >
                Sửa
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 3,
                  pt: 3,
                }}
              >
                <Button
                  fullWidth
                  color="warning"
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <LoadingButton
                  fullWidth
                  color="success"
                  variant="outlined"
                  loading={loading}
                  type="submit"
                >
                  Cập nhật
                </LoadingButton>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;

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
import _ from "lodash";
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
      Toast("success", "???? c???p nh???t ???nh ?????i di???n");
    } catch (error) {
      Toast("error", "C???p nh???t ???nh ?????i di???n th???t b???i");
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
      setFullnameErrText("B???n ch??a nh???p t??n");
    }
    if (data.email === "") {
      err = true;
      setEmailErrText("B???n ch??a nh???p email");
    }
    if (data.phone === "") {
      err = true;
      setPhoneErrText("B???n ch??a nh???p s??? ??i???n tho???i");
    }
    if (data.password === "") {
      err = true;
      setPasswordErrText("B???n ch??a nh???p m???t kh???u");
    }
    if (data.confirmPassword === "") {
      err = true;
      setConfirmPasswordErrText("B???n ch??a nh???p m???t kh???u");
    }
    if (data.confirmPassword !== data.password) {
      err = true;
      setConfirmPasswordErrText("M???t kh???u kh??ng kh???p");
    }
    if (data.address.street === "") {
      err = true;
      setStreetErrText("B???n ch??a nh???p t??n ???????ng");
    }
    if (data.address.apartmentNumber === "") {
      err = true;
      setApartmentNumberErrText("B???n ch??a nh???p s??? nh??");
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

      Toast("success", "C???p nh???t th??nh c??ng");
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
            <Typography>?????i ???nh ?????i di???n</Typography>
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
              label="T??n"
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
              label="S??? ??i???n tho???i"
              name="phone"
              disabled={disable}
              defaultValue={user.phone}
              error={phoneErrText !== ""}
              helperText={phoneErrText}
            />
            <TextField
              fullWidth
              margin="normal"
              label="M???t kh???u"
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
                label="X??c minh M???t kh???u"
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
                label="?????a ch???"
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
                  <Chip label="?????a ch???" />
                </Divider>
                <Grid pt={4} container spacing={3} justifyContent="center">
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel>Th??nh ph???</InputLabel>
                      <Select
                        label="Th??nh ph???"
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
                      <InputLabel>Qu???n/Huy???n</InputLabel>
                      <Select
                        label="Qu???n/Huy???n"
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
                      <InputLabel>Ph?????ng/X??</InputLabel>
                      <Select
                        name="ward"
                        label="Ph?????ng/X??"
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
                    label="T??n ???????ng"
                    name="street"
                    margin="normal"
                    fullWidth
                    defaultValue={address.street || ""}
                    error={streetErrText !== ""}
                    helperText={streetErrText}
                  />
                  <TextField
                    label="S??? nh??"
                    margin="normal"
                    fullWidth
                    name="apartmentNumber"
                    defaultValue={address.apartmentNumber || ""}
                    error={apartmentNumberErrText !== ""}
                    helperText={apartmentNumberErrText}
                  />
                </Box>
                <TextField
                  label="M?? t??? th??m"
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
                S???a
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
                  H???y
                </Button>
                <LoadingButton
                  fullWidth
                  color="success"
                  variant="outlined"
                  loading={loading}
                  type="submit"
                >
                  C???p nh???t
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

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import currentFormat from "../utils/handler/currentFormat";
import { setProductDetails } from "../redux/reducers/productReducer";
import voucherApi from "../utils/api/productApi";
import userApi from "../utils/api/userApi";
import { statusData } from "../resources/data";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import userOrderApi from "../utils/api/userOrderApi";
import Toast from "./common/Toast";
import { useLocation } from "react-router-dom";

const CardOrder = ({ props, setLoading }) => {
  const [discount, setDiscount] = useState(0);
  const [reason, setReason] = useState("");
  const [user, setUser] = useState(null);
  const [getUserLoading, setGetUserLoading] = useState(true);
  const [showPhone, setshowPhone] = useState(false);
  const [color, setColor] = useState("red");
  const [textStatus, setTextStatus] = useState("Loading");
  const [disable, setDisable] = useState(false);
  const [isAccessLoading, setIsAccessLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);

  const products = props.product;
  const dispatch = useDispatch();
  const navigate = useLocation();

  const handleViewProductDetails = (product) => {
    dispatch(
      setProductDetails({
        status: true,
        data: product,
      })
    );
  };

  useEffect(() => {
    const getDiscount = async () => {
      const rs = await voucherApi.get({ voucher: props.voucher_used });
      setDiscount(rs.discount ? "-" + rs.discount + "%" : 0);
    };
    getDiscount();
    const getUser = async () => {
      const user = await userApi.get(props.UID);
      setUser(user);
      setGetUserLoading(false);
    };
    getUser();

    statusData.forEach((st) => {
      if (st.status === props.status) {
        setColor(st.color);
        setTextStatus(st.status);
      }
    });
  }, [props]);

  const CartProduct = (product) => (
    <Paper
      component={CardActionArea}
      onClick={() => handleViewProductDetails(product)}
      sx={{
        p: 1,
        width: 250,
        height: 80,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={product.image}
          variant={"square"}
          alt={product.name}
          sx={{ width: 60, height: 60 }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "start",
            width: 200,
          }}
        >
          <Typography
            fontWeight={600}
            variant="h6"
            textTransform={"capitalize "}
          >
            {product.name.length > 10
              ? product.name.slice(0, 10) + "..."
              : product.name}
          </Typography>
          {/* <Typography variant="subtitle2">{product.description}</Typography> */}
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
            <Typography color="orange">SL:{product.count}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  const UseInfo = () => {
    let address = user
      ? `${user.address[0].street} ${user.address[0].district} ${user.address[0].city} ${user.address[0].more}`.slice(
          0,
          50
        )
      : "";
    return getUserLoading ? (
      <CircularProgress />
    ) : (
      <Box p={1}>
        <Divider>
          <Chip label="Thông tin người mua" />
        </Divider>
        {/* <Avatar src={user?.image} /> */}
        <Typography>
          <b>Tên: </b> {user.fullname}
        </Typography>
        <Typography>
          <b>Số điện thoại: </b> {user.phone}
        </Typography>
        <Typography>
          <b>Địa chỉ: </b> {address}
        </Typography>
      </Box>
    );
  };

  const totalProduct = props.product.reduce((prev, p) => prev + p.count, 0);
  const path = navigate.pathname.split("/")[1].toString() !== "admin";

  const handleAccess = async () => {
    setIsAccessLoading(true);
    setDisable(true);
    setLoading(true);
    try {
      await userOrderApi.update({
        _id: props._id,
        id_product: props.product_id,
        status: "Đang giao",
        reason: "",
      });
      Toast("success", "Đã xác nhận đơn hàng");
    } catch (error) {
      console.log(error);
      Toast("error", "Đã xác nhận thất bại");
    } finally {
      setIsAccessLoading(false);
      setDisable(false);
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelLoading(true);
    setDisable(true);
    setLoading(true);
    try {
      await userOrderApi.update({
        _id: props._id,
        id_product: props.product_id,
        status: "Đã hủy",
        reason,
      });
      Toast("success", "Đã hủy đơn hàng");
    } catch (error) {
      console.log(error);
      Toast("success", "Hủy đơn hàng thất bại");
    } finally {
      setIsCancelLoading(false);
      setDisable(false);
      setLoading(false);
    }
  };
  const handleSuccess = async () => {
    setIsSuccessLoading(true);
    setLoading(true);
    try {
      await userOrderApi.update({
        _id: props._id,
        id_product: props.product_id,
        status: "Hoàn tất",
        reason,
      });
      Toast("success", "Xác nhận thành công");
    } catch (error) {
      console.log(error);
      Toast("success", "Xác nhận  đơn hàng thất bại");
    } finally {
      setIsSuccessLoading(false);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        outline: `2px solid ${color}`,
        borderRadius: "5px",
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          <Card sx={{ width: 600 }}>
            <UseInfo />
            <Box sx={{ p: 1 }}>
              <Divider>
                <Chip label="Thông tin đơn hàng" />
              </Divider>
              {/* thong tin don hang */}
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Typography color={color}>
                    <b>Tình trạng: </b>
                    {props?.status}
                  </Typography>
                  <Typography>
                    <b>Voucher đã sử dụng: </b>
                    {props.voucher_used}
                  </Typography>
                  <Typography>
                    <b>Tổng sản phẩm: </b>
                    {totalProduct} sản phẩm
                  </Typography>
                  {props?.reason !== "" && (
                    <Typography color={"error"} fontSize={20}>
                      <b>Lý do hủy: </b>
                      {props.reason}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography>
                    <b>Ngày mua: </b>
                    {moment(props.createdAt).format("D/M/YYYY, h:mm:ss a")}
                  </Typography>
                  <Typography>
                    <b>Discount: </b>
                    {props?.discount}
                  </Typography>
                  <Typography>
                    <b>Tổng thanh toán: </b>
                    <span style={{ fontSize: 20, color }}>
                      {currentFormat(props.amount)}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* danh sach sp */}
            <Divider>
              <Chip label="Danh sách sản phẩm" />
            </Divider>
            <CardContent>
              <Box
                sx={{
                  mx: 2,
                  height: 240,
                  overflow: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                {products.map((product) => (
                  <CartProduct key={product.id} {...product} />
                ))}
              </Box>
              <hr />
              {textStatus === "Chờ xác nhận" ? (
                <Box>
                  <LoadingButton
                    fullWidth
                    sx={{
                      m: "10px 0",
                      borderRadius: "5px",
                      outline: `1px solid green`,
                      color: "green",
                    }}
                    onClick={handleAccess}
                    loading={isAccessLoading}
                    disabled={disable}
                  >
                    Xác nhận đơn hàng
                  </LoadingButton>
                  <TextField
                    sx={{ mt: 2 }}
                    label="Lý do hủy đơn"
                    name="reason"
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    disabled={props?.reason}
                    defaultValue={props?.reason}
                    multiline={true}
                  />
                  <LoadingButton
                    fullWidth
                    sx={{
                      m: "10px 0",
                      borderRadius: "5px",
                      outline: `1px solid red`,
                      color: "red",
                    }}
                    onClick={handleCancel}
                    loading={isCancelLoading}
                    disabled={disable}
                  >
                    Hủy đơn hàng
                  </LoadingButton>
                </Box>
              ) : (
                props.status === "Đang giao" &&
                path && (
                  <LoadingButton
                    fullWidth
                    sx={{
                      m: "10px 0",
                      borderRadius: "5px",
                      outline: `1px solid green`,
                      color: "green",
                    }}
                    onClick={handleSuccess}
                    loading={isSuccessLoading}
                  >
                    Đã nhận được hàng
                  </LoadingButton>
                )
              )}
              {path && (
                <LoadingButton
                  fullWidth
                  sx={{
                    m: "10px 0",
                    borderRadius: "5px",
                  }}
                  variant="contained"
                  onClick={handleSuccess}
                  loading={isSuccessLoading}
                >
                  Mua lại
                </LoadingButton>
              )}
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => setshowPhone(true)}
              >
                {showPhone ? user?.phone : "Liên hệ với người bán"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardOrder;

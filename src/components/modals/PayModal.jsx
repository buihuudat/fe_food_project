import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Chip, Divider, Paper, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import ProductItem from "../../pages/Home/Pay/ProductItem";
import Toast from "../common/Toast";
import { setPayModal } from "../../redux/reducers/modalReducer";
import { setOrder } from "../../redux/reducers/orderReducer";
import { setCart } from "../../redux/reducers/cartReducer";
import currentFormat from "../../utils/handler/currentFormat";
import voucherApi from "../../utils/api/voucherApi";
import userOrderApi from "../../utils/api/userOrderApi";
import productApi from "../../utils/api/productApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function PayModal() {
  const [isVoucherLoading, setisVoucherLoading] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [voucherErrText, setVoucherErrText] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucher, setVoucher] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payModal = useSelector((state) => state.modal.pay);
  const open = payModal.type;

  const totalProduct = payModal.data.products?.reduce(
    (prev, product) => prev + product.countCartUser,
    0
  );

  const handleClose = () => {
    setLoading(false);
    setisVoucherLoading(false);
    setVoucherErrText("");
    setVoucher("");
    dispatch(setPayModal({ type: false, data: {} }));
  };

  const handleVoucher = async (e) => {
    e.preventDefault();
    const voucher = new FormData(e.target).get("voucher");

    if (voucher === "") {
      setVoucherErrText("Bạn chưa nhập voucher");
      return;
    }
    setVoucher(voucher);
    setVoucherErrText("");
    setisVoucherLoading(true);
    try {
      const getVoucher = await voucherApi.get({ voucher });
      if (!getVoucher || getVoucher.data === null) {
        setVoucherErrText("Voucher không đúng hoặc đã được sử dụng");
        setVoucher("");
        setDiscount(0);
        return;
      }
      setDiscount(getVoucher.discount);
    } catch (error) {
      setVoucherErrText("Voucher không tồn tại");
      setDiscount(0);
      setVoucher("");
    } finally {
      setisVoucherLoading(false);
    }
  };

  let products = [];
  payModal.data.products?.map((product) => {
    products.push({
      id: product._id,
      image: product.image,
      name: product.name,
      description: product.description,
      count: product.countCartUser,
      price: product.price,
      discount: product.discount,
    });
  });
  const handlePay = async () => {
    const data = {
      products: {
        product: products,
        amount: payModal.data.amount,
        voucher_used: voucher,
        discount: discount,
      },
      user: payModal.data.user._id,
    };

    if (!payModal.data.user.address.length) {
      // eslint-disable-next-line no-restricted-globals
      const isCf = confirm("Bạn chưa có địa chỉ, thêm địa chỉ?");
      if (isCf) {
        navigate("/profile");
      }
      return;
    }

    setLoading(true);
    try {
      const userOrder = await userOrderApi.create(data);
      dispatch(setOrder({ data: userOrder, status: false }));
      payModal.data.products.map(async (product) => {
        await productApi.update({ ...product, countCartUser: 0 });
      });
      Toast("success", "Đặt hàng thành công");
      dispatch(setCart([]));
      dispatch(setPayModal({ type: false, data: {} }));
      setVoucher("");
      setVoucherErrText("");
      setLoading(false);
      navigate("/bills");
    } catch (error) {
      Toast("error", "Sản phẩm đã hết");
      setLoading(false);
      setVoucher("");
      setVoucherErrText("");
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Divider>
            <Typography align="center" variant="h4" fontWeight={600}>
              Thanh toán đơn hàng
            </Typography>
          </Divider>

          <Box>
            <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
              {payModal.data.products?.map((product, index) => (
                <ProductItem key={index} props={product} />
              ))}
            </Paper>
            <Box pt={3}>
              <Divider>
                <Chip label="Thanh toán" />
              </Divider>
            </Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={600} variant="h5">
                  Tổng số sản phẩm:
                </Typography>
                <Typography fontWeight={600} variant="h5" color="orange">
                  {totalProduct} sản phẩm
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={600} variant="h5">
                  Tổng tiền hàng:
                </Typography>
                <Typography fontWeight={600} variant="h5" color="orange">
                  {currentFormat(payModal.data.amount)}
                </Typography>
              </Box>
              <Box
                component={"form"}
                onSubmit={handleVoucher}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  name="voucher"
                  label="Nhập mã giảm giá"
                  error={voucherErrText !== ""}
                  helperText={voucherErrText}
                />
                <LoadingButton
                  sx={{ width: 200 }}
                  size="large"
                  type="submit"
                  loading={isVoucherLoading}
                  variant="outlined"
                >
                  Áp dụng
                </LoadingButton>
              </Box>
              {discount !== 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Discount: </Typography>
                  <Typography fontWeight={600} variant="h6" color="orange">
                    {discount}%
                  </Typography>
                </Box>
              )}
              <Box
                pt={2}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography fontWeight={600} variant="h5">
                  Tổng thanh toán:
                </Typography>
                <Typography fontWeight={600} variant="h5" color="orange">
                  {currentFormat(
                    payModal.data.amount -
                      (payModal.data.amount * discount) / 100
                  )}
                </Typography>
              </Box>
              <Box
                pt={3}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  justifyContent: "space-around",
                }}
              >
                <Button
                  color="warning"
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={handleClose}
                >
                  Hủy
                </Button>
                <LoadingButton
                  color="success"
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={handlePay}
                  loading={loading}
                >
                  Thanh toán
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

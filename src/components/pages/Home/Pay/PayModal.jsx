import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setPayModal } from "../../../../redux/reducers/modalReducer";
import { Chip, Divider, Paper, TextField } from "@mui/material";
import currentFormat from "../../../../handler/currentFormat";
import LoadingButton from "@mui/lab/LoadingButton";
import voucherApi from "../../../../api/voucherApi";
import Toast from "../../../common/Toast";
import Product from "./Product";
import userOrderApi from "../../../../api/userOrderApi";
import productApi from "../../../../api/productApi";
import { setOrder } from "../../../../redux/reducers/orderReducer";
import { setCart } from "../../../../redux/reducers/cartReducer";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = React.useState(false);
  const [voucherErrText, setVoucherErrText] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucher, setVoucher] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payModal = useSelector((state) => state.modal.pay);
  const open = payModal.type;

  const handleClose = () => {
    dispatch(setPayModal({ type: false, data: {} }));
  };

  const handleVoucher = async (e) => {
    e.preventDefault();
    const voucher = new FormData(e.target).get("voucher");

    if (voucher === "") {
      setVoucherErrText("Bạn chưa nhập voucher");
      return;
    }
    setLoading(true);
    setVoucher(voucher);
    try {
      const getVoucher = await voucherApi.get({ voucher: voucher });
      if (!getVoucher || getVoucher.data === null) {
        setVoucherErrText("Voucher không đúng hoặc đã được sử dụng");
        setLoading(false);
        setVoucher("");
        setDiscount(0);
        return;
      }
      setVoucherErrText("");
      setLoading(false);
      setDiscount(getVoucher.discount);
    } catch (error) {
      Toast("Error", "Voucher không tồn tại");
      setDiscount(0);
      setLoading(false);
      setVoucherErrText("");
      setVoucher("");
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
          <Typography align="center" variant="h4">
            Thanh toán đơn hàng
          </Typography>
          <Box>
            <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
              {payModal.data.products?.map((product, index) => (
                <Product key={index} props={product} />
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
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  margin="normal"
                  name="voucher"
                  label="Nhập mã giảm giá"
                  error={voucherErrText !== ""}
                  helperText={voucherErrText}
                />
                <LoadingButton
                  sx={{ width: 200 }}
                  size="large"
                  type="submit"
                  loading={loading}
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

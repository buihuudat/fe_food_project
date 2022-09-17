import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import voucherApi from "../../../../api/voucherApi";
import Toast from "../../../common/Toast";
import { useDispatch } from "react-redux";
import { setVoucher } from "../../../../redux/reducers/voucherReducer";
import moment from "moment";
import { useEffect } from "react";
import { setDeleteVoucherModal } from "../../../../redux/reducers/modalReducer";

const Item = ({ props }) => {
  const [disable, setDisable] = useState(true);
  const [countErrText, setCountErrText] = useState("");
  const [hsdErrText, sethsdErrText] = useState("");
  const [discountErrText, setDiscountErrText] = useState("");

  const dispatch = useDispatch();

  // check date
  const checkDate = (e) => {
    if (moment(e).format("L") <= moment().format("L")) {
      sethsdErrText("Hạn sử dụng không hợp lệ");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const OutOfDate = async () => {
      if (!checkDate) {
        const voucher = await voucherApi.delete({ _id: props._id });
        dispatch(setVoucher(voucher));
      }
    };
    OutOfDate();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      _id: props._id,
      count: formData.get("count"),
      discount: formData.get("discount"),
      HSD: formData.get("HSD"),
    };

    let err = false;
    if (data.discount === "") {
      err = true;
      setDiscountErrText("Bạn chưa nhập discount");
    }
    if (data.count === "") {
      err = true;
      setCountErrText("yêu cầu nhập số lượng voucher");
    }
    if (err) return;
    if (!checkDate(data.HSD)) return;
    setDiscountErrText("");
    setCountErrText("");
    try {
      await voucherApi.update(data);
      const voucher = await voucherApi.getAll();
      dispatch(setVoucher(voucher));
      setDisable(true);
      Toast("success", "Cập nhật thành công");
    } catch (error) {
      const errors = error.data;
      Toast("error", errors);
    }
  };
  const handleDelete = () => {
    dispatch(
      setDeleteVoucherModal({
        data: props,
        type: true,
      })
    );
  };
  const handleEdit = () => {
    setDisable(!disable);
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Typography
            fontWeight={600}
            variant={"h4"}
            p={2}
            color="orange"
            align="center"
          >
            {props.voucher}
          </Typography>
          <Typography fontWeight={600} variant={"h5"} p={2}>
            DISCOUNT {props.discount}%
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <TextField
              margin="normal"
              label="Discount"
              defaultValue={props.discount}
              type="number"
              name="discount"
              size="small"
              sx={{
                color: "orange",
                borderRadius: "5px",
              }}
              disabled={disable}
              error={discountErrText !== ""}
              helperText={discountErrText}
            />
            <TextField
              margin="normal"
              label="Số lượng"
              defaultValue={props.count}
              type="number"
              name="count"
              size="small"
              sx={{
                color: "orange",
                borderRadius: "5px",
              }}
              disabled={disable}
              error={countErrText !== ""}
              helperText={countErrText}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <TextField
              margin="normal"
              label="Hạn sử dụng"
              defaultValue={moment(props.HSD).format("YYYY-MM-DD")}
              type="date"
              name="HSD"
              size="small"
              sx={{
                color: "orange",
                borderRadius: "5px",
              }}
              disabled={disable}
              error={hsdErrText !== ""}
              helperText={hsdErrText}
            />
            <TextField
              margin="normal"
              label="Còn lại"
              value={moment(props.HSD).endOf().fromNow()}
              size="small"
              sx={{
                color: "orange",
                borderRadius: "5px",
                width: "150px",
              }}
              disabled={true}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
            pt={3}
          >
            <Button onClick={handleDelete}>
              <DeleteIcon color="error" />
            </Button>
            {disable && (
              <Button onClick={handleEdit}>
                <EditIcon color="warning" />
              </Button>
            )}
            {!disable && (
              <LoadingButton type="submit">
                <DoneIcon color="success" />
              </LoadingButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Item;

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

import _ from "lodash";
import FileBase64 from "react-file-base64";
import {
  setAddModal,
  setUpdateModal,
} from "../../../../../redux/reducers/modalReducer";
import Toast from "../../../../common/Toast";
import productApi from "../../../../../api/productApi";
import { useEffect } from "react";
import { setProducts } from "../../../../../redux/reducers/productReducer";
import imageUpload from "../../../../../handler/ImageUpload";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const menu = [
  {
    title: "Hot",
    type: "hot",
  },
  {
    title: "Cơm",
    type: "rice",
  },
  {
    title: "Mì",
    type: "noodle",
  },
  {
    title: "Đồ ăn nhanh",
    type: "fast_food",
  },
  {
    title: "Coffee",
    type: "coffee",
  },
  {
    title: "Trà sữa",
    type: "milk_tea",
  },
  {
    title: "Kem",
    type: "cream",
  },
  {
    title: "Ăn vặt",
    type: "junk_food",
  },
];

export default function UpdateModal() {
  const [image, setImage] = useState("");
  const [nameErrText, setNameErrText] = useState("");
  const [descErrText, setDescErrText] = useState("");
  const [priceErrText, setPriceErrText] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const update = useSelector((state) => state.modal.updateModal);
  const type = _.findIndex(
    menu,
    (e) => {
      return e.type == update.data.type;
    },
    0
  );
  const [value, setValue] = useState(type);

  useEffect(() => {
    const getAllProduct = async () => {
      const products = await productApi.getAll();
      dispatch(setProducts(products));
    };
    getAllProduct();
  }, [dispatch, loading]);

  const handleClose = () => {
    dispatch(setUpdateModal({ type: false, data: {} }));
    setLoading(false);
    setValue(0);
    setImage("");
    setNameErrText("");
    setDescErrText("");
    setPriceErrText("");
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleChangeAvatar = async (e) => {
    setImage(await imageUpload(e.base64));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      _id: update.data._id,
      type: menu[formData.get("type")].type,
      name: formData.get("product_name"),
      description: formData.get("product_desc"),
      price: formData.get("product_price"),
      discount: formData.get("discount") || 0,
      image: image || update.data.image,
      count: formData.get("count"),
    };
    let err = false;
    if (data.name === "") {
      err = true;
      setNameErrText("Vui lòng nhập tên sản phẩm");
    }
    if (data.description === "") {
      err = true;
      setDescErrText("Vui lòng nhập nội dung sản phẩm");
    }
    if (data.price === "") {
      err = true;
      setPriceErrText("Vui lòng nhập giá sản phẩm");
    }
    if (data.image === "") {
      err = true;
      alert("Hãy thêm ảnh cho sản phẩm");
    }

    if (err) return;
    setLoading(true);
    setNameErrText("");
    setDescErrText("");
    setPriceErrText("");

    try {
      const updateProduct = await productApi.update(data);
      Toast("success", `Đã cập nhật ${updateProduct.name}`);
      setLoading(false);
      dispatch(setUpdateModal({ type: false, data: {} }));
    } catch (error) {
      setLoading(false);
      Toast(
        "error",
        "Cập nhật thất bại!!!...uhmm maybe đã có lỗi nào đó sảy ra"
      );
    }
  };

  return (
    <div>
      <Modal
        open={update.type}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component={"form"} onSubmit={handleSubmit}>
          <Typography pb={5} align="center" fontWeight={600} variant="h5">
            Cập nhật sản phẩm
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Loại sản phẩm</InputLabel>
            <Select
              label="Loại sản phẩm"
              name="type"
              defaultValue={type}
              onChange={handleChange}
            >
              {menu.map(({ title }, index) => (
                <MenuItem key={index} value={index}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            fullWidth
            sx={{ mt: 3, display: "flex", flexDirection: "column" }}
          >
            <img
              src={image || update.data.image}
              style={{
                width: "200px",
              }}
            />
            <FileBase64
              type={"file"}
              multiple={false}
              onDone={(e) => handleChangeAvatar(e)}
            />
          </Button>
          <TextField
            fullWidth
            margin="normal"
            label="Tên sản phẩm"
            name="product_name"
            defaultValue={update.data.name}
            error={nameErrText !== ""}
            helperText={nameErrText}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Mô tả"
            name="product_desc"
            defaultValue={update.data.description}
            error={descErrText !== ""}
            helperText={descErrText}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Giá"
            name="product_price"
            type={"number"}
            defaultValue={update.data.price}
            error={priceErrText !== ""}
            helperText={priceErrText}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discount %"
            defaultValue={update.data.discount}
            name="discount"
            type={"number"}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Count"
            defaultValue={update.data.count}
            name="count"
            type={"number"}
          />
          <LoadingButton
            fullWidth
            color="success"
            variant="outlined"
            sx={{ mt: 2 }}
            loading={loading}
            type={"submit"}
          >
            Cập nhật
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

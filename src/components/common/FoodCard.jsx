import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  Typography,
  capitalize,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import currentFormat from "../../handler/currentFormat";
import { setUpdateModal } from "../../redux/reducers/modalReducer";
import productApi from "../../api/productApi";
import Toast from "./Toast";
import {
  setProductDetails,
  setProducts,
} from "../../redux/reducers/productReducer";
import { setCart } from "../../redux/reducers/cartReducer";
import LoadingButton from "@mui/lab/LoadingButton";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FoodCard = ({ props }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);
  const { permission } = useSelector((state) => state.user.value);
  const addCart = useSelector((state) => state.cart.data);
  const dataProduct = useSelector((state) => state.products.data);
  const handleDelete = async (e) => {
    try {
      const product = await productApi.delete(e);
      dispatch(setProducts(product));
      Toast("success", "Đã xóa thành công");
      setOpen(false);
    } catch (error) {
      Toast("error", "Xóa thất bại");
      setOpen(false);
    }
  };

  const handleEdit = (e) => {
    dispatch(setUpdateModal({ type: true, data: e }));
  };

  const handleAdd = (e) => {
    let isExist = false;
    let cartItems = [...addCart];
    let productItems = [...dataProduct];

    cartItems.map((v, i) => {
      if (e._id === v._id) {
        isExist = true;
        cartItems[i] = {
          ...v,
          countCartUser: v.countCartUser + 1,
          count: v.count - 1,
        };
      }
    });

    productItems.map((v, i) => {
      if (e._id === v._id) {
        productItems[i] = {
          ...v,
          count: v.count - 1,
          countCartUser: v.countCartUser + 1,
        };
        dispatch(setProducts([...productItems]));
      }
    });

    isExist && dispatch(setCart([...cartItems]));

    !isExist &&
      dispatch(
        setCart([
          ...cartItems,
          {
            ...e,
            countCartUser: e.countCartUser + 1,
            count: e.count - 1,
          },
        ])
      );
  };

  const handleViewProductDetail = () => {
    dispatch(
      setProductDetails({
        status: true,
        data: props,
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Card sx={{ width: 180 }}>
        <CardContent sx={{ m: 0, p: 0 }}>
          <CardActionArea onClick={handleViewProductDetail}>
            <CardMedia
              sx={{ width: "100%", height: "100px", objectFit: "fill" }}
              component="img"
              image={props.image}
            />
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                height: 70,
                p: 0,
                pt: 1,
              }}
            >
              <Typography
                variant="body1"
                textTransform={"capitalize"}
                fontSize={20}
                fontWeight={600}
              >
                {props.name}
              </Typography>
              {/* <Typography variant="body2" pt={1} pb={1}>
                {props.description}
              </Typography> */}
              <Typography
                variant="body1"
                mt="auto"
                fontWeight={500}
                color="orange"
                sx={{ textDecoration: "line-through", pl: 2 }}
                align="left"
              >
                {props.discount !== 0 && currentFormat(props.price)}
              </Typography>
            </CardContent>
          </CardActionArea>

          <Box
            mt="auto"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
            }}
          >
            <Typography variant="h5" fontWeight={600} color="orange">
              {currentFormat(
                props.price - (props.price * props.discount) / 100
              )}
            </Typography>
            {pathname.split("/")[1] !== "admin" &&
              (props.countCartUser > 0 ? (
                <IconButton disabled>
                  <PlaylistAddCheckIcon color="success" />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleAdd(props)}>
                  <AddShoppingCartIcon color="primary" />
                </IconButton>
              ))}
          </Box>

          {pathname.split("/")[1] === "admin" && permission === 0 && (
            <Typography variant="body2" fontWeight={600} color="primary">
              Số lượng: {props.count}
            </Typography>
          )}
        </CardContent>

        {pathname.split("/")[1] === "admin" && permission === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              p: 1,
            }}
          >
            <IconButton onClick={() => setOpen(true)}>
              <DeleteIcon color="error" />
            </IconButton>
            <IconButton onClick={() => handleEdit(props)}>
              <EditIcon color="primary" />
            </IconButton>
          </Box>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography align="center" pb={3} variant="h5" fontWeight={600}>
            Bạn có chắc muốn xóa {props.name} ?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Button
              onClick={handleClose}
              color="primary"
              fullWidth
              variant="outlined"
            >
              Hủy
            </Button>
            <LoadingButton
              color="error"
              fullWidth
              variant="outlined"
              onClick={() => handleDelete(props)}
            >
              Xóa
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FoodCard;

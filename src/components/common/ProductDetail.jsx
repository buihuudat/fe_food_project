import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  setProductDetails,
  setProducts,
} from "../../redux/reducers/productReducer";
import currentFormat from "../../handler/currentFormat";
import StarIcon from "@mui/icons-material/Star";
import { IconButton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { setCart } from "../../redux/reducers/cartReducer";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDriction: "row",
  justifyContent: "space-between",
  gap: 4,
  borderRadius: 5,
};

export default function ProductDetail() {
  const { status: open, data } = useSelector((state) => state.products.details);
  const dispatch = useDispatch();
  const addCart = useSelector((state) => state.cart.data);
  const dataProduct = useSelector((state) => state.products.data);
  const { pathname } = useLocation();

  const handleClose = () => {
    dispatch(setProductDetails({ status: false, data: {} }));
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

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={data.image} alt={data.name} />
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h1"
              fontWeight={600}
            >
              {data.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {data.description}
            </Typography>
            <Typography
              sx={{ mt: "auto" }}
              fontWeight={600}
              fontSize={35}
              color={"orange"}
            >
              {currentFormat(data.price)}
            </Typography>
            <Box>
              <StarIcon color="warning" />
              <StarIcon color="warning" />
              <StarIcon color="warning" />
              <StarIcon color="warning" />
              <StarIcon color="warning" />
            </Box>
            {pathname.split("/")[1] !== "admin" &&
              (data.countCartUser > 0 ? (
                <IconButton disabled>
                  <PlaylistAddCheckIcon color="success" />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleAdd(data)}>
                  <AddShoppingCartIcon color="primary" />
                </IconButton>
              ))}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

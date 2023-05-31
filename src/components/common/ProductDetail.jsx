import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "../../redux/reducers/productReducer";
import currentFormat from "../../handler/currentFormat";

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
  const handleClose = () => {
    dispatch(setProductDetails({ status: false, data: {} }));
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
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

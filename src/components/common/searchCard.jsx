import { Box, CardActionArea, Paper, Typography } from "@mui/material";
import React from "react";
import currentFormat from "../../handler/currentFormat";
import { useDispatch } from "react-redux";
import { setProductDetails } from "../../redux/reducers/productReducer";

const SearchCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleViewProductDetails = () => {
    dispatch(
      setProductDetails({
        status: true,
        data: product,
      })
    );
  };
  return (
    <Paper
      component={CardActionArea}
      onClick={handleViewProductDetails}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 100,
        width: "100%",
        gap: 3,
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: 80, height: 80, objectFit: "cover" }}
      />
      <Box sx={{ alignItems: "start", width: 160 }}>
        <Typography fontWeight={600} fontSize={20}>
          {product.name}
        </Typography>
        <Typography color={"orange"}>{currentFormat(product.price)}</Typography>
      </Box>
    </Paper>
  );
};

export default SearchCard;

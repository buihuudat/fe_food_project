import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar,  Paper } from "@mui/material";
import currentFormat from "../../../../handler/currentFormat";

const Product = ({props}) => {
  return (
    <Box pt={3}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 500,
        }}
      >
        <Avatar
          variant="rounded"
          src={props.image}
          alt={props.name}
          style={{ width: 80, height: 80, objectFit: 'cover' }}
        />
        <Box sx={{ flexGrow: 1, pr: 2, pl: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {props.name}
            </Typography>
            <Typography variant="h6" fontWeight={600} color="orange">
              {props.discount > 0 && `-${props.discount}%`}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#888" }}>
            {props.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ textDecoration: "line-through" }}>
              {currentFormat(props.price)}
            </Typography>
            <Typography color="orange" fontWeight={600}>
              {currentFormat(props.price - (props.price*props.discount/100))} * {props.countCartUser}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            background: "orange",
            height: 80,
            display: "flex",
            alignItems: "center",
            borderRadius: "5px",
            p: 1,
            justifyContent: "center",
            width: 150,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            align="center"
            color="white"
          >
            {currentFormat((props.price - (props.price*props.discount/100)) * props.countCartUser)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
export default Product
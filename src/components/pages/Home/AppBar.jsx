import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import productApi from "../../../api/productApi";
import SearchCard from "../../common/searchCard";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "25ch",
      // "&:focus": {
      //   width: "30ch",
      // },
    },
  },
}));

export default function SearchAppBar() {
  const [value, setValue] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [productResult, setProductResult] = React.useState([]);

  React.useEffect(() => {
    const getProducts = async () => {
      const rs = await productApi.getAll();
      setProducts(rs);
    };
    getProducts();
  }, []);

  React.useEffect(() => {
    setProductResult(
      value !== ""
        ? products.filter((p) =>
            p.name.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  }, [value, products]);

  return (
    <Box sx={{ flexGrow: 1, pb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant={"h5"}>
          <b>Danh Sách</b> Thực đơn
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm Kiếm..."
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setValue(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              position: "absolute",
            }}
          >
            {productResult.map((product, i) => (
              <SearchCard key={i} product={product} />
            ))}
          </Box>
        </Search>
      </Box>
    </Box>
  );
}

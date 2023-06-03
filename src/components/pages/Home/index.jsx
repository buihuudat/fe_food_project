import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import _ from "lodash";
import AppBar from "./AppBar";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import RiceBowlOutlinedIcon from "@mui/icons-material/RiceBowlOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import EmojiFoodBeverageOutlinedIcon from "@mui/icons-material/EmojiFoodBeverageOutlined";
import IcecreamOutlinedIcon from "@mui/icons-material/IcecreamOutlined";
import KebabDiningOutlinedIcon from "@mui/icons-material/KebabDiningOutlined";
import FoodCard from "../../common/FoodCard";
import Pay from "./Pay";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PayModal from "./Pay/PayModal";
import DensitySmallIcon from "@mui/icons-material/DensitySmall";
const menu = [
  // {
  //   icon: (
  //     <LocalFireDepartmentOutlinedIcon sx={{ width: "60px", height: "60px" }} />
  //   ),
  //   title: "Hot",
  //   type: 'hot',
  // },
  {
    icon: <DensitySmallIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Tất cả",
    type: "all",
  },
  {
    icon: <RiceBowlOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Cơm",
    type: "rice",
  },
  {
    icon: <RamenDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Mì",
    type: "noodle",
  },
  {
    icon: <LunchDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Đồ ăn nhanh",
    type: "fast_food",
  },
  {
    icon: <LocalCafeOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Coffee",
    type: "coffee",
  },
  {
    icon: (
      <EmojiFoodBeverageOutlinedIcon sx={{ width: "60px", height: "60px" }} />
    ),
    title: "Trà sữa",
    type: "milk_tea",
  },
  {
    icon: <IcecreamOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Kem",
    type: "cream",
  },
  {
    icon: <KebabDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Ăn vặt",
    type: "junk_food",
  },
];

const HomePage = () => {
  const [type, setType] = useState("all");
  const [option, setOption] = useState(0);
  const cart = useSelector((state) => state.cart.data);
  const products = useSelector((state) => state.products.data);
  const drawerWidth = cart.length > 0 && 320;

  // get data for pay
  const dataFilter = (type) => {
    const sort = ["createdAt", "price", "price"];
    const reverse = ["desc", "asc", "desc"];
    let data =
      type === "all"
        ? products
        : _.filter(products, {
            type: type,
          });
    data = _.orderBy(data, [`${sort[option]}`], [`${reverse[option]}`]);
    return data;
  };

  const [tab, setTab] = useState(0);
  const [dataProduct, setDataProduct] = useState(dataFilter(menu[0].type));

  useEffect(() => {
    setDataProduct(dataFilter(type));
  }, [products, option]);

  const handleClick = (e) => {
    const type = menu[e].type;
    setDataProduct(dataFilter(type));
    setTab(e);
    setType(type);
  };

  return (
    <Box sx={{ pr: `${drawerWidth}px` }}>
      <Box sx={{ p: 3 }}>
        <AppBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            flexWrap: "nowrap",
            justifyContent: "center",
          }}
        >
          {menu.map((data, index) => (
            <Card
              key={index}
              sx={
                index === tab
                  ? {
                      backgroundColor: "orange",
                      color: "#fff",
                      minWidth: "150px",
                      height: "max-content",
                    }
                  : {
                      height: "max-content",
                      minWidth: "150px",
                    }
              }
            >
              <CardActionArea
                onClick={() => handleClick(index)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  {data.icon}
                  <Typography pt={1} fontWeight={600}>
                    {data.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
        <Box
          pt={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 3,
          }}
        >
          <Typography variant={"h5"} fontWeight={600}>
            Chọn sản phẩm
          </Typography>
          <FormControl variant="standard">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Sắp xếp
            </InputLabel>
            <NativeSelect
              defaultValue={option}
              inputProps={{
                name: "priceUp",
                id: "uncontrolled-native",
              }}
              onChange={(e) => setOption(e.target.value)}
            >
              <option value={0}>Mới nhất</option>
              <option value={1}>Giá tăng dần</option>
              <option value={2}>Giá giảm dần</option>
            </NativeSelect>
          </FormControl>
        </Box>
        <Grid
          container
          spacing={3}
          p={3}
          sx={{ overflowY: "auto", height: 620, mx: "auto" }}
        >
          {dataProduct.map((data, index) => {
            if (data.count > 0) {
              return (
                <Grid key={index} item>
                  <FoodCard props={data} />
                </Grid>
              );
            }
          })}
        </Grid>
      </Box>
      <Pay drawerWidth={drawerWidth} />
      <PayModal />
    </Box>
  );
};

export default HomePage;

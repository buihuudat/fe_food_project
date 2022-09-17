import React, { useState } from "react";
import _ from 'lodash'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import RiceBowlOutlinedIcon from "@mui/icons-material/RiceBowlOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import EmojiFoodBeverageOutlinedIcon from "@mui/icons-material/EmojiFoodBeverageOutlined";
import IcecreamOutlinedIcon from "@mui/icons-material/IcecreamOutlined";
import KebabDiningOutlinedIcon from "@mui/icons-material/KebabDiningOutlined";
import SearchAppBar from "./search";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import FoodCard from "../../../common/FoodCard";
import AddModal from "./modals/addModal";
import { useDispatch, useSelector } from 'react-redux'
import { setAddModal } from '../../../../redux/reducers/modalReducer'
import UpdateModal from "./modals/updateModal";
import { useEffect } from "react";

const menu = [
  // {
  //   icon: (
  //     <LocalFireDepartmentOutlinedIcon sx={{ width: "60px", height: "60px" }} />
  //   ),
  //   title: "Hot",
  //   type: 'hot',
  // },
  {
    icon: <RiceBowlOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Cơm",
    type: 'rice'
  },
  {
    icon: <RamenDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Mì",
    type: 'noodle'
  },
  {
    icon: <LunchDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Đồ ăn nhanh",
    type: 'fast_food'
  },
  {
    icon: <LocalCafeOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Coffee",
    type: 'coffee'
  },
  {
    icon: (
      <EmojiFoodBeverageOutlinedIcon sx={{ width: "60px", height: "60px" }} />
    ),
    title: "Trà sữa",
    type: 'milk_tea'
  },
  {
    icon: <IcecreamOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Kem",
    type: 'cream'
  },
  {
    icon: <KebabDiningOutlinedIcon sx={{ width: "60px", height: "60px" }} />,
    title: "Ăn vặt",
    type: 'junk_food'
  },
];

const AddToggle = () => {
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(setAddModal(true))
  };
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        flexGrow: 1,
      }}
    >
      <IconButton onClick={handleClick}>
        <AddIcon sx={{ width: 50, height: 50 }} color="warning" />
      </IconButton>
    </Box>
  );
};

const Products = () => {
  const products = useSelector(state => state.products.data)

  const dataFilter = (type) => {
    const data = _.filter(products, {
      'type': type
    })
    return data
  }

  const [tab, setTab] = useState(0);
  const [dataProduct, setDataProduct] = useState(dataFilter(menu[0].type))

  useEffect(() => {
    const type = menu[tab].type
    setDataProduct(dataFilter(type))
  }, [products])
  const handleClick = (e) => {
    const type = menu[e].type
    setDataProduct(dataFilter(type))
    setTab(e);
  };

  return (
    <Box>
      <SearchAppBar />
      <Box sx={{ p: 3 }}>
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
              defaultValue={10}
              inputProps={{
                name: "priceUp",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Mới nhất</option>
              <option value={20}>Giá tăng dần</option>
              <option value={30}>Giá giảm dần</option>
            </NativeSelect>
          </FormControl>
        </Box>
        <Grid container spacing={3} p={3}>
          {dataProduct.map((data, index) => (
            <Grid key={index} item>
              <FoodCard props={data} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddToggle />
      <AddModal />
      <UpdateModal />
    </Box>
  );
};

export default Products;

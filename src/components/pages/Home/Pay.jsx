import * as React from "react";
import _ from 'lodash'
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import { Button, Chip, IconButton, stepContentClasses } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { useDispatch, useSelector } from "react-redux";
import currentFormat from "../../../handler/currentFormat";
import { setCart } from "../../../redux/reducers/cartReducer";
import { useEffect } from "react";

const CountUp = ({props}) => {
  const cartProduct = useSelector(state => state.cart.data)
  const dataProduct = useSelector(state => state.products.data)

  const dispatch = useDispatch()
  let cartItems = [...cartProduct] // cartItems of cart products
  let productItems = [...dataProduct] // dataProduct of cart products

  const updateCart = (up) => {
    cartProduct.map((v, i) => {
      if (v._id === props._id) {
        cartItems[i] = {
          ...v,
          count:  up ? v.count - 1 : v.count + 1,
          countCartUser: up ? props.countCartUser + 1 : props.countCartUser - 1
        }
      }
    })
    dispatch(setCart([...cartItems]))

    dataProduct.map((v, i) => {
      if (v._id === props._id) {
        productItems[i] = {
          ...v,
          count:  up ? v.count - 1 : v.count + 1,
          countCartUser: up ? props.countCartUser + 1 : props.countCartUser - 1
        }
      }
    })
  }
  
  const handleUp = (e) => {
    updateCart(true)
  }
  const handleDown = (e) => {
    updateCart(false)
  }

  useEffect(() => {
    // hide modal pay when countCCartUser = 0    
    const removeCart = () => {
      const index = _.findIndex(cartProduct, e => { return  e.countCartUser == 0 })
      index !== -1 && cartItems.splice(index, 1)
      dispatch(setCart([...cartItems]))
    }
    removeCart()
  }, [props.countCartUser])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <IconButton onClick={() => handleDown(props)}>
        <HorizontalRuleOutlinedIcon fontSize="small" />
      </IconButton>
      <Typography fontWeight={600}>{props.countCartUser}</Typography>
      <IconButton disabled={props.count===0} onClick={() => handleUp(props)}>
        <AddOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const Product = ({props}) => {
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "row",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={props.image}
        alt={props.name}
        style={{
          width: "60px",
          borderRadius: "5px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "max-content",
        }}
      >
        <Typography fontWeight={600} component="h6">
          {props.name}
        </Typography>
        <Typography variant="body2">{currentFormat(props.price)}</Typography>
      </Box>
      <Box>
        <CountUp props={props} />
        <Typography variant="h6" fontWeight={600} align="center">
          {currentFormat((props.price - (props.price * props.discount / 100)) * props.countCartUser)}
        </Typography>
      </Box>
    </Box>
  );
};

export default function Pay({ drawerWidth }) {
  const products = useSelector(state => state.cart.data)
  const amount = () => {
    const result = _.sumBy(products, e => {
      return (e.price - (e.price * e.discount / 100)) * e.countCartUser
    })
    return result
  }
  
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Đơn đặt hàng
          </Typography>
          <IconButton>
            <AutoFixHighRoundedIcon />
          </IconButton>
        </Box>
        <List sx={{overflowY: 'auto'}}>
          {products && products.map((data, index) => (
            <Product key={index} props={data} />
          ))}
        </List>
        <Box
          sx={{
            mt: "auto",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            p: 3,
          }}
        >
          <Box>
            <Divider>
              <Chip label="Thanh toán hóa đơn" />
            </Divider>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Tổng thanh toán</Typography>
            <Typography variant="h6" fontWeight={600}>
              {currentFormat(amount())}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Giảm giá (50%)</Typography>
            <Typography variant="h6" fontWeight={600}>
              13.000
            </Typography>
          </Box>
          <Button
            sx={{ mt: 5 }}
            size="large"
            variant="contained"
            color="warning"
          >
            Thanh Toán 13,000 vnd
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

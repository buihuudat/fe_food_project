import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import currentFormat from '../../../../handler/currentFormat'
import { useState } from "react";
import { useEffect } from "react";
import userApi from '../../../../api/userApi'
import userOrderApi from '../../../../api/userOrderApi'
import Toast from '../../../common/Toast'
import { useDispatch } from "react-redux";
import { setOrder } from '../../../../redux/reducers/orderReducer'

const CardOrder = ({ props, amount, id }) => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const products = props.product;
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      const user = await userApi.get({_id: props.UID})
      setUser(user)
    }
    getUser()
  }, [props])

  const CartProduct = (product) => (
    <Paper
      sx={{
        mt: 3,
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Avatar
          src={product.image}
          variant={"square"}
          alt={product.name}
          sx={{ width: 80, height: 80 }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography fontWeight={600} variant="h6">
            {product.name}
          </Typography>
          <Typography variant="subtitle2">{product.description}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography color="orange" fontWeight={600}>
              {currentFormat(product.price - (product.price * product.discount) / 100)}
            </Typography>
            <Typography color="orange">*{product.count}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await userOrderApi.update({_id: id, id_product: props._id, status: true})
      const orders = await userOrderApi.getAll()
      dispatch(setOrder({data: orders, status: false}))
      setLoading(false)
      Toast('success', '???? x??c nh???n ????n h??ng')
    } catch (error) {
      setLoading(false)
      Toast('error', 'X??c nh???n ????n h??ng th???t b???i')
    }
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item>
          <Card sx={{
            width: 350
          }}>
            <CardContent>
              {products.map((product) => (
                <CartProduct key={product.id} {...product} />
              ))}

              <Typography
                sx={{
                  background: "orange",
                  m: '10px 0',
                  borderRadius: "5px",
                }}
                variant="h5"
                align="center"
                fontWeight={600}
                color="white"
                p={1}
              >
                {currentFormat(amount)}
              </Typography>
              <LoadingButton
                loading={loading}
                variant='contained'
                color='primary'
                fullWidth
                sx={{mb: 1}}
                onClick={handleConfirm}
              >
                X??c nh???n ????n h??ng
              </LoadingButton>
              <Button href={`tel:${user.phone}`} fullWidth variant='contained' color='success'>Li??n h??? v???i ng?????i mua</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardOrder;

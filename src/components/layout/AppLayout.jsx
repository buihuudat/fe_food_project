import { Box } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {  Outlet, useNavigate } from 'react-router-dom'
import productApi from '../../api/productApi'
import { setLoading, setLogin } from '../../redux/reducers/handlerReducer'
import { setProducts } from '../../redux/reducers/productReducer'
import { setUser } from '../../redux/reducers/userReducer'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Navbar from '../common/Navbar'
import Signin from '../pages/Auth/Signin'
import Signup from '../pages/Auth/Signup'

const AppLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const auth = await authUtils.isAuthenticated() 
      const products = await productApi.getAll()
      dispatch(setProducts(products))
      if (!auth) {
        dispatch(setLoading(true))
        navigate('/')
      } else {
        dispatch(setUser(auth))
        dispatch(setLoading(false))
        dispatch(setLogin(true))
      }
    }
    getUser()
  }, [navigate, dispatch])
  
  return (
    <Box sx={{display: 'flex'}}>
      <Navbar />
      <Box sx={{flexGrow: 1}}>
        <Loading />
        <Outlet />
        <Signin />
        <Signup />
      </Box>
    </Box>
  )
}

export default AppLayout
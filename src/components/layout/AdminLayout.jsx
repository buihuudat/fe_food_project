import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import SideBar from '../pages/Admin/Sidebar'
import { setProducts } from '../../redux/reducers/productReducer'
import productApi from "../../api/productApi";
import { useDispatch } from 'react-redux'
import { setAllUser, setUser } from '../../redux/reducers/userReducer'

import userApi from '../../api/userApi'

const AdminLayout = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await authUtils.isAuthenticated()
      if (isAdmin.permission !== 0) {
        alert('Use are not administrator')
        setLoading(false)
        navigate('/')
      } else {
        const products = await productApi.getAll()
        const users = await userApi.getAll()
        dispatch(setAllUser(users))
        dispatch(setProducts(products))
        dispatch(setUser(isAdmin))
        setLoading(true)
      }
    }
    checkAdmin()
  }, [navigate])

  return (
    loading &&
    <Box sx={{display: 'flex'}}>
      <SideBar />
      <Box sx={{flexGrow: 1}}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminLayout
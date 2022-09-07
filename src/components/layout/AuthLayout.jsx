import { Container } from '@mui/material'
import React from 'react'
import Loading from '../common/Loading'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import authUtils from '../../utils/authUtils'

const AuthLayout = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await authUtils.isAuthenticated()
      if (!auth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])
  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Container
        component={'main'}
      >
        <Outlet />
      </Container>
    )
  )
}

export default AuthLayout
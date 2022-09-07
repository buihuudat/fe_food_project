import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Toast from '../../common/Toast'

import authApi from '../../../api/authApi'
import { setSigninModal, setSignupModal } from '../../../redux/reducers/modalReducer';
import { setLoading, setLogin } from '../../../redux/reducers/handlerReducer'
import { setUser } from '../../../redux/reducers/userReducer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  width: 500,
  borderRadius: '5px',
  outline: 'none'
};

export default function Signin() {
  const dispatch = useDispatch()
  const modal = useSelector(state => state.modal.signinModal)

  const [loading, setLoadingState] = useState(false);

  const [phoneErrText, setPhoneErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  
  const handleClose = () => {
    setPhoneErrText('')
    setPasswordErrText('')
    setLoadingState(false)
    dispatch(setSigninModal(false))
  };
  const handleClick = () => {
    dispatch(setSignupModal(true))
    dispatch(setSigninModal(false))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      phone: formData.get('phone'),
      password: formData.get('password'),
    }

    let err = false
    if (data.phone === '') {
      err = true
      setPhoneErrText('Vui lòng nhập số điện thoại')
    } 
    if (data.password === '') {
      err = true
      setPasswordErrText('Vui lòng nhập mật khẩu')
    }
    if (err) return

    dispatch(setLoading(true))
    setLoadingState(true)
    setPhoneErrText('')
    setPasswordErrText('')

    try {
      const {user, token} = await authApi.signin(data)
      dispatch(setSigninModal(false))
      dispatch(setLogin(true))      
      dispatch(setUser(user))
      dispatch(setLoading(false))

      localStorage.setItem('token', token)
      setLoadingState(false)
      Toast('Success', 'Đăng nhập thành công')
    } catch (error) {
      const errors = error.data.errors
      errors.forEach(e => {
        if (e.param === 'phone') {
          setPhoneErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
        setLoadingState(false)
      })
    }
  }
  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 800,
        }}
      >
        <Fade in={modal}>
          <Box sx={style} component='form' onSubmit={handleSubmit}>
              <Typography variant='h5' fontWeight={600}>Đăng nhập để thanh toán</Typography>
              <TextField
                fullWidth
                margin='normal'
                label='Số điện thoại'
                name='phone'
                error={phoneErrText !== ''}
                helperText={phoneErrText}
              />
              <TextField
                fullWidth
                margin='normal'
                label='Mật khẩu'
                name='password'
                type={'password'}
                error={passwordErrText !== ''}
                helperText={passwordErrText}
              />
              <LoadingButton
                loading={loading}
                variant={'outlined'}
                fullWidth
                size='large'
                color='warning'
                sx={{mt:2}}
                type='submit'
              >
                Đăng Nhập
              </LoadingButton>
              <Button 
                sx={{textTransform: 'none', mt:2}}
                fullWidth
                onClick={handleClick}
              >
                Bạn chưa có tài khoản? Đăng ký ngay.
              </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

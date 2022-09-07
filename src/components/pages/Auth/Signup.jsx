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

import authApi from '../../../api/authApi'
import { setSigninModal, setSignupModal } from '../../../redux/reducers/modalReducer';
import Toast from '../../common/Toast';
import { setLoading, setLogin } from '../../../redux/reducers/handlerReducer';
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
  borderRadius: '5px'
};

export default function Signup() {
  const modal = useSelector(state => state.modal.signupModal)
  const dispatch = useDispatch()

  const [loading, setLoadingState] = useState(false);

  const [fullnameErrText, setFullnameErrText] = useState('')
  const [phoneErrText, setPhoneErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')
  
  const handleClose = () => {
    dispatch(setSignupModal(false))
  };
  const handleClick = () => {
    dispatch(setSigninModal(true))
    dispatch(setSignupModal(false))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      fullname: formData.get('fullname').trim(),
      phone: formData.get('phone').trim(),
      password: formData.get('password').trim(),
      confirmPassword: formData.get('confirmPassword').trim(),
    }

    let err = false
    if (data.fullname === '') {
      err = true
      setFullnameErrText('Vui lòng nhập đầy đủ tên của bạn')
    }
    if (data.phone === '') {
      err = true
      setPhoneErrText('Vui lòng nhập số điện thoại')
    } 
    if (data.password === '') {
      err = true
      setPasswordErrText('Vui lòng nhập mật khẩu')
    } 
    if (data.confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Vui lòng nhập để xác minh mật khẩu')
    } 
    if (data.password !== data.confirmPassword) {
      err = true
      setConfirmPasswordErrText('Mật khẩu không khớp')
    }
    if (err) return

    dispatch(setLoading(true))
    setLoadingState(true)
    setFullnameErrText('')
    setPhoneErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')

    try {
      const {user, token} = await authApi.signup(data)
      dispatch(setSignupModal(false))
      dispatch(setLogin(true))
      dispatch(setUser(user)) 
      dispatch(setLoading(false))
      
      setLoadingState(false)
      localStorage.setItem('token', token)
      Toast('success', "Đăng ký thành công")
    } catch (error) {
      const errors = error.data.errors
      errors.forEach(e => {
        if (e.param === 'phone') {
          setPhoneErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg)
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
              <Typography variant='h5' fontWeight={600}>Đăng ký để thanh toán</Typography>
              <TextField
                fullWidth
                margin='normal'
                label='Tên đầy đủ'
                name='fullname'
                error={fullnameErrText !== ''}
                helperText={fullnameErrText}
              />
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
              <TextField
                fullWidth
                margin='normal'
                label='Nhập lại mật khẩu'
                name='confirmPassword'
                type={'password'}
                error={confirmPasswordErrText !== ''}
                helperText={confirmPasswordErrText}
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
                Đăng ký
              </LoadingButton>
              <Button 
                sx={{textTransform: 'none', mt:2}}
                fullWidth
                onClick={handleClick}
              >
                Bạn đã có tài khoản? Đăng nhập ngay.
              </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

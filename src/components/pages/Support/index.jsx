import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationModal, setSupportModal } from '../../../redux/reducers/modalReducer';
import { Chip, Divider, IconButton, TextField } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import userApi from '../../../api/userApi' 
import Toast from '../../common/Toast'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

export default function Support() {
  const [loading, setLoading] = useState(false)
  const [titleErrText, setTitleErrText] = useState('')
  const [contentErrText, setContentErrText] = useState('')
  
  const user = useSelector(state => state.user.value)
  const open = useSelector(state => state.modal.support)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setSupportModal(false))
    setContentErrText('')
    setTitleErrText('')
    setLoading(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      user: user._id,
      title: formData.get('title'),
      content: formData.get('content'),
    }
    let err = false
    if (data.title === '') {
      err = true
      setTitleErrText('Bạn chưa nhập tiêu đề')
    }
    if (data.content === '') {
      err = true
      setContentErrText('Bạn chưa nhập nội dung')
    }
    if (err) return
    setLoading(true)

    setContentErrText('')
    setTitleErrText('')

    try {
      await userApi.feedBack(data)
      Toast('success', 'Cảm ơn bạn đã phản hồi')
      dispatch(setSupportModal(false))
    } catch (error) {
      alert('error...')
      setLoading(false)
    }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant='h4'
            fontWeight={600}
          >Xin Chào {user.fullname},</Typography>
          <Typography
            variant='h4'
            fontWeight={600}
          >Tôi có thể giúp gì cho bạn?</Typography>
          <Box component={'form'} onSubmit={handleSubmit}>
            <TextField
              name='title'
              label='Tiêu đề'
              margin='normal'
              fullWidth
              error={titleErrText !== ''}
              helperText={titleErrText}
            />
            <TextField
              name='content'
              label='Nội dung'
              margin='normal'
              fullWidth
              multiline
              rows={5}
              error={contentErrText !== ''}
              helperText={contentErrText}
            />
            <LoadingButton
              fullWidth
              variant='outlined'
              type='submit'
              loading={loading}
              sx={{
                mt: 1
              }}
            >
              Gửi
            </LoadingButton>
          </Box>

          <Box pt={3}><Divider><Chip label='Hoặc liên hệ trực tiếp qua' /></Divider></Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            justifyContent: 'center',
            mt: 3
          }}>
            <IconButton href='https://facebook.com/1150694301' target={'_blank'}><FacebookIcon color='primary' /></IconButton>
            <IconButton  href='https://twitter.com/dat54261001' target={'_blank'}><TwitterIcon color='primary' /></IconButton>
            <IconButton><TelegramIcon color='primary' /></IconButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setAddVoucherModal } from '../../../../redux/reducers/modalReducer';
import { TextField } from '@mui/material';
import moment from 'moment'
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import voucherApi from '../../../../api/voucherApi';
import Toast from '../../../common/Toast';
import { setVoucher } from '../../../../redux/reducers/voucherReducer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddVoucher() {
  const [loading, setLoading] = useState(false)
  const [voucherErrText, setVoucherErrText] = useState('')
  const [discountErrText, setDiscountErrText] = useState('')
  const [countErrText, setCountErrText] = useState('')
  const [hsdErrText, sethsdErrText] = useState('')

  const voucherData = useSelector(state => state.voucher.data)
  const open = useSelector(state => state.modal.addVoucher)
  const dispatch = useDispatch()

  const checkDate = (e) => {
    if (moment(e).format('L') <= moment().format('L')) {
      sethsdErrText('Hạn sử dụng không hợp lệ')
      return false
    }
    return true
  }

  const handleClose = () => {
    dispatch(setAddVoucherModal(false))
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      voucher: formData.get('voucher'),
      discount: formData.get('discount'),
      count: formData.get('count'),
      HSD: formData.get('HSD'),
    }

    let err = false
    if (data.voucher === '') {
      err = true
      setVoucherErrText('Bạn chưa nhập voucher')
    }
    if (data.discount === '') {
      err = true
      setDiscountErrText('Bạn chưa nhập discount')
    }
    if (data.count === '') {
      err = true
      setCountErrText('Bạn chưa nhập số lượng')
    }
    if (data.HSD === '') {
      err = true
      setVoucherErrText('Bạn chưa nhập hạn sử dụng')
    }
    if (err) return
    if (!checkDate(data.HSD)) return
    setLoading(true)
    setVoucherErrText('')
    setDiscountErrText('')
    setCountErrText('')
    sethsdErrText('')
    
    try {
      const voucher = await voucherApi.create(data)
      setLoading(false)
      Toast('success', `Đã thêm voucher ${voucher.voucher}`)
      dispatch(setVoucher([...voucherData, voucher]))
      dispatch(setAddVoucherModal(false))
    } catch (error) {
      const errors = error.data
      Toast('error', errors)
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
        <Box
          component='form'
          onSubmit={handleSubmit}        
          sx={style}>
          <Typography align='center' variant="h5" fontWeight={600}>
            Thêm voucher
          </Typography>
          <TextField
            label='Voucher'
            name='voucher'
            margin='normal'
            fullWidth
            error={voucherErrText !== ''}
            helperText={voucherErrText}
          />
          <TextField
            label='Discount %'
            name='discount'
            margin='normal'
            type='number'
            fullWidth
            error={discountErrText !== ''}
            helperText={discountErrText}
          />
          <TextField
            label='Số lượng'
            name='count'
            margin='normal'
            type='number'
            fullWidth
            error={countErrText !== ''}
            helperText={countErrText}
          />
          <TextField
            label='Hạn sử dụng'
            name='HSD'
            defaultValue={moment(new Date()).format('YYYY-MM-DD')}
            margin='normal'
            type='date'
            fullWidth
            error={hsdErrText !== ''}
            helperText={hsdErrText}
          />
          <LoadingButton
            sx={{mt: 2}}
            fullWidth
            variant='outlined'
            color='warning'
            loading={loading}
            type='submit'
          >Thêm</LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

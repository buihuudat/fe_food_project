import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import voucherApi from '../../../../api/voucherApi';
import Toast from '../../../common/Toast';
import { setDeleteVoucherModal } from '../../../../redux/reducers/modalReducer';

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

export default function DeleteModal() {
  const [loading, setLoading] = React.useState(false)
  const deleteModal = useSelector(state => state.modal.deleteVoucher)
  const open = deleteModal.type

  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setDeleteVoucherModal({
      data: {},
      type: false
    }))
  };

  const handleDelete = async () => {
    const id = deleteModal.data._id
    setLoading(true)
    try {
      await voucherApi.delete({ _id: id })
      Toast('success', 'Xóa thành công')
      setLoading(false)
      dispatch(setDeleteVoucherModal({
        data: {},
        type: false
      }))
    } catch (error) {
      Toast('error', 'Xóa thành thất bại')
      setLoading(false)
    }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography>Bạn có chắc muốn xóa voucher {deleteModal.data.voucher} ?</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              gap: 2,
              mt: 4
            }}
          >
            <Button 
              fullWidth 
              variant='outlined' 
              color='warning'
              onClick={handleClose}
            >Hủy</Button>
            <LoadingButton
              fullWidth
              variant='outlined'
              color='error'
              loading={loading}
              onClick={handleDelete}
            >
              Xóa
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

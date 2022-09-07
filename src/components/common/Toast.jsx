import { toast } from 'react-toastify';

const Toast = (type, msg) => {
  toast(msg, {
    type: type,
    position: toast.POSITION.TOP_RIGHT
  })
}

export default Toast

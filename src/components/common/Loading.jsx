import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

const Loading = () => {
  const loading = useSelector(state => state.handler.loading)
  return (
    <Box sx={{ width: loading ? '100%' : '0', position: 'fixed' }}>
      <LinearProgress color='warning' />
    </Box>
  )
}

export default Loading
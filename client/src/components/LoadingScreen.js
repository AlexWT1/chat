import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingScreen = () => {
  return (
    <Box
      sx={{ display: 'flex', width: '100%', height: '100vh' }}
      alignItems={'center'}
      justifyContent={'center'}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;

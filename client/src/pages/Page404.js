import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const Page404 = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor:
          theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background.default,
      }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">The page you’re looking for doesn’t exist.</Typography>
    </Box>
  );
};

export default Page404;

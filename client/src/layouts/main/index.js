import { Container, Stack } from '@mui/material';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Logo from '../../assets/Images/logo.svg';
import { useSelector } from 'react-redux';

const MainLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    return <Navigate to="/app" />;
  }

  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack direction={'column'} alignItems={'center'} sx={{ width: '100%' }}>
            <img style={{ height: 120, width: 120 }} src={Logo} alt="Logo" />
          </Stack>
        </Stack>

        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;

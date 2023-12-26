import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack, Typography } from '@mui/material';
import AuthSosiacl from '../../section/auth/AuthSosiacl';
import LoginForm from '../../section/auth/LoginForm';

const Login = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Login to chat</Typography>
        <Stack direction={'row'} spacing={0.5}>
          <Typography variant="body2">New User?</Typography>
          <Link to="/auth/register" component={RouterLink} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
        {/* Login Form */}
        <LoginForm />
        {/* Auth Social */}
        <AuthSosiacl />
      </Stack>
    </>
  );
};

export default Login;

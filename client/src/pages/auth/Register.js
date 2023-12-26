import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack, Typography } from '@mui/material';
import RegisterForm from '../../section/auth/RegisterForm';
import AuthSosiacl from '../../section/auth/AuthSosiacl';

const Register = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Register to chat</Typography>

        <Stack direction={'row'} spacing={0.5}>
          <Typography variant="body2">Already have an account?</Typography>
          <Link component={RouterLink} to={'/auth/login'} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
        {/* Register Form */}
        <RegisterForm />

        <Typography
          component={'div'}
          sx={{
            color: 'text.secondary',
            mt: 3,
            typography: 'caption',
            textAlign: 'center',
          }}>
          {'By signing up, I agree to '}
          <Link underline="always" color="text.primary">
            Terms of service
          </Link>
          {' and '}
          <Link underline="always" color="text.primary">
            Privacy Policy
          </Link>
        </Typography>
        <AuthSosiacl />
      </Stack>
    </>
  );
};

export default Register;

import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { useDispatch } from 'react-redux';
import { NewPassword } from '../../redux/slices/auth.js';
import { useSearchParams } from 'react-router-dom';

const NewPasswordForm = () => {
  const [queryParameters] = useSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at 6 characters')
      .required('Password is required'),
    passwordConfirm: Yup.string()
      .required('Password is required')
      .oneOf([Yup.ref('password'), null], 'Password must be match'),
  });

  const defaultValues = {
    password: '',
    passwordConfirm: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      dispatch(NewPassword({ ...data, token: queryParameters.get('token') }));
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField
          name="password"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="passwordConfirm"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}>
          Submit
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default NewPasswordForm;

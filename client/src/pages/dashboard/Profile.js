import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { CaretLeft } from 'phosphor-react';
import ProfileForm from '../../section/settings/ProfileForm';

const Profile = () => {
  return (
    <>
      <Stack direction={'row'} sx={{ width: '100%' }}>
        <Box
          sx={{
            height: '100vh',
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background.paper,
            boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
          }}>
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack direction={'row'} alignItems={'center'} spacing={3}>
              <IconButton>
                <CaretLeft size={24} color="#4b4b4b" />
              </IconButton>
              <Typography variant="h4">Profile</Typography>
            </Stack>
            {/* Profile Form */}
            <ProfileForm />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default Profile;

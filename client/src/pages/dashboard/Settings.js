import React from 'react';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Bell, CaretLeft, Image, Info, Key, Keyboard, PencilCircle } from 'phosphor-react';
import { faker } from '@faker-js/faker';

const Settings = () => {
  const theme = useTheme();

  const list = [
    {
      key: 0,
      icon: <Bell size={20} />,
      title: 'Notifications',
      onclick: () => {},
    },

    {
      key: 1,
      icon: <Key size={20} />,
      title: 'Security',
      onclick: () => {},
    },
    {
      key: 2,
      icon: <PencilCircle size={20} />,
      title: 'Theme',
      onclick: () => {},
    },
    {
      key: 3,
      icon: <Image size={20} />,
      title: 'Chat Wallpaper',
      onclick: () => {},
    },

    {
      key: 4,
      icon: <Keyboard size={20} />,
      title: 'Keyboard Shortcuts',
      onclick: () => {},
    },
    {
      key: 5,
      icon: <Info size={20} />,
      title: 'Help',
      onclick: () => {},
    },
  ];
  return (
    <>
      <Stack direction={'row'} sx={{ width: '100%' }}>
        {/* Left Panel */}
        <Box
          sx={{
            overflowY: 'auto',
            height: '100vh',
            width: 320,
            backgroundColor: theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background,
            boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
          }}>
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack direction={'row'} alignItems={'center'} spacing={3}>
              <IconButton>
                <CaretLeft suze={24} color={'#4b4b4b'} />
              </IconButton>
              <Typography variant="h6">Settings</Typography>
            </Stack>
            {/* Profile */}
            <Stack direction={'row'} spacing={3}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={faker.image.avatar()}
                alt={faker.name.fullName()}
              />
              <Stack spacing={0.5}>
                <Typography variant="article">{faker.name.fullName()}</Typography>
                <Typography variant="body2">{faker.random.words()}</Typography>
              </Stack>
            </Stack>
            {/* List of option */}
            <Stack spacing={4}>
              {list.map(({ key, icon, title, onclick }) => (
                <>
                  <Stack spacing={2} sx={{ cursor: 'pointer' }} onClick={onclick}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                      {icon}
                      <Typography variant="body2">{title}</Typography>
                    </Stack>
                    {key !== 7 && <Divider />}
                  </Stack>
                </>
              ))}
            </Stack>
          </Stack>
        </Box>
        {/* Right Panel */}
      </Stack>
    </>
  );
};

export default Settings;

import React, { useState } from 'react';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Gear } from 'phosphor-react';
import { faker } from '@faker-js/faker';

import AntSwitch from '../../components/AntSwitch.js';

import Logo from '../../assets/Images/logo.svg';
import useSettings from '../../hooks/useSettings';
import { Nav_Buttons, Profile_Menu } from '../../data';
import { useNavigate } from 'react-router-dom';
import { LogoutUser } from '../../redux/slices/auth.js';
import { useDispatch } from 'react-redux';

const getPath = (index) => {
  switch (index) {
    case 0:
      return '/app';
    case 1:
      return '/group';
    case 2:
      return '/call';
    case 3:
      return '/settings';
    default:
      break;
  }
};

const getMenuPath = (index) => {
  switch (index) {
    case 0:
      return '/profile';
    case 1:
      return '/settings';
    case 2:
      // set IsAuth = false
      return '/auth/login';
    default:
      break;
  }
};

export const SideBar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const { onToggleMode } = useSettings();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      p={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
        height: '100vh',
        width: 100,
      }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: '100%' }}
        spacing={3}>
        <Stack alignItems="center" spacing={4}>
          {/* Logo box */}
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              height: 64,
              width: 64,
              borderRadius: 1.5,
            }}>
            <Stack
              sx={{ height: '100%', width: '100%' }}
              alignItems={'center'}
              justifyContent={'center'}>
              <img src={Logo} alt="Logo app" />
            </Stack>
          </Box>
          {/* List */}
          <Stack sx={{ width: 'max-content' }} direction="column" alignItems="center" spacing={3}>
            {Nav_Buttons.map((el) =>
              el.index === selected ? (
                <Box sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
                  <IconButton sx={{ width: 'max-content', color: '#fff' }} key={el.index}>
                    {el.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => {
                    setSelected(el.index);
                    navigate(getPath(el.index));
                  }}
                  sx={{
                    width: 'max-content',
                    color:
                      theme.palette.mode === 'light'
                        ? '#000'
                        : theme.palette.primary.contrastText.primary,
                  }}
                  key={el.index}>
                  {el.icon}
                </IconButton>
              ),
            )}
            <Divider sx={{ width: '48px' }} />
            {selected === 3 ? (
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1.5,
                }}>
                <IconButton sx={{ width: 'max-content', color: '#fff' }}>
                  <Gear />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                sx={{
                  width: 'max-content',
                  color:
                    theme.palette.mode === 'light'
                      ? '#000'
                      : theme.palette.primary.contrastText.primary,
                }}
                onClick={() => {
                  setSelected(3);
                  navigate(getPath(3));
                }}>
                <Gear />
              </IconButton>
            )}
          </Stack>
        </Stack>
        {/* Switch and Menu */}
        <Stack spacing={4}>
          <AntSwitch
            onChange={() => {
              onToggleMode();
            }}
            defaultChecked
          />
          <Avatar
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            src={faker.image.avatar()}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}>
            <Stack spacing={1} px={1}>
              {Profile_Menu.map((el, idx) => (
                <MenuItem
                  onClick={() => {
                    handleClick();
                  }}>
                  <Stack
                    onClick={() => {
                      if (idx === 2) {
                        dispatch(LogoutUser());
                      } else {
                        navigate(getMenuPath(idx));
                      }
                    }}
                    sx={{ width: 100 }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <span>{el.title}</span>
                    {el.icon}
                  </Stack>
                </MenuItem>
              ))}
            </Stack>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

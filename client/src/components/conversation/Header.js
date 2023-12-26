import React from 'react';
import {
  Box,
  Avatar,
  Divider,
  IconButton,
  Stack,
  Fade,
  Typography,
  MenuItem,
  Menu,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import StyledBadge from '../StyledBadge';
import { ToggleSidedar } from '../../redux/slices/app';
import { useDispatch, useSelector } from 'react-redux';

const Conversation_Menu = [
  {
    title: 'Contact info',
  },
  {
    title: 'Mute notifications',
  },
  {
    title: 'Clear messages',
  },
  {
    title: 'Delete chat',
  },
];

export const Header = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { current_conversation } = useSelector((state) => state.conversation.direct_chat);

  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = React.useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };
  return (
    <Box
      p={2}
      sx={{
        width: '100%',
        backgroundColor:
          theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background.paper,
        boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
      }}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ width: '100%', height: '100%' }}>
        <Stack
          onClick={() => {
            dispatch(ToggleSidedar());
          }}
          direction="row"
          spacing={2}>
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot">
              <Avatar alt={current_conversation?.name} src={current_conversation?.img} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2"> {current_conversation?.name}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton
            id="conversation-positioned-button"
            aria-controls={openConversationMenu ? 'conversation-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openConversationMenu ? 'true' : undefined}
            onClick={handleClickConversationMenu}>
            <CaretDown />
          </IconButton>
          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            TransitionComponent={Fade}
            id="conversation-positioned-menu"
            aria-labelledby="conversation-positioned-button"
            anchorEl={conversationMenuAnchorEl}
            open={openConversationMenu}
            onClose={handleCloseConversationMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
            <Box p={1}>
              <Stack spacing={1}>
                {Conversation_Menu.map((el) => (
                  <MenuItem onClick={handleCloseConversationMenu}>
                    <Stack
                      sx={{ minWidth: 100 }}
                      direction="row"
                      alignItems={'center'}
                      justifyContent="space-between">
                      <span>{el.title}</span>
                    </Stack>{' '}
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

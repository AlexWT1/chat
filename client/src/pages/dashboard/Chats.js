import { Box, IconButton, Stack, Typography, Divider, Button } from '@mui/material';
import { ArchiveBox, CircleDashed, MagnifyingGlass, User } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/search';
import ChatElement from '../../components/ChatElement';

import '../../global.css';
import Friends from '../../section/main/Friends';
import { socket } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { FetchDirectConversations } from '../../redux/slices/conversation';

const user_id = window.localStorage.getItem('user_id');

export const Chats = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false);
  const dispatch = useDispatch();
  const { conversations } = useSelector((state) => state.conversation.direct_chat);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    socket.emit('get_direct_conversations', { user_id }, (data) => {
      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: 320,
          backgroundColor:
            theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background.default,
          boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
        }}>
        <Stack p={3} spacing={2} sx={{ height: '100vh' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Chats</Typography>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}>
                <User />
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709ce6" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            spacing={2}
            direction="column"
            sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
            <div className="scrollbar" style={{ overflowY: 'auto' }}>
              <Stack spacing={2.4}>
                <Stack spacing={2.4}>
                  <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                    All Chats
                  </Typography>
                  {conversations
                    .filter((el) => !el.pinned)
                    .map((el) => {
                      return <ChatElement {...el} />;
                    })}
                </Stack>
              </Stack>
            </div>
          </Stack>
        </Stack>
      </Box>
      {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

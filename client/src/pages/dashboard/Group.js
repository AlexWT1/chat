import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Link, IconButton, Divider } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/search';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import { ChatList } from '../../data';
import ChatElement from '../../components/ChatElement';
import CreateGroup from '../../section/main/CreateGroup';

import '../../global.css';

const Group = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Stack direction={'row'} sx={{ width: '100%' }}>
        {/* Left */}
        <Box
          sx={{
            height: '100vh',
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background.default,
            boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
          }}>
          <Stack p={3} spacing={2} sx={{ height: '100vh' }}>
            <Stack>
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: '100%' }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709ce6" />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
              </Search>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="subtitle2" component={Link}>
                Create New Group
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack direction={'column'} sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
              <div className="scrollbar" style={{ overflowY: 'auto' }}>
                <Stack spacing={2.5}>
                  <Typography variant="subtitle2" sx={{ color: '#676667' }}>
                    Pinned
                  </Typography>
                  {ChatList.filter((el) => el.pinned).map((el) => {
                    return <ChatElement {...el} />;
                  })}
                  <Typography variant="subtitle2" sx={{ color: '#676667' }}>
                    All Groups
                  </Typography>
                  {ChatList.filter((el) => !el.pinned).map((el) => {
                    return <ChatElement {...el} />;
                  })}
                </Stack>
              </div>
            </Stack>
          </Stack>
        </Box>
        {/* Right */}
      </Stack>
      {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default Group;

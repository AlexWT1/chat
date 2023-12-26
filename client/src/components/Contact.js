import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from 'phosphor-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ToggleSidedar, updateSideBarType } from '../redux/slices/app';
import { faker } from '@faker-js/faker';
import AntSwitch from './AntSwitch';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>Block this contact</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this Contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this chat?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openBlock, setOpenBlock] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  return (
    <Box sx={{ width: 320, height: '100vh' }}>
      <Stack sx={{ height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
            width: '100%',
            backgroundColor: theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background,
          }}>
          <Stack
            sx={{ height: '100%', p: 2 }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            spacing={3}>
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSidedar());
              }}>
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/* Body */}
        <Stack
          direction={'column'}
          sx={{ height: '100%', position: 'relative', flexGrow: 1, overflowY: 'auto' }}
          p={3}
          spacing={3}>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Avatar
              src={faker.image.avatar()}
              alt={faker.name.firstName()}
              sx={{ height: 64, width: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {faker.name.fullName()}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {'+91 712 1231 1231'}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'}>
            <Stack spacing={1} alignItems={'center'}>
              <IconButton>
                <Phone />
              </IconButton>
              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack spacing={1} alignItems={'center'}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={0.5}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2">Imagination is the only</Typography>
          </Stack>
          <Divider />
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="subtitle2">Media, Links & Docs</Typography>
            <Button
              onClick={() => {
                dispatch(updateSideBarType('SHARED'));
              }}
              endIcon={<CaretRight />}>
              401
            </Button>
          </Stack>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            {[1, 2, 3].map((el) => (
              <Box>
                <img src={faker.image.food()} alt={faker.name.fullName()} />
              </Box>
            ))}
          </Stack>
          <Divider />
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>
            <IconButton
              onClick={() => {
                dispatch(updateSideBarType('STARRED'));
              }}>
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />
          <Typography>1 group in common</Typography>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">IS21</Typography>
              <Typography variant="caption">Mike, Efim, You</Typography>
            </Stack>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              startIcon={<Prohibit />}
              fullWidth
              variant="outlined">
              Block
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);
              }}
              startIcon={<Trash />}
              fullWidth
              variant="outlined">
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && <BlockDialog open={openBlock} handleClose={handleCloseBlock} />}
      {openDelete && <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />}
    </Box>
  );
};

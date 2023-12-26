import { faker } from '@faker-js/faker';
import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';
import StyledBadge from './StyledBadge';
import { useDispatch, useSelector } from 'react-redux';
import { SelectConversation } from '../redux/slices/app';
import styled from '@emotion/styled';
import { truncateText } from '../utils/formatMessage';

const StyledChatBox = styled(Box)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
  },
}));

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();

  let isSelected = +selectedChatId === id;

  if (!selectedChatId) {
    isSelected = false;
  }

  return (
    <StyledChatBox
      onClick={() => {
        dispatch(SelectConversation({ room_id: id }));
      }}
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor: isSelected
          ? theme.palette.mode === 'light'
            ? alpha(theme.palette.primary.main, 0.5)
            : theme.palette.primary.main
          : theme.palette.mode === 'light'
          ? '#fff'
          : theme.palette.background.paper,
      }}
      p={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot">
              <Avatar src={img} alt={name} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{truncateText(msg, 20)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge className="unread-count" color="primary" badgeContent={unread}></Badge>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;

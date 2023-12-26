import { Box, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import {
  DocumentMessage,
  LinkMessage,
  MediaMessage,
  ReplayMessage,
  TextMessage,
  TimeLine,
} from './MessageTypes';
import { useDispatch, useSelector } from 'react-redux';

import { socket } from '../../socket';
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/slices/conversation';
const Message = ({ menu }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat,
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit('get_messages', { conversation_id: current?.id }, (data) => {
      // data => list of messages
      dispatch(FetchCurrentMessages({ messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, [room_id]);
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {current_messages.map((el, idx) => {
          switch (el.type) {
            case 'divider':
              return <TimeLine el={el} />;
            case 'msg':
              switch (el.subtype) {
                case 'img':
                  return <MediaMessage el={el} menu={menu} />;
                case 'doc':
                  return <DocumentMessage el={el} menu={menu} />;
                case 'link':
                  return <LinkMessage el={el} menu={menu} />;
                case 'reply':
                  return <ReplayMessage el={el} menu={menu} />;
                default:
                  return <TextMessage el={el} menu={menu} />;
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;

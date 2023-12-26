import { Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { connectSocket, socket } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { SelectConversation, showSnackbar } from '../../redux/slices/app';
import {
  AddDirectConversation,
  AddDirectMessage,
  UpdateDirectConversation,
} from '../../redux/slices/conversation';

const DashboardLayout = () => {
  const user_id = window.localStorage.getItem('user_id');

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat,
  );

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + '#loaded';
          window.location.reload();
        }
      };
      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on('new_friend_request', (data) => {
        console.log('Новый запрос');
        dispatch(
          showSnackbar({
            severity: 'success',
            message: data.message,
          }),
        );
      });

      socket.on('request_accepted', (data) => {
        dispatch(
          showSnackbar({
            severity: 'success',
            message: data.message,
          }),
        );
      });
      socket.on('request_sent', (data) => {
        dispatch(showSnackbar({ severity: 'success', message: data.message }));
      });
      socket.on('request_sent_error', (data) => {
        dispatch(showSnackbar({ severity: 'error', message: data.message }));
      });
      socket.on('start_chat', (data) => {
        const existing_conversation = conversations.find((el) => el?.id === data._id);
        if (existing_conversation) {
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });

      socket.on('new_message', (data) => {
        const message = data.message;
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: 'msg',
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            }),
          );
        }
      });
    }
    // Remove event listener on component unmount
    return () => {
      socket?.off('new_friend_request');
      socket?.off('request_accepted');
      socket?.off('request_sent');
      socket?.off('start_chat');
      socket?.off('new_message');
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack direction="row">
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;

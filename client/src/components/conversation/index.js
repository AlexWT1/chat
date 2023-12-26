import { Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { Header } from './Header';
import { Footer } from './Footer';
import Message from './Message';
import '../../global.css';
import { useSelector } from 'react-redux';

export const Conversation = () => {
  const messageListRef = useRef(null);
  const { current_messages } = useSelector((state) => state.conversation.direct_chat);
  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack height={'100%'} maxHeight={'100vh'} width={'auto'}>
      {/* Chat Header */}
      <Header />
      {/* Message */}
      <Stack spacing={2} direction="column" sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
        <div ref={messageListRef} className="scrollbar" style={{ overflowY: 'auto' }}>
          <Message menu={true} />
        </div>
      </Stack>

      {/* Chat footer */}
      <Footer />
    </Stack>
  );
};

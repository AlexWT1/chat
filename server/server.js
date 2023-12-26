const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const { Server } = require('socket.io');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT Exception ! Shutting down ...');
  process.exit(1);
});

const http = require('http');
const User = require('./models/user');
const FriendRequest = require('./models/friendRequest');
const OneToOneMessage = require('./models/OneToOneMessage');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
4;
const DB = process.env.DBURI.replace('<PASSWORD>', process.env.DBPASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//Connecting socket io

io.on('connection', async (socket) => {
  console.log(JSON.stringify(socket.handshake.query));
  const user_id = socket.handshake.query['user_id'];

  console.log(`User connected ${socket.id}`);

  if (user_id != null && Boolean(user_id)) {
    try {
      await User.findByIdAndUpdate(user_id, {
        socket_id: socket.id,
        status: 'Online',
      });
    } catch (e) {
      console.log(e);
    }
  }

  // friend request
  socket.on('friend_request', async (data) => {
    const to_user = await User.findById(data.to).select('socket_id');
    const from_user = await User.findById(data.from).select('socket_id');

    const exiting_request = await FriendRequest.findOne({
      sender: data.from,
      recipient: data.to,
    });

    if (!exiting_request) {
      await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });
      io.to(to_user?.socket_id).emit('new_friend_request', {
        message: 'New friend request received',
      });
      io.to(from_user?.socket_id).emit('request_sent', {
        message: 'Request sent successfully!',
      });
    } else {
      io.to(from_user?.socket_id).emit('request_sent_error', {
        message: 'The request has already been sent!',
      });
    }
  });

  //accept request
  socket.on('accept_request', async (data) => {
    console.log(data);
    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender?.socket_id).emit('request_accepted', {
      message: 'Friend request accepted',
    });
    io.to(receiver?.socket_id).emit('request_accepted', {
      message: 'Friend request accepted',
    });
  });

  // get direct conversations
  socket.on('get_direct_conversations', async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate('participants', 'firstName lastName avatar _id email status');

    console.log(existing_conversations);

    callback(existing_conversations);
  });

  // start conversation
  socket.on('start_conversation', async (data) => {
    const { to, from } = data;

    const existing_conversations = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] },
    }).populate('participants', 'firstName lastName _id email status');

    if (existing_conversations.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });

      new_chat = await OneToOneMessage.findById(new_chat).populate(
        'participants',
        'firstName lastName _id email status',
      );

      socket.emit('start_chat', new_chat);
    } else {
      socket.emit('start_chat', existing_conversations[0]);
    }
  });

  // get messages

  socket.on('get_messages', async (data, callback) => {
    try {
      const { messages } = await OneToOneMessage.findById(data.conversation_id).select('messages');
      callback(messages);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('text_message', async (data) => {
    const { message, conversation_id, from, to, type } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to,
      from,
      type: type,
      created_at: Date.now(),
      text: message,
    };

    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);

    await chat.save({ new: true, validateModifiedOnly: true });

    io.to(to_user?.socket_id).emit('new_message', {
      conversation_id,
      message: new_message,
    });

    io.to(from_user?.socket_id).emit('new_message', {
      conversation_id,
      message: new_message,
    });
  });

  socket.on('end', async (data) => {
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: 'Offline' });
    }

    console.log('closing connection');
    socket.disconnect(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

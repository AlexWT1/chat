import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { resetAll } from './auth';

const initialState = {
  sidebar: {
    open: false,
    type: 'CONTACT', // can be CONTACT, START, SHARED
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
  users: [],
  user: {},
  friends: [],
  friendRequests: [],
  chat_type: null,
  room_id: null,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Toggle SideBar
    toggleSideBar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSideBarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    // Snackbar
    openSnackBar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    selectConversation(state, action) {
      state.chat_type = 'individual';
      state.room_id = action.payload.room_id;
    },
  },
  extraReducers: (builder) => builder.addCase(resetAll, () => initialState),
});

export default slice.reducer;

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar =
  ({ severity, message }) =>
  async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackBar({
        message,
        severity,
      }),
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };

export function ToggleSidedar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSideBar());
  };
}

export function updateSideBarType(type) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateSideBarType({
        type,
      }),
    );
  };
}

export function FetchUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        '/user/get-users',

        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchFriends() {
  return async (dispatch, getState) => {
    await axios
      .get(
        '/user/get-friends',

        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        '/user/get-friend-requests',

        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriendRequests({ requests: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export const SelectConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({ room_id }));
  };
};

export const FetchUserProfile = () => {
  return async (dispatch, getState) => {
    axios
      .get('/user/get-me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.fetchUser({ user: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

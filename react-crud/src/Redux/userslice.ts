import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {    
    fetchUsers(state) {
      state.loading = true;
      state.error = null;
    },
    createUser(state, action: PayloadAction<{ name: string; email: string; role: string }>) {
      state.loading = true;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<{ id: string; name: string; email: string; role: string }>) {
      state.loading = true;
      state.error = null;
    },
    deleteUser(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.error = null;
    },
    
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
      state.loading = false;
    },
    createUserSuccess(state, action: PayloadAction<User>) {
      state.list.push(action.payload);
      state.loading = false;
    },
    updateUserSuccess(state, action: PayloadAction<User>) {
      const idx = state.list.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
      state.loading = false;
    },
    deleteUserSuccess(state, action: PayloadAction<{ id: string }>) {
      state.list = state.list.filter(u => u.id !== action.payload.id);
      state.loading = false;
    },
    usersFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchUsers, createUser, updateUser, deleteUser,
  fetchUsersSuccess, createUserSuccess,
  updateUserSuccess, deleteUserSuccess,
  usersFailed
} = usersSlice.actions;

export default usersSlice.reducer;

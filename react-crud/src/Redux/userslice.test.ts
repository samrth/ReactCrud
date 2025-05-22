import usersReducer, {
  fetchUsers,
  fetchUsersSuccess,
  createUser,
  createUserSuccess,
  updateUser,
  updateUserSuccess,
  deleteUser,
  deleteUserSuccess,
  usersFailed,
  User
} from './userslice';

describe('usersSlice reducer', () => {
  const initialState = { list: [], loading: false, error: null };

  it('should handle fetchUsers', () => {
    const state = usersReducer(initialState, fetchUsers());
    expect(state).toEqual({ list: [], loading: true, error: null });
  });

  it('should handle fetchUsersSuccess', () => {
    const users: User[] = [{ id: '1', name: 'Alice', email: 'a@x.com', role: 'admin' }];
    const state = usersReducer({ ...initialState, loading: true }, fetchUsersSuccess(users));
    expect(state).toEqual({ list: users, loading: false, error: null });
  });

  it('should handle createUser', () => {
    const action = createUser({ name: 'Bob', email: 'b@x.com', role: 'user' });
    const state = usersReducer(initialState, action);
    expect(state).toEqual({ list: [], loading: true, error: null });
  });

  it('should handle createUserSuccess', () => {
    const user: User = { id: '2', name: 'Bob', email: 'b@x.com', role: 'user' };
    const state = usersReducer({ ...initialState, loading: true }, createUserSuccess(user));
    expect(state).toEqual({ list: [user], loading: false, error: null });
  });

  it('should handle updateUser', () => {
    const action = updateUser({ id: '1', name: 'Alice Updated', email: 'a@x.com', role: 'admin' });
    const state = usersReducer(initialState, action);
    expect(state).toEqual({ list: [], loading: true, error: null });
  });

  it('should handle updateUserSuccess', () => {
    const existing: User = { id: '1', name: 'Alice', email: 'a@x.com', role: 'admin' };
    const updated: User = { id: '1', name: 'Alice Updated', email: 'a@x.com', role: 'admin' };
    const state = usersReducer({ ...initialState, list: [existing], loading: true }, updateUserSuccess(updated));
    expect(state).toEqual({ list: [updated], loading: false, error: null });
  });

  it('should handle deleteUser', () => {
    const action = deleteUser({ id: '1' });
    const state = usersReducer(initialState, action);
    expect(state).toEqual({ list: [], loading: true, error: null });
  });

  it('should handle deleteUserSuccess', () => {
    const existing: User = { id: '1', name: 'Alice', email: 'a@x.com', role: 'admin' };
    const state = usersReducer({ ...initialState, list: [existing], loading: true }, deleteUserSuccess({ id: '1' }));
    expect(state).toEqual({ list: [], loading: false, error: null });
  });

  it('should handle usersFailed', () => {
    const state = usersReducer({ ...initialState, loading: true }, usersFailed('err'));
    expect(state).toEqual({ list: [], loading: false, error: 'err' });
  });
});

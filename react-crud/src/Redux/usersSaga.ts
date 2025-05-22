import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../graphql/user";
import { client } from "../apolloClient";
import {
  fetchUsers,
  fetchUsersSuccess,
  createUser,
  createUserSuccess,
  updateUser,
  updateUserSuccess,
  deleteUser,
  deleteUserSuccess,
  usersFailed,
} from "../Redux/userslice";
import { SagaIterator } from "redux-saga";


export function* handleFetchUsers(): SagaIterator {
  console.log("Saga: handleFetchUsers triggered");
  try {
    const result: any = yield call(() => client.query({ query: GET_USERS }));
    console.log("Saga: fetched users", result.data.users);
    yield put(fetchUsersSuccess(result.data.users));
  } catch (err: any) {
    console.error("Saga: fetch failed", err.message);

    yield put(usersFailed(err.message));
  }
} 

export function* handleCreateUser(
  action: ReturnType<typeof createUser>
): SagaIterator {
  try {
    const { name, email, role } = action.payload;
    const result: any = yield call(() =>
      client.mutate({ mutation: CREATE_USER, variables: { name, email, role } })
    );
    yield put(createUserSuccess(result.data.addUser));
  } catch (err: any) {
    yield put(usersFailed(err.message));
  }
}

export function* handleUpdateUser(
  action: ReturnType<typeof updateUser>
): SagaIterator {
  try {
    const { id, name, email, role } = action.payload;
    const result: any = yield call(() =>
      client.mutate({
        mutation: UPDATE_USER,
        variables: { id, name, email, role },
      })
    );
    yield put(updateUserSuccess(result.data.updateUser));
  } catch (err: any) {
    yield put(usersFailed(err.message));
  }
}

export function* handleDeleteUser(
  action: ReturnType<typeof deleteUser>
): SagaIterator {
  try {
    const { id } = action.payload;
    yield call(() =>
      client.mutate({ mutation: DELETE_USER, variables: { id } })
    );
    yield put(deleteUserSuccess({ id }));
  } catch (err: any) {
    yield put(usersFailed(err.message));
  }
}

export function* watchUsers() {
  yield takeLatest(fetchUsers.type, handleFetchUsers);
  yield takeLatest(createUser.type, handleCreateUser);
  yield takeLatest(updateUser.type, handleUpdateUser);
  yield takeLatest(deleteUser.type, handleDeleteUser);
}

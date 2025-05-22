// src/redux/users/usersSaga.test.ts
import { runSaga } from "redux-saga";
import * as apolloClient from "../apolloClient";
import {
  handleFetchUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "./usersSaga";
import {
  fetchUsersSuccess,
  createUser,
  createUserSuccess,
  updateUser,
  updateUserSuccess,
  deleteUser,
  deleteUserSuccess,
  usersFailed,
  User,
} from "./userslice";

describe("usersSaga handlers", () => {
  let dispatched: any[];
  const fakeUsers: User[] = [
    { id: "1", name: "A", email: "a@x.com", role: "r" },
  ];
  const fakeNewUser: User = {
    id: "2",
    name: "B",
    email: "b@x.com",
    role: "r2",
  };

  beforeEach(() => {
    dispatched = [];
  });

  it("handleFetchUsers success", async () => {
    jest
      .spyOn(apolloClient.client, "query")
      .mockResolvedValue({ data: { users: fakeUsers } } as any);

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleFetchUsers
    ).toPromise();

    expect(dispatched).toContainEqual(fetchUsersSuccess(fakeUsers));
  });

  it("handleFetchUsers failure", async () => {
    jest
      .spyOn(apolloClient.client, "query")
      .mockRejectedValue(new Error("fetch err"));

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleFetchUsers
    ).toPromise();

    expect(dispatched).toContainEqual(usersFailed("fetch err"));
  });

  it("handleCreateUser success", async () => {
    jest
      .spyOn(apolloClient.client, "mutate")
      .mockResolvedValue({ data: { addUser: fakeNewUser } });

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleCreateUser,
      createUser({ name: "B", email: "b@x.com", role: "r2" })
    ).toPromise();

    expect(dispatched).toContainEqual(createUserSuccess(fakeNewUser));
  });

  it("handleCreateUser failure", async () => {
    jest
      .spyOn(apolloClient.client, "mutate")
      .mockRejectedValue(new Error("create err"));

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleCreateUser,
      createUser({ name: "B", email: "b@x.com", role: "r2" })
    ).toPromise();

    expect(dispatched).toContainEqual(usersFailed("create err"));
  });

  it("handleUpdateUser success", async () => {
    const updated: User = { id: "1", name: "A+", email: "a@x.com", role: "r" };

    jest
      .spyOn(apolloClient.client, "mutate")
      .mockResolvedValue({ data: { updateUser: updated } });

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleUpdateUser,
      updateUser({ id: "1", name: "A+", email: "a@x.com", role: "r" })
    ).toPromise();

    expect(dispatched).toContainEqual(updateUserSuccess(updated));
  });

  it("handleUpdateUser failure", async () => {
    jest
      .spyOn(apolloClient.client, "mutate")
      .mockRejectedValue(new Error("update err"));

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleUpdateUser,
      updateUser({ id: "1", name: "A+", email: "a@x.com", role: "r" })
    ).toPromise();

    expect(dispatched).toContainEqual(usersFailed("update err"));
  });

  it("handleDeleteUser success", async () => {
    jest.spyOn(apolloClient.client, "mutate").mockResolvedValue({});

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleDeleteUser,
      deleteUser({ id: "1" })
    ).toPromise();

    expect(dispatched).toContainEqual(deleteUserSuccess({ id: "1" }));
  });

  it("handleDeleteUser failure", async () => {
    jest
      .spyOn(apolloClient.client, "mutate")
      .mockRejectedValue(new Error("delete err"));

    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleDeleteUser,
      deleteUser({ id: "1" })
    ).toPromise();

    expect(dispatched).toContainEqual(usersFailed("delete err"));
  });
});

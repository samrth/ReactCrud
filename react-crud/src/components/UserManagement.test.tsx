import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import { render, fireEvent, screen, within } from "@testing-library/react";
import UserManagement from "./UserManagement";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  User,
} from "../Redux/userslice";

const mockStore = configureMockStore();


function makeUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `User ${i + 1}`,
    email: `user${i + 1}@test.com`,
    role: "tester",
  }));
}



describe("UserManagement component", () => {
  let store: any;

  beforeEach(() => {
    const users = makeUsers(12);   
    store = mockStore({ users: { list: users, loading: false, error: null } });
    store.dispatch = jest.fn();
  });

  it("dispatches fetchUsers on mount", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchUsers());
  });


  it("renders the correct number of page buttons", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );    
    const buttons = screen.getAllByRole("button", { name: /^[1-3]$/ });
    expect(buttons).toHaveLength(3);
  });


  it("updates the current page when a page button is clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "3" }));

    
    const page3Li = screen.getByRole("button", { name: "3" }).closest("li")!;
    expect(page3Li).toHaveClass("active");

    
    const userList = screen.getByTestId("user-list");
    const userItems = within(userList).getAllByRole("listitem");

    expect(userItems).toHaveLength(2);
    expect(userItems[0]).toHaveTextContent("User 11");
    expect(userItems[1]).toHaveTextContent("User 12");
  });

  it("can add a new user via form", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "b@x.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Role"), {
      target: { value: "user" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: createUser.type,
        payload: { name: "Bob", email: "b@x.com", role: "user" },
      })
    );
  });

  it("opens confirmation modal when Delete button clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
    
    fireEvent.click(screen.getByRole("button", { name: "Delete user 1" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", {
      name: "Confirm delete",
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("cancels deletion when Cancel clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
        
    fireEvent.click(screen.getByRole("button", { name: "Delete user 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));    
    expect(screen.queryByRole("dialog")).toBeNull();    
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: deleteUser.type })
    );
  });

  it("dispatches deleteUser and closes modal on confirm", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete user 1" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Confirm delete" })
    );  
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: deleteUser.type, payload: { id: "1" } })
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the modal when the X button is clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    
    fireEvent.click(screen.getByRole("button", { name: "Delete user 1" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();    
    const closeBtn = screen.getByRole("button", { name: "" });   
    fireEvent.click(closeBtn);

   
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("enters edit mode when Edit is clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    const listItems = screen.getAllByRole("listitem");    
    const secondUserItem = listItems[1];    
    const editBtn = within(secondUserItem).getByRole("button", {
      name: "Edit",
    });
    fireEvent.click(editBtn);

    
    expect(screen.getByPlaceholderText("Name")).toHaveValue("User 2");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("user2@test.com");
    expect(screen.getByPlaceholderText("Role")).toHaveValue("tester");

  
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("dispatches createUser when Create is clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@x.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Role"), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: createUser.type,
        payload: { name: "Alice", email: "a@x.com", role: "admin" },
      })
    );
 
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Role")).toHaveValue("");
  });

  it("dispatches updateUser when Update is clicked", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

   
    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[1]);    
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "User Two Updated" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: updateUser.type,
        payload: {
          id: "2",
          name: "User Two Updated",
          email: "user2@test.com",
          role: "tester",
        },
      })
    );
   
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
  });
});

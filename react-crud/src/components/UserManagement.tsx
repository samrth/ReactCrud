import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Redux/Store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../Redux/userslice";

const USERS_PER_PAGE = 5;

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: users, loading, error } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = () => {
    if (editId) {
      dispatch(updateUser({ id: editId, ...form }));
      setEditId(null);
    } else {
      dispatch(createUser(form));
    }
    setForm({ name: "", email: "", role: "" });
  };

  const handleDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser({ id: userToDelete }));
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Management</h2>  
         
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editId ? "Edit User" : "Add New User"}</h5>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSubmit}>
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
        <ul  data-testid="user-list" className="list-group mb-3">
          {paginatedUsers.map((u) => (
            <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{u.name}</strong> — {u.email} — <em>{u.role}</em>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setEditId(u.id);
                    setForm({ name: u.name, email: u.email, role: u.role });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  aria-label={`Delete user ${u.id}`}
                  onClick={() => {
                    setUserToDelete(u.id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

     
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(users.length / USERS_PER_PAGE) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

   
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-danger" aria-label="Confirm delete" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

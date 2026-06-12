import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import UserCard from "../components/UserCard";

const USER_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:8001";

const ROLES = ["INTERN", "DEVELOPER", "MANAGER", "LEAD"];

const EMPTY_FORM = { username: "", email: "", full_name: "", role: "DEVELOPER" };

export default function Users() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});

  const fetchUsers = useCallback(() => {
    return axios.get(`${USER_URL}/users`).then((r) => setUsers(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setErrors({}); setModal("create"); };
  const openEdit   = (u)  => { setForm({ ...u });        setErrors({}); setModal("edit"); };
  const closeModal = ()   => setModal(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.username.trim())  e.username  = "Username is required";
    if (!form.email.trim())     e.email     = "Email is required";
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      if (modal === "edit") {
        await axios.put(`${USER_URL}/users/${form.id}`, form);
        toast.success("User updated");
      } else {
        await axios.post(`${USER_URL}/users`, form);
        toast.success("User created");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || "Operation failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${USER_URL}/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between" style={{ borderBottom: "3px solid #FFE600", paddingBottom: "12px" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "#595959" }}>{users.length} team members</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold"
          style={{ background: "#FFE600", color: "#1A1A1A" }}
        >
          <Plus size={16} />
          New User
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #D3D3D3" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#1A1A1A" }}>
              {["Name / Username", "Email", "Role", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: "#595959" }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: "#D3D3D3" }}>
                  No users found
                </td>
              </tr>
            )}
            {users.map((user) => (
              <UserCard key={user.id} user={user} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-lg" style={{ background: "#fff", border: "2px solid #1A1A1A" }}>
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: "#1A1A1A" }}
            >
              <h2 className="font-bold text-base" style={{ color: "#FFE600" }}>
                {modal === "edit" ? "Edit User" : "New User"}
              </h2>
              <button onClick={closeModal}>
                <X size={20} style={{ color: "#FFE600" }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                  Full Name *
                </label>
                <input
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{ border: errors.full_name ? "1px solid #B71C1C" : "1px solid #D3D3D3", color: "#1A1A1A" }}
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Jean Dupont"
                />
                {errors.full_name && <p className="text-xs mt-1" style={{ color: "#B71C1C" }}>{errors.full_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                    Username *
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ border: errors.username ? "1px solid #B71C1C" : "1px solid #D3D3D3", color: "#1A1A1A" }}
                    value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                    placeholder="jdupont"
                  />
                  {errors.username && <p className="text-xs mt-1" style={{ color: "#B71C1C" }}>{errors.username}</p>}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ border: "1px solid #D3D3D3", color: "#1A1A1A", background: "#fff" }}
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{ border: errors.email ? "1px solid #B71C1C" : "1px solid #D3D3D3", color: "#1A1A1A" }}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jean.dupont@company.com"
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: "#B71C1C" }}>{errors.email}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-sm font-medium"
                  style={{ border: "1px solid #D3D3D3", color: "#595959" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold"
                  style={{ background: "#FFE600", color: "#1A1A1A" }}
                >
                  {modal === "edit" ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

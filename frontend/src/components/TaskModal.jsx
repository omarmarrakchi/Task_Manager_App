import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const STATUSES   = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const EMPTY = {
  title: "", description: "", status: "TODO",
  priority: "MEDIUM", assigned_to: "",
};

export default function TaskModal({ task, users, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(task ? { ...task } : { ...EMPTY });
    setErrors({});
  }, [task]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg"
        style={{ background: "#fff", border: "2px solid #1A1A1A" }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "#1A1A1A" }}
        >
          <h2 className="font-bold text-base" style={{ color: "#FFE600" }}>
            {task?.id ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose}>
            <X size={20} style={{ color: "#FFE600" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
              Title *
            </label>
            <input
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                border: errors.title ? "1px solid #B71C1C" : "1px solid #D3D3D3",
                color: "#1A1A1A",
              }}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Task title"
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: "#B71C1C" }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm outline-none resize-none"
              style={{ border: "1px solid #D3D3D3", color: "#1A1A1A" }}
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                Status
              </label>
              <select
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #D3D3D3", color: "#1A1A1A", background: "#fff" }}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
                Priority
              </label>
              <select
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #D3D3D3", color: "#1A1A1A", background: "#fff" }}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned to */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#1A1A1A" }}>
              Assigned To
            </label>
            {users && users.length > 0 ? (
              <select
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #D3D3D3", color: "#1A1A1A", background: "#fff" }}
                value={form.assigned_to || ""}
                onChange={(e) => set("assigned_to", e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.full_name}>{u.full_name} ({u.role})</option>
                ))}
              </select>
            ) : (
              <input
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #D3D3D3", color: "#1A1A1A" }}
                value={form.assigned_to || ""}
                onChange={(e) => set("assigned_to", e.target.value)}
                placeholder="Assignee name"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
              {task?.id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

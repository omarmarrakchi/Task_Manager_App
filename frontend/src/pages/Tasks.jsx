import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, LayoutGrid, List, Filter } from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import TaskModal from "../components/TaskModal";

const TASK_URL = window._env_?.TASK_SERVICE_URL || import.meta.env.VITE_TASK_SERVICE_URL || "/task-api";
const USER_URL = window._env_?.USER_SERVICE_URL || import.meta.env.VITE_USER_SERVICE_URL || "/user-api";

const PRIORITIES = ["", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES   = ["", "TODO", "IN_PROGRESS", "DONE"];

export default function Tasks() {
  const [tasks,    setTasks]    = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);     // null | {} | task
  const [view,     setView]     = useState("kanban"); // "kanban" | "list"
  const [filters,  setFilters]  = useState({ search: "", priority: "", status: "", assigned_to: "" });

  const fetchTasks = useCallback(() => {
    const params = {};
    if (filters.status)      params.status      = filters.status;
    if (filters.priority)    params.priority    = filters.priority;
    if (filters.assigned_to) params.assigned_to = filters.assigned_to;
    if (filters.search)      params.search      = filters.search;
    return axios.get(`${TASK_URL}/tasks`, { params })
      .then((r) => setTasks(r.data));
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), axios.get(`${USER_URL}/users`).then((r) => setUsers(r.data))])
      .finally(() => setLoading(false));
  }, [fetchTasks]);

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await axios.put(`${TASK_URL}/tasks/${form.id}`, form);
        toast.success("Task updated");
      } else {
        await axios.post(`${TASK_URL}/tasks`, form);
        toast.success("Task created");
      }
      setModal(null);
      fetchTasks();
    } catch {
      toast.error("Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${TASK_URL}/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => t.id === draggableId ? { ...t, status: destination.droppableId } : t)
    );
    try {
      await axios.put(`${TASK_URL}/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success(`Moved to ${destination.droppableId.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update status");
      fetchTasks(); // revert
    }
  };

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between" style={{ borderBottom: "3px solid #FFE600", paddingBottom: "12px" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Tasks</h1>
          <p className="text-sm mt-1" style={{ color: "#595959" }}>{tasks.length} tasks found</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold"
          style={{ background: "#FFE600", color: "#1A1A1A" }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 p-4"
        style={{ background: "#fff", border: "1px solid #D3D3D3" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={15} style={{ color: "#595959" }} />
          <input
            className="flex-1 text-sm outline-none"
            style={{ color: "#1A1A1A" }}
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>
        <select
          className="text-sm px-3 py-1.5 outline-none"
          style={{ border: "1px solid #D3D3D3", color: "#595959", background: "#fff" }}
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.slice(1).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select
          className="text-sm px-3 py-1.5 outline-none"
          style={{ border: "1px solid #D3D3D3", color: "#595959", background: "#fff" }}
          value={filters.priority}
          onChange={(e) => setFilter("priority", e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.slice(1).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {/* View toggle */}
        <div className="flex ml-auto" style={{ border: "1px solid #D3D3D3" }}>
          <button
            onClick={() => setView("kanban")}
            className="px-3 py-1.5"
            style={{ background: view === "kanban" ? "#1A1A1A" : "#fff", color: view === "kanban" ? "#FFE600" : "#595959" }}
            title="Kanban view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className="px-3 py-1.5"
            style={{ background: view === "list" ? "#1A1A1A" : "#fff", color: view === "list" ? "#FFE600" : "#595959" }}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-sm" style={{ color: "#595959" }}>Loading tasks…</div>
        </div>
      ) : view === "kanban" ? (
        <KanbanBoard
          tasks={tasks}
          onEdit={(task) => setModal(task)}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <div style={{ background: "#fff", border: "1px solid #D3D3D3" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#1A1A1A" }}>
                {["Title", "Status", "Priority", "Assigned To", "Created", "Actions"].map((h) => (
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
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "#D3D3D3" }}>
                    No tasks found
                  </td>
                </tr>
              )}
              {tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: "#1A1A1A" }}>{task.title}</div>
                    {task.description && (
                      <div className="text-xs mt-0.5 line-clamp-1" style={{ color: "#595959" }}>{task.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${task.status} text-xs px-2 py-0.5`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${task.priority} text-xs px-2 py-0.5`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#595959" }}>{task.assigned_to || "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#595959" }}>
                    {new Date(task.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal(task)}
                        className="px-3 py-1 text-xs font-medium"
                        style={{ background: "#FFE600", color: "#1A1A1A" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 text-xs font-medium"
                        style={{ border: "1px solid #FFCDD2", color: "#B71C1C" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <TaskModal
          task={modal?.id ? modal : null}
          users={users}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

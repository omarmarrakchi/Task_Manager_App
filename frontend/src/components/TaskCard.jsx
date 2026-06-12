import React from "react";
import { Pencil, Trash2, User } from "lucide-react";

const PRIORITY_LABEL = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Critical" };

export default function TaskCard({ task, onEdit, onDelete, dragging }) {
  return (
    <div
      className="bg-white p-4 mb-3 select-none"
      style={{
        border: "1px solid #D3D3D3",
        borderLeft: dragging ? "3px solid #FFE600" : "3px solid #1A1A1A",
        boxShadow: dragging ? "0 4px 16px rgba(0,0,0,0.18)" : "none",
        opacity: dragging ? 0.9 : 1,
        cursor: "grab",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-sm" style={{ color: "#1A1A1A", lineHeight: 1.3 }}>
          {task.title}
        </span>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:opacity-70 transition-opacity"
            title="Edit"
          >
            <Pencil size={14} style={{ color: "#595959" }} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:opacity-70 transition-opacity"
            title="Delete"
          >
            <Trash2 size={14} style={{ color: "#B71C1C" }} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: "#595959" }}>
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`badge-${task.priority} text-xs px-2 py-0.5 font-medium`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
        {task.assigned_to && (
          <span className="flex items-center gap-1 text-xs" style={{ color: "#595959" }}>
            <User size={11} />
            {task.assigned_to}
          </span>
        )}
      </div>
    </div>
  );
}

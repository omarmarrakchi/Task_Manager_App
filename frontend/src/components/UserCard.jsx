import React from "react";
import { Pencil, Trash2, Mail, AtSign } from "lucide-react";

export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
      <td className="px-4 py-3">
        <div className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>
          {user.full_name}
        </div>
        <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#595959" }}>
          <AtSign size={11} />
          {user.username}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-sm" style={{ color: "#595959" }}>
          <Mail size={13} />
          {user.email}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`badge-${user.role} text-xs px-2 py-0.5 font-medium`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: "#595959" }}>
        {new Date(user.created_at).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-1.5 hover:opacity-70 transition-opacity"
            title="Edit"
            style={{ border: "1px solid #D3D3D3" }}
          >
            <Pencil size={14} style={{ color: "#595959" }} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-1.5 hover:opacity-70 transition-opacity"
            title="Delete"
            style={{ border: "1px solid #FFCDD2" }}
          >
            <Trash2 size={14} style={{ color: "#B71C1C" }} />
          </button>
        </div>
      </td>
    </tr>
  );
}

import React from "react";

export default function StatsCard({ title, value, icon: Icon, accent = false }) {
  return (
    <div
      className="p-5 flex items-center justify-between"
      style={{
        background: accent ? "#1A1A1A" : "#fff",
        border: "1px solid #D3D3D3",
        borderTop: accent ? "3px solid #FFE600" : "3px solid #D3D3D3",
      }}
    >
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: accent ? "#FFE600" : "#595959" }}
        >
          {title}
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: accent ? "#FFE600" : "#1A1A1A" }}
        >
          {value ?? "—"}
        </p>
      </div>
      {Icon && (
        <div
          className="w-12 h-12 flex items-center justify-center"
          style={{ background: accent ? "#FFE600" : "#F6F6F6" }}
        >
          <Icon size={24} style={{ color: accent ? "#1A1A1A" : "#595959" }} />
        </div>
      )}
    </div>
  );
}

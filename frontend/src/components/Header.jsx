import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, Menu, X } from "lucide-react";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks",     icon: CheckSquare,     label: "Tasks" },
  { to: "/users",     icon: Users,           label: "Users" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background: "#1A1A1A" }} className="shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center font-bold text-sm"
            style={{ background: "#FFE600", color: "#1A1A1A" }}
          >
            DM
          </div>
          <span className="font-bold text-lg tracking-wide" style={{ color: "#FFE600" }}>
            DevOps Task Manager
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-ey-black"
                    : "text-gray-300 hover:text-white"
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: "#FFE600", color: "#1A1A1A" } : {}
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#1A1A1A", borderTop: "1px solid #333" }} className="md:hidden px-6 pb-4">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 text-sm font-medium border-b border-gray-700 ${
                  isActive ? "" : "text-gray-300"
                }`
              }
              style={({ isActive }) =>
                isActive ? { color: "#FFE600" } : {}
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

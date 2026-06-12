import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckSquare, Clock, Check, AlertTriangle, Users, TrendingUp } from "lucide-react";
import StatsCard from "../components/StatsCard";

const TASK_URL = process.env.REACT_APP_TASK_SERVICE_URL || "http://localhost:8000";
const USER_URL = process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:8001";

const PRIORITY_COLORS = {
  CRITICAL: "#B71C1C",
  HIGH:     "#E65100",
  MEDIUM:   "#F57F17",
  LOW:      "#2E7D32",
};

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${TASK_URL}/tasks/stats`),
      axios.get(`${USER_URL}/users`),
      axios.get(`${TASK_URL}/tasks`),
    ])
      .then(([s, u, t]) => {
        setStats(s.data);
        setUserCount(u.data.length);
        setTasks(t.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "#595959" }}>Loading dashboard…</div>
      </div>
    );
  }

  const recentByPriority = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => ({
    priority: p,
    count: tasks.filter((t) => t.priority === p).length,
  }));

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div style={{ borderBottom: "3px solid #FFE600", paddingBottom: "12px" }}>
        <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#595959" }}>
          Overview of your DevOps project tasks
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Tasks"   value={stats?.total}       icon={CheckSquare} accent />
        <StatsCard title="In Progress"   value={stats?.in_progress} icon={Clock} />
        <StatsCard title="Completed"     value={stats?.done}        icon={Check} />
        <StatsCard title="Team Members"  value={userCount}          icon={Users} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div style={{ background: "#fff", border: "1px solid #D3D3D3" }}>
          <div
            className="px-5 py-4"
            style={{ background: "#1A1A1A", borderBottom: "3px solid #FFE600" }}
          >
            <h2 className="font-bold text-sm tracking-wider" style={{ color: "#FFE600" }}>
              STATUS BREAKDOWN
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "TODO",        value: stats?.todo,        max: stats?.total, color: "#595959" },
              { label: "IN PROGRESS", value: stats?.in_progress, max: stats?.total, color: "#FFE600" },
              { label: "DONE",        value: stats?.done,        max: stats?.total, color: "#2E7D32" },
            ].map((row) => {
              const pct = stats?.total ? Math.round((row.value / stats.total) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: "#1A1A1A" }}>{row.label}</span>
                    <span style={{ color: "#595959" }}>{row.value} ({pct}%)</span>
                  </div>
                  <div className="h-2" style={{ background: "#F6F6F6", border: "1px solid #E5E5E5" }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, background: row.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority breakdown */}
        <div style={{ background: "#fff", border: "1px solid #D3D3D3" }}>
          <div
            className="px-5 py-4"
            style={{ background: "#1A1A1A", borderBottom: "3px solid #FFE600" }}
          >
            <h2 className="font-bold text-sm tracking-wider" style={{ color: "#FFE600" }}>
              PRIORITY BREAKDOWN
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {[
              { label: "Critical", value: stats?.critical, color: "#B71C1C" },
              { label: "High",     value: stats?.high,     color: "#E65100" },
              { label: "Medium",   value: stats?.medium,   color: "#F57F17" },
              { label: "Low",      value: stats?.low,      color: "#2E7D32" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 p-3"
                style={{ border: "1px solid #E5E5E5" }}
              >
                <div className="w-3 h-3 shrink-0" style={{ background: row.color }} />
                <div>
                  <div className="text-xs" style={{ color: "#595959" }}>{row.label}</div>
                  <div className="font-bold text-lg" style={{ color: "#1A1A1A" }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div style={{ background: "#fff", border: "1px solid #D3D3D3" }}>
        <div
          className="px-5 py-4"
          style={{ background: "#1A1A1A", borderBottom: "3px solid #FFE600" }}
        >
          <h2 className="font-bold text-sm tracking-wider" style={{ color: "#FFE600" }}>
            RECENT TASKS
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F6F6F6", borderBottom: "1px solid #D3D3D3" }}>
                {["Title", "Status", "Priority", "Assigned To"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#595959" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A" }}>{task.title}</td>
                  <td className="px-4 py-3">
                    <span className={`badge-${task.status} text-xs px-2 py-0.5`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${task.priority} text-xs px-2 py-0.5`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#595959" }}>{task.assigned_to || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ background: "#F6F6F6" }}>
        <Header />
        <main className="flex-1 p-6 max-w-screen-xl mx-auto w-full">
          <Routes>
            <Route path="/"        element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks"   element={<Tasks />} />
            <Route path="/users"   element={<Users />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#fff",
            border: "2px solid #FFE600",
            borderRadius: "0",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#FFE600", secondary: "#1A1A1A" } },
          error:   { iconTheme: { primary: "#FF4444", secondary: "#fff" } },
        }}
      />
    </BrowserRouter>
  );
}

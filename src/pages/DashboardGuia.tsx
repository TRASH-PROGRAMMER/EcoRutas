// DashboardGuia.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardGuia() {
  const { user, logout } = useAuth();
  return (
    <div className="dashboard">
      <h1>Bienvenido, {user?.nombre} (Guía)</h1>
    
      {/* Gestión de rutas o reservas asignadas */}
    </div>
  );
}

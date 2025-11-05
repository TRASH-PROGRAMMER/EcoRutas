// DashboardTurista.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardTurista() {
  const { user, logout } = useAuth();
  return (
    <div className="dashboard">
      <h1>Bienvenido, {user?.nombre} (Turista)</h1>
      
      {/* Visualización de rutas, reservas o historial */}
    </div>
  );
}
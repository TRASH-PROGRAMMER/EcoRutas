import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ("administrador" | "guia" | "turista")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.rol)) {
    return <div className="p-6 text-red-600 font-semibold">Acceso denegado</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

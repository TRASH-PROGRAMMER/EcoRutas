// App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Rutas from "./pages/Rutas";
import Guias from "./pages/Guias";
import Comunidades from "./pages/Comunidades";
import Nosotros from "./pages/Nosotros";
import Reservar from "./pages/Reservar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

// Dashboards
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardGuia from "./pages/DashboardGuia";
import DashboardTurista from "./pages/DashboardTurista";

import AddLocalidadForm from "./components/forms/AddLocalidadForm";
import GestionGuias from "@/components/localidad/GestionGuias";
import HistorialCambios from "@/components/localidad/HistorialCambios";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import AccessibilityMenu from "./components/AccessibilityMenu";
import KeyboardShortcutIndicator from "./components/KeyboardShortcutIndicator";
import "./i18n";

const queryClient = new QueryClient();

// Ruta protegida
const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol))
    return <div className="p-4 text-red-600 font-semibold">Acceso denegado</div>;
  return children;
};

// Redirige /dashboard según rol
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.rol) {
    case "administrador":
      return <Navigate to="/dashboard/admin" replace />;

    case "turista":
      return <Navigate to="/dashboard/turista" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

// Layout principal con sidebar y header para TODA la aplicación
const MainLayout: React.FC = () => (
  <SidebarProvider defaultOpen={true}>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col w-full">
        <AppHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const AppContent: React.FC = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* Páginas públicas */}
      <Route index element={<Index />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="rutas" element={<Rutas />} />
      <Route path="guias" element={<Guias />} />
      <Route path="comunidades" element={<Comunidades />} />
      <Route path="nosotros" element={<Nosotros />} />

      {/* Reservar protegido */}
      <Route
        path="reservar"
        element={
          <ProtectedRoute>
            <Reservar />
          </ProtectedRoute>
        }
      />

      {/* Perfil protegido */}
      <Route
        path="perfil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Redirección inicial del dashboard */}
      <Route path="dashboard" element={<DashboardRouter />} />

      {/* Dashboard administrador con rutas anidadas */}
      <Route path="dashboard/admin">
        <Route 
          index 
          element={
            <ProtectedRoute roles={["administrador"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="localidades/:localidadId/info" 
          element={
            <ProtectedRoute roles={["administrador"]}>
              <AddLocalidadForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="localidades/:localidadId/guias" 
          element={
            <ProtectedRoute roles={["administrador"]}>
              <GestionGuias />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="localidades/:localidadId/historial" 
          element={
            <ProtectedRoute roles={["administrador"]}>
              <HistorialCambios />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Dashboard guía */}
      <Route 
        path="dashboard/guia" 
        element={
          <ProtectedRoute roles={["guia"]}>
            <DashboardGuia />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard turista */}
      <Route 
        path="dashboard/turista" 
        element={
          <ProtectedRoute roles={["turista"]}>
            <DashboardTurista />
          </ProtectedRoute>
        } 
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AccessibilityProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
            <AccessibilityMenu />
            <KeyboardShortcutIndicator />
          </BrowserRouter>
        </AuthProvider>
      </AccessibilityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

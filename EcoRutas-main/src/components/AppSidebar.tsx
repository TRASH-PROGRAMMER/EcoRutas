import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Leaf,
  Map,
  Users,
  Building2,
  Info,
  Calendar,
  Home,
  User as UserIcon,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => currentPath === path;

  // **Navegación principal visible para turistas y usuarios no registrados**
  const publicNavigation = [
    { title: t("Inicio"), url: "/", icon: Home },
    { title: t("Rutas"), url: "/rutas", icon: Map },
    { title: t("Guías Locales"), url: "/guias", icon: Users },
    { title: t("Comunidades"), url: "/comunidades", icon: Building2 },
    { title: t("Nosotros"), url: "/nosotros", icon: Info },
  ];

  // **Acciones según rol**
  const actionItems: { title: string; url?: string; icon: any; className?: string; onClick?: () => void }[] = [];

  if (!user) {
    // Usuarios no registrados
    actionItems.push(
      { title: t("Iniciar Sesión"), url: "/login", icon: UserIcon },
      { title: t("Registro"), url: "/register", icon: UserPlus }
    );
  } else {
    // Todos los usuarios logueados pueden ver perfil y cerrar sesión
    actionItems.push(
      { title: t("Perfil"), url: "/perfil", icon: UserIcon },
      { title: t("Cerrar Sesión"), icon: LogOut, onClick: logout, className: "text-red-600 hover:bg-red-50 font-medium" }
    );

    if (user.rol === "turista") {
  actionItems.unshift({
    title: t("Mi Dashboard"),
    url: "/dashboard/turista", // ruta única para turistas
    icon: Calendar,
  });
}

if (user.rol === "administrador") {
  actionItems.unshift({
    title: t("Dashboard Admin"),
    url: "/dashboard/admin", // ruta única para administradores
    icon: Building2,
  });
}


  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          {!isCollapsed && <span className="font-bold text-xl text-foreground">EcoRutas</span>}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* Navegación pública */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("Navegación")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 ${
                          active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted/50 text-foreground/80"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Acciones según rol */}
        {actionItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("Acciones")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {actionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        {item.url ? (
                          <NavLink
                            to={item.url}
                            className={`flex items-center gap-3 ${item.className ?? "hover:bg-muted/50 text-foreground/80"}`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        ) : (
                          <button
                            onClick={item.onClick}
                            className={`w-full text-left flex items-center gap-3 ${item.className ?? "hover:bg-muted/50 text-foreground/80"} px-2 py-1 rounded`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </button>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!isCollapsed && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{t("Turismo Sostenible")}</p>
            <p className="text-xs font-medium text-foreground">© 2025 EcoRutas</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

import { NavLink, useLocation } from "react-router-dom";
import { 
  Leaf, 
  Map, 
  Users, 
  Building2, 
  Info, 
  Calendar,
  Home
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
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Rutas", url: "/rutas", icon: Map },
  { title: "Guías Locales", url: "/guias", icon: Users },
  { title: "Comunidades", url: "/comunidades", icon: Building2 },
  { title: "Nosotros", url: "/nosotros", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-foreground">EcoRutas</span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink 
                        to={item.url}
                        className={`flex items-center gap-3 ${
                          active 
                            ? "bg-primary/10 text-primary font-semibold" 
                            : "hover:bg-muted/50 text-foreground/80"
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

        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/reservar"
                    className="flex items-center gap-3 text-primary-foreground bg-primary hover:bg-primary/90 font-medium"
                  >
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                    <span>Reservar Ahora</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!isCollapsed && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Turismo Sostenible
            </p>
            <p className="text-xs font-medium text-foreground">
              © 2025 EcoRutas
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

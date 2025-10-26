import { SidebarTrigger } from "@/components/ui/sidebar";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger className="hover:bg-muted rounded-md" />
        
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          <Link to="/" className="font-bold text-xl text-foreground hover:text-primary transition-colors">
            EcoRutas
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden md:block text-sm text-muted-foreground">
            Turismo Comunitario Sostenible
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

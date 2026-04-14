import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Link } from "react-router-dom";
import { Home, BookOpen, Wrench, Users, FileText, Settings, LogOut, Menu, X, ExternalLink, CalendarDays, PlayCircle, Shield, Briefcase } from "lucide-react";

type DashboardTab = "home" | "progress" | "tools" | "community" | "theses" | "events" | "content" | "portfolio" | "settings";

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  children: React.ReactNode;
}

const navItems: { id: DashboardTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "portfolio", label: "Mi Portafolio", icon: Briefcase },
  { id: "content", label: "Clases", icon: PlayCircle },
  { id: "progress", label: "Mi Progreso", icon: BookOpen },
  { id: "tools", label: "Herramientas", icon: Wrench },
  { id: "community", label: "Comunidad", icon: Users },
  { id: "theses", label: "Mis Tesis", icon: FileText },
  { id: "events", label: "Eventos", icon: CalendarDays },
  { id: "settings", label: "Configuración", icon: Settings },
];

const mobileNav: { id: DashboardTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "progress", label: "Cursos", icon: BookOpen },
  { id: "tools", label: "Herramientas", icon: Wrench },
  { id: "community", label: "Comunidad", icon: Users },
];

const DashboardLayout = ({ activeTab, onTabChange, children }: DashboardLayoutProps) => {
  const { logout } = useAuth();
  const { isAdmin } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-background fixed inset-y-0 left-0 z-30">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/" className="text-lg font-heading font-semibold text-foreground hover:text-muted-foreground transition-colors">InvertíUY</Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading transition-colors ${
                activeTab === item.id
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          {isAdmin && (
            <Link
              to="/admin"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Shield size={18} />
              Admin
            </Link>
          )}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <ExternalLink size={18} />
            Ir al sitio
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border h-14 flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-heading font-semibold text-foreground">InvertíUY</Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground p-1">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background pt-14">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-heading transition-colors ${
                  activeTab === item.id
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            <div className="mt-4 border-t border-border pt-4 space-y-1">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-heading text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={20} />
                Ir al sitio
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-heading text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={20} />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border flex">
        {mobileNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-heading transition-colors ${
              activeTab === item.id ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
export type { DashboardTab };

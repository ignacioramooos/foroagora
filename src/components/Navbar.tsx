import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import StonePathLogo from "@/components/StonePathLogo";

const navLinks = [
  { label: "Nosotros", path: "/nosotros" },
  { label: "Programa", path: "/programa" },
  { label: "Recursos", path: "/recursos" },
  { label: "Glosario", path: "/glosario" },
  { label: "Impacto", path: "/impacto" },
  { label: "Brokers", path: "/brokers" },
  { label: "Partners", path: "/partners" },
  { label: "Contacto", path: "/contacto" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-background ${
          scrolled ? "border-b border-border" : ""
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-lg font-heading font-semibold tracking-tight text-foreground">
            <StonePathLogo className="h-7 w-auto" />
            <span>Foro Agora</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-heading font-medium transition-colors ${
                  location.pathname === l.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Toggle theme"
              title="Atajo: M"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {isLoggedIn ? (
              <>
                <span className="text-xs text-muted-foreground font-heading mr-1">
                  Hola, {user?.name?.split(" ")[0] ?? ""}
                </span>
                <Button asChild variant="cta" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                  <Link to="/auth"><LogIn size={14} /> Log In</Link>
                </Button>
                <Button asChild variant="cta" size="sm">
                  <Link to="/registro">Inscribite</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground p-2 -mr-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className="fixed top-16 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none">
        <div className="h-full bg-foreground transition-[width] duration-75" style={{ width: `${scrollProgress}%` }} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col pt-20 pb-8 px-6 md:hidden">
          <div className="flex flex-col gap-6 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-2xl font-heading font-semibold transition-colors ${
                  location.pathname === l.path ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            {isLoggedIn ? (
              <>
                <Button asChild variant="cta" size="cta" className="w-full">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="cta-outline" size="cta" className="w-full" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="cta-outline" size="cta" className="w-full">
                  <Link to="/auth">Log In</Link>
                </Button>
                <Button asChild variant="cta" size="cta" className="w-full">
                  <Link to="/registro">Inscribite</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

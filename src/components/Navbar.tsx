import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import logoMark from "@/assets/stone-trail-logo.png";

const navLinks = [
  { label: "Inicio", path: "/" },
  { label: "Sobre nosotros", path: "/nosotros" },
  { label: "Clases", path: "/programa" },
  { label: "Impacto", path: "/impacto" },
  { label: "Recursos", path: "/recursos" },
  { label: "Partners", path: "/partners" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 bg-background/92 backdrop-blur border-b border-transparent ${
          scrolled ? "border-border shadow-sm" : ""
        }`}
      >
        <div className="container flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 text-2xl font-heading font-black leading-none text-foreground hover:opacity-80 transition-opacity">
            <img src={logoMark} alt="" className="h-14 w-11 object-contain object-center dark:invert" />
            <span className="hidden sm:inline">
              Foro
              <br />
              Agora
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-heading font-semibold transition-colors ${
                  location.pathname === l.path ? "text-orange-pop" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
              title="Atajo: M"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {isLoggedIn ? (
              <>
                <span className="text-xs text-foreground/60 font-heading mr-1">
                  Hola, {user?.name?.split(" ")[0] ?? ""}
                </span>
                <Button asChild variant="cta" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="text-foreground/60">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-foreground/60 gap-1.5">
                  <Link to="/auth"><LogIn size={14} /> Log In</Link>
                </Button>
                <Button asChild variant="cta" size="sm">
                  <Link to="/registro">Quiero participar</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground p-2 -mr-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className="fixed top-20 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
        <div className="h-full bg-sun transition-[width] duration-75" style={{ width: `${scrollProgress}%` }} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col pt-24 pb-8 px-6 lg:hidden">
          <div className="flex flex-col gap-6 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-2xl font-heading font-semibold transition-colors ${
                  location.pathname === l.path ? "text-orange-pop" : "text-foreground/70"
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

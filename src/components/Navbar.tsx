import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Nosotros", path: "/nosotros" },
  { label: "Programa", path: "/programa" },
  { label: "Recursos", path: "/recursos" },
  { label: "Partners", path: "/partners" },
  { label: "Contacto", path: "/contacto" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
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
          <Link to="/" className="text-lg font-heading font-semibold tracking-tight text-foreground">
            InvertíUY
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

          <div className="hidden md:block">
            <Button asChild variant="cta" size="sm">
              <Link to="/registro">Inscribite</Link>
            </Button>
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
          <Button asChild variant="cta" size="cta" className="w-full">
            <Link to="/registro">Inscribite</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default Navbar;

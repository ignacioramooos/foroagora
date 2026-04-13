import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Nosotros", path: "/nosotros" },
  { label: "El Programa", path: "/programa" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled ? "bg-secondary shadow-md" : "bg-secondary/80 backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="text-lg font-heading font-bold tracking-tight text-secondary-foreground">
            InvertíUY
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.path ? "text-primary" : "text-secondary-foreground/60 hover:text-secondary-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button asChild variant="cta" size="sm">
              <Link to="/registro">Anotate gratis</Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-secondary-foreground p-2 -mr-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-secondary flex flex-col pt-20 pb-8 px-6 md:hidden">
          <div className="flex flex-col gap-6 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-2xl font-heading font-semibold transition-colors ${
                  location.pathname === l.path ? "text-primary" : "text-secondary-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Button asChild variant="cta" size="cta" className="w-full">
            <Link to="/registro">Anotate gratis</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default Navbar;

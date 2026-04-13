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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-navy/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-cream">
            InvertíUY
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-medium transition-colors hover:text-green ${
                  location.pathname === l.path ? "text-green" : "text-cream/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button asChild variant="cta" size="cta">
              <Link to="/registro">Anotate gratis</Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cream p-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy flex flex-col pt-20 pb-8 px-6 md:hidden">
          <div className="flex flex-col gap-6 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-2xl font-semibold transition-colors ${
                  location.pathname === l.path ? "text-green" : "text-cream"
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

import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-cream/70">
    <div className="container py-16">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-extrabold text-cream mb-3">InvertíUY</h3>
          <p className="text-sm leading-relaxed max-w-xs">
            Educación financiera gratuita para jóvenes en Uruguay. Análisis fundamental, no trading.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-cream/50 mb-4 font-mono">
            Navegación
          </h4>
          <div className="flex flex-col gap-2">
            {[
              ["Nosotros", "/nosotros"],
              ["El Programa", "/programa"],
              ["Recursos", "/recursos"],
              ["Partners", "/partners"],
              ["Contacto", "/contacto"],
              ["Registrarse", "/registro"],
            ].map(([label, path]) => (
              <Link key={path} to={path} className="text-sm hover:text-green transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-cream/50 mb-4 font-mono">
            Seguinos
          </h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="hover:text-green transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="hover:text-green transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-green transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
            <a href="#" className="hover:text-green transition-colors" aria-label="Email"><Mail size={20} /></a>
          </div>
          <p className="text-xs text-cream/40">
            hola@invertiuy.org
          </p>
        </div>
      </div>
    </div>
    <div className="border-t border-cream/10">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-xs text-cream/30">
        <span>Proyecto sin fines de lucro · Montevideo, Uruguay · 2025</span>
        <span className="mt-2 md:mt-0">Hecho con pasión por jóvenes para jóvenes</span>
      </div>
    </div>
  </footer>
);

export default Footer;

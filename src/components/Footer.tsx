import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="container py-16">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">InvertíUY</h3>
          <p className="text-sm leading-relaxed max-w-xs">
            Educación financiera para jóvenes en Uruguay. Análisis fundamental, no trading.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Navegación
          </h4>
          <div className="flex flex-col gap-2">
            {[
              ["Nosotros", "/nosotros"],
              ["Programa", "/programa"],
              ["Recursos", "/recursos"],
              ["Partners", "/partners"],
              ["Contacto", "/contacto"],
              ["Inscripción", "/registro"],
            ].map(([label, path]) => (
              <Link key={path} to={path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Seguinos
          </h4>
          <div className="flex gap-4 mb-6">
            <a href="https://instagram.com/invertiuy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://linkedin.com/company/invertiuy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="https://youtube.com/@invertiuy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube"><Youtube size={18} /></a>
            <a href="mailto:hola@invertiuy.org" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email"><Mail size={18} /></a>
          </div>
          <p className="text-xs text-muted-foreground">
            hola@invertiuy.org
          </p>
        </div>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <span>Proyecto sin fines de lucro · Montevideo, Uruguay · {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
);

export default Footer;

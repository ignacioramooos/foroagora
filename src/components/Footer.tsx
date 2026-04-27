import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import logoMark from "@/assets/stone-trail-logo.png";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container py-16">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img src={logoMark} alt="" className="h-14 w-11 object-contain object-center dark:invert" />
            <h3 className="text-2xl font-heading font-black leading-none text-foreground">
              Foro
              <br />
              Agora
            </h3>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Educación financiera para jóvenes en Uruguay. Análisis fundamental, no trading.
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-2">
            No damos consejos financieros
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
              ["Ranking", "/ranking"],
              ["Contacto", "/contacto"],
              ["Inscripción", "/registro"],
            ].map(([label, path]) => (
              <Link key={path} to={path} className="text-sm font-heading font-semibold text-foreground/60 hover:text-foreground transition-colors">
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
            <a href="https://instagram.com/foroagora" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-sun transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://linkedin.com/company/foroagora" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-sun transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="https://youtube.com/@foroagora" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-sun transition-colors" aria-label="YouTube"><Youtube size={18} /></a>
            <a href="mailto:hola@foroagora.org" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-sun transition-colors" aria-label="Email"><Mail size={18} /></a>
          </div>
          <p className="text-xs text-muted-foreground">
            hola@foroagora.org
          </p>
        </div>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-8">
        <NewsletterSignup />
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

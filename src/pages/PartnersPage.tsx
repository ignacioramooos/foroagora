import { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2 } from "lucide-react";

const partnerCategories = [
  { name: "Instituciones Educativas", logos: ["UdelaR", "ORT", "UTEC"] },
  { name: "Organizaciones", logos: ["Teach For All", "JA Uruguay"] },
  { name: "Empresas", logos: ["Sponsor 1", "Sponsor 2"] },
];

const collaborationOptions = [
  "Ceder un espacio para clases",
  "Patrocinar materiales",
  "Difundir el programa",
  "Mentoría para estudiantes",
  "Otro",
];

const PartnersPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", role: "", email: "", collab: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.org && form.email) setSent(true);
  };

  const inputClass = "w-full h-12 px-4 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 bg-secondary">
        <div className="container">
          <SectionFade>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-6">
              Partners
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-foreground max-w-3xl mb-6">
              Construyamos juntos
            </h1>
            <p className="text-secondary-foreground/50 text-lg max-w-xl">
              Instituciones, organizaciones y empresas que apoyan la educación financiera de los jóvenes uruguayos.
            </p>
          </SectionFade>
        </div>
      </section>

      {/* Logo Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container">
          {partnerCategories.map((cat) => (
            <div key={cat.name} className="mb-16 last:mb-0">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">{cat.name}</h3>
              <div className="flex flex-wrap gap-4">
                {cat.logos.map((logo) => (
                  <div key={logo} className="bg-card border border-border rounded-lg h-16 px-8 flex items-center justify-center">
                    <span className="text-muted-foreground/30 font-mono text-xs">{logo}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-card border-y border-border">
        <div className="container max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-12">
            Qué dicen nuestros aliados
          </p>
          <div className="space-y-12">
            {[
              { name: "Dr. María Rodríguez", role: "Directora, Liceo 7 Montevideo", quote: "InvertíUY trajo algo que faltaba en nuestro liceo: una forma accesible y seria de hablar sobre finanzas con los estudiantes." },
              { name: "Carlos Méndez", role: "Director, JA Uruguay", quote: "La calidad del contenido y el compromiso del equipo son excepcionales para una iniciativa liderada por jóvenes." },
            ].map((t) => (
              <blockquote key={t.name} className="border-l-2 border-primary pl-8">
                <p className="text-foreground text-xl font-heading font-medium leading-snug mb-4">"{t.quote}"</p>
                <footer className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">{t.name}</strong> — {t.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Sumate
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quiero ser aliado
          </h2>
          <p className="text-muted-foreground mb-10">
            Podés ayudar cediendo un espacio, difundiendo el programa, o aportando recursos. Completá el formulario y te contactamos.
          </p>
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 size={40} className="text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-foreground text-xl mb-2">¡Gracias!</h3>
              <p className="text-muted-foreground">Recibimos tu solicitud. Te contactamos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nombre *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Organización *</label>
                  <input className={inputClass} value={form.org} onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Rol / Cargo</label>
                <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">¿Cómo te gustaría colaborar?</label>
                <select className={inputClass} value={form.collab} onChange={(e) => setForm((p) => ({ ...p, collab: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {collaborationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <Button type="submit" variant="cta-outline" size="cta" className="w-full">
                Quiero ser aliado
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default PartnersPage;

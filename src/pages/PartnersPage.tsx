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

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
              Partners
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground max-w-3xl mb-6">
              Construyamos juntos
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Instituciones, organizaciones y empresas que apoyan la educación financiera de los jóvenes uruguayos.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-24 md:py-32 border-y border-border">
        <div className="container">
          {partnerCategories.map((cat) => (
            <div key={cat.name} className="mb-16 last:mb-0">
              <h3 className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">{cat.name}</h3>
              <div className="flex flex-wrap gap-4">
                {cat.logos.map((logo) => (
                  <div key={logo} className="border border-border rounded-md h-16 px-8 flex items-center justify-center">
                    <span className="text-muted-foreground/30 font-heading text-xs">{logo}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container max-w-3xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-12">
            Qué dicen nuestros aliados
          </p>
          <div className="space-y-12">
            {[
              { name: "Dr. María Rodríguez", role: "Directora, Liceo 7 Montevideo", quote: "InvertíUY trajo algo que faltaba en nuestro liceo: una forma accesible y seria de hablar sobre finanzas con los estudiantes." },
              { name: "Carlos Méndez", role: "Director, JA Uruguay", quote: "La calidad del contenido y el compromiso del equipo son excepcionales para una iniciativa liderada por jóvenes." },
            ].map((t) => (
              <blockquote key={t.name} className="border-l border-border pl-8">
                <p className="text-foreground text-xl font-heading font-medium leading-snug mb-4">"{t.quote}"</p>
                <footer className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">{t.name}</strong> — {t.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-2xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Sumate
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            Quiero ser aliado
          </h2>
          <p className="text-muted-foreground mb-10">
            Podés ayudar cediendo un espacio, difundiendo el programa, o aportando recursos. Completá el formulario y te contactamos.
          </p>
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 size={40} className="text-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-foreground text-xl mb-2">Recibido</h3>
              <p className="text-muted-foreground">Te contactamos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Organización *</label>
                  <input className={inputClass} value={form.org} onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Rol / Cargo</label>
                <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email *</label>
                <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo te gustaría colaborar?</label>
                <select className={inputClass} value={form.collab} onChange={(e) => setForm((p) => ({ ...p, collab: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {collaborationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <Button type="submit" variant="cta-outline" size="cta" className="w-full">
                Enviar solicitud
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default PartnersPage;

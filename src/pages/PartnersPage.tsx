import { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import SectionTag from "@/components/SectionTag";
import { Quote, CheckCircle2 } from "lucide-react";

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

  const inputClass = "w-full h-12 px-4 rounded-lg border border-border bg-background text-navy text-sm focus:outline-none focus:ring-2 focus:ring-green/50";

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 bg-navy">
        <div className="container">
          <SectionFade>
            <SectionTag>Partners</SectionTag>
            <h1 className="text-3xl md:text-5xl font-extrabold text-cream max-w-3xl mb-6">
              Construyamos juntos
            </h1>
            <p className="text-cream/60 text-lg max-w-xl">
              Instituciones, organizaciones y empresas que apoyan la educación financiera de los jóvenes uruguayos.
            </p>
          </SectionFade>
        </div>
      </section>

      {/* Logo Grid */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container">
          {partnerCategories.map((cat) => (
            <SectionFade key={cat.name}>
              <div className="mb-12 last:mb-0">
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate mb-6">{cat.name}</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                  {cat.logos.map((logo) => (
                    <div key={logo} className="bg-background border border-border rounded-xl h-20 flex items-center justify-center">
                      <span className="text-slate/30 font-mono text-xs">{logo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionFade>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-3xl">
          <SectionFade>
            <div className="text-center mb-12">
              <SectionTag>Qué dicen nuestros aliados</SectionTag>
            </div>
          </SectionFade>
          {[
            { name: "Dr. María Rodríguez", role: "Directora, Liceo 7 Montevideo", quote: "InvertíUY trajo algo que faltaba en nuestro liceo: una forma accesible y seria de hablar sobre finanzas con los estudiantes." },
            { name: "Carlos Méndez", role: "Director, JA Uruguay", quote: "La calidad del contenido y el compromiso del equipo son excepcionales para una iniciativa liderada por jóvenes." },
          ].map((t, i) => (
            <SectionFade key={t.name} delay={i * 0.1}>
              <div className="bg-cream border border-border rounded-2xl p-8 mb-6">
                <Quote size={20} className="text-green/30 mb-3" />
                <p className="text-navy font-medium leading-relaxed mb-4">"{t.quote}"</p>
                <div className="text-sm"><strong className="text-navy">{t.name}</strong> · <span className="text-slate">{t.role}</span></div>
              </div>
            </SectionFade>
          ))}
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-2xl">
          <SectionFade>
            <div className="text-center mb-10">
              <SectionTag>Sumate</SectionTag>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">
                Quiero ser aliado
              </h2>
              <p className="text-slate">
                Podés ayudar cediendo un espacio, difundiendo el programa, o aportando recursos. Completá el formulario y te contactamos.
              </p>
            </div>
          </SectionFade>
          <SectionFade delay={0.1}>
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle2 size={40} className="text-green mx-auto mb-4" />
                <h3 className="font-bold text-navy text-xl mb-2">¡Gracias!</h3>
                <p className="text-slate">Recibimos tu solicitud. Te contactamos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Nombre *</label>
                    <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Organización *</label>
                    <input className={inputClass} value={form.org} onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Rol / Cargo</label>
                  <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">¿Cómo te gustaría colaborar?</label>
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
          </SectionFade>
        </div>
      </section>
    </>
  );
};

export default PartnersPage;

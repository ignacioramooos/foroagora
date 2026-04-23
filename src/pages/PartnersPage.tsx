import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const collaborationOptions = [
  "Ofrecer espacio para clases",
  "Brindar materiales o recursos",
  "Visibilidad y difusión",
  "Acceso a nuestro equipo",
  "Apoyo económico",
  "Otro",
];

const orgTypes = [
  "Universidad/Instituto Educativo",
  "Empresa Privada",
  "ONG/Fundación",
  "Medio de Comunicación",
  "Otro",
];

const PartnersPage = () => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    organization: "",
    role: "",
    email: "",
    org_type: "",
    collaboration_types: [] as string[],
    message: "",
  });
  const [partners, setPartners] = useState<Tables<"partners">[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (data) setPartners(data);
    };
    fetchPartners();
  }, []);

  const handleCollabToggle = (option: string) => {
    setForm((p) => ({
      ...p,
      collaboration_types: p.collaboration_types.includes(option)
        ? p.collaboration_types.filter((o) => o !== option)
        : [...p.collaboration_types, option],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.organization || !form.email || !form.org_type) return;
    setSubmitting(true);
    await supabase.from("partner_inquiries").insert({
      full_name: form.full_name,
      organization: form.organization,
      role: form.role,
      email: form.email,
      org_type: form.org_type,
      collaboration_types: form.collaboration_types,
      message: form.message || null,
    });
    setSent(true);
    setSubmitting(false);
  };

  const inputClass =
    "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-foreground">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-primary-foreground/50 mb-6">
              Alianzas
            </p>
            <h1 className="text-3xl md:text-5xl text-primary-foreground max-w-3xl mb-6">
              Sumá tu organización al movimiento
            </h1>
            <p className="text-primary-foreground/60 text-lg max-w-xl mb-8">
              Apoyá el acceso a educación financiera real para jóvenes en Uruguay.
            </p>
            <Button
              variant="cta"
              size="cta"
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
              onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Quiero ser aliado
            </Button>
          </SectionFade>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Visibilidad", desc: "Logo en el sitio, mención en clases presenciales, contenido en redes." },
              { title: "Acceso a talento", desc: "Conocé a los jóvenes más motivados del programa antes que nadie." },
              { title: "Impacto medible", desc: "Recibí un informe mensual con métricas reales del programa." },
            ].map((v) => (
              <div key={v.title} className="border border-border rounded-lg p-8">
                <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Nuestros aliados
          </p>
          {partners.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {partners.map((p) => (
                <div key={p.id} className="border border-border rounded-md h-16 px-8 flex items-center justify-center">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="h-8 object-contain" />
                  ) : (
                    <span className="text-muted-foreground font-heading text-sm">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Building2 size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-heading">
                Sé nuestro primer aliado institucional.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section id="form-section" className="py-16 md:py-24">
        <div className="container max-w-2xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Sumate
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            Quiero ser aliado
          </h2>
          <p className="text-muted-foreground mb-10">
            Completá el formulario y te contactamos en menos de 48 horas.
          </p>
          {sent ? (
            <div className="border border-border rounded-lg p-8 text-center">
              <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-foreground text-xl mb-2">
                ¡Gracias por tu interés!
              </h3>
              <p className="text-muted-foreground">Te contactamos en menos de 48 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre completo *</label>
                  <input className={inputClass} value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Organización *</label>
                  <input className={inputClass} value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Cargo / Rol</label>
                  <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email institucional *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Tipo de organización *</label>
                <select className={inputClass} value={form.org_type} onChange={(e) => setForm((p) => ({ ...p, org_type: e.target.value }))} required>
                  <option value="">Seleccionar...</option>
                  {orgTypes.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo te gustaría colaborar?</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {collaborationOptions.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.collaboration_types.includes(o)}
                        onChange={() => handleCollabToggle(o)}
                        className="rounded border-border"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Mensaje adicional</label>
                <textarea
                  className={`${inputClass} h-24 py-3 resize-none`}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar consulta de alianza"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default PartnersPage;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2, ArrowRight, Handshake, Eye, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orgTypes = [
  "Universidad / Instituto Educativo",
  "Empresa Privada",
  "ONG / Fundación",
  "Medio de Comunicación",
  "Otro",
];

const collabOptions = [
  "Ofrecer espacio para clases",
  "Brindar materiales o recursos",
  "Visibilidad y difusión",
  "Acceso a nuestro equipo",
  "Apoyo económico",
  "Otro",
];

const valueProps = [
  { icon: Eye, title: "Visibilidad", desc: "Logo en el sitio, mención en clases presenciales, contenido en redes." },
  { icon: Users, title: "Acceso a talento", desc: "Conocé a los jóvenes más motivados del programa antes que nadie." },
  { icon: BarChart3, title: "Impacto medible", desc: "Recibí un informe mensual con métricas reales del programa." },
];

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  category: string;
}

const PartnersPage = () => {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState({
    full_name: "", organization: "", role: "", email: "", org_type: "",
    collaboration_types: [] as string[], message: "",
  });

  useEffect(() => {
    supabase.from("partners").select("id, name, logo_url, website_url, category")
      .eq("is_active", true).order("created_at")
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  const toggleCollab = (opt: string) => {
    setForm((p) => ({
      ...p,
      collaboration_types: p.collaboration_types.includes(opt)
        ? p.collaboration_types.filter((c) => c !== opt)
        : [...p.collaboration_types, opt],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.organization || !form.role || !form.email || !form.org_type) return;
    setSubmitting(true);
    const { error } = await supabase.from("partner_inquiries").insert({
      full_name: form.full_name, organization: form.organization, role: form.role,
      email: form.email, org_type: form.org_type,
      collaboration_types: form.collaboration_types, message: form.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "No pudimos enviar tu consulta. Intentá de nuevo.", variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-20" style={{ backgroundColor: "#0D1B2A" }}>
        <div className="container max-w-3xl text-center">
          <SectionFade>
            <h1 className="text-3xl md:text-5xl text-white mb-4 font-semibold">Sumá tu organización al movimiento</h1>
            <p className="text-white/60 text-lg mb-8">Apoyá el acceso a educación financiera real para jóvenes en Uruguay.</p>
            <Button variant="cta" size="cta" className="gap-2" onClick={() => document.getElementById("aliarse")?.scrollIntoView({ behavior: "smooth" })}>
              Quiero ser aliado <ArrowRight size={16} />
            </Button>
          </SectionFade>
        </div>
      </section>

      {/* Value props */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((v) => (
              <div key={v.title} className="border border-border rounded-lg p-8">
                <v.icon size={28} className="text-[#22D07A] mb-4" />
                <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 md:py-32 border-y border-border">
        <div className="container">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">Nuestros aliados</p>
          {partners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {partners.map((p) => (
                <a key={p.id} href={p.website_url || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-20 border border-border rounded-lg px-4 hover:bg-secondary/50 transition-colors">
                  {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-12 object-contain" /> :
                    <span className="text-sm font-heading font-medium text-foreground">{p.name}</span>}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Handshake size={40} className="mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl md:text-3xl text-foreground mb-4">Sé nuestro primer aliado institucional</h2>
              <p className="text-muted-foreground text-lg">¿Tu organización quiere sumarse? Completá el formulario abajo.</p>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section id="aliarse" className="py-24 md:py-32">
        <div className="container max-w-2xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">Sumate</p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">Enviar consulta de alianza</h2>
          <p className="text-muted-foreground mb-10">Completá el formulario y te contactamos en menos de 48 horas.</p>
          {sent ? (
            <div className="border border-[#22D07A]/30 bg-[#22D07A]/5 rounded-lg p-8 text-center">
              <CheckCircle2 size={40} className="text-[#22D07A] mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-foreground text-xl mb-2">¡Gracias por tu interés!</h3>
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
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Cargo / Rol *</label>
                  <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} required />
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
                <label className="block text-sm font-heading font-medium text-foreground mb-3">¿Cómo te gustaría colaborar?</label>
                <div className="grid grid-cols-2 gap-2">
                  {collabOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={form.collaboration_types.includes(opt)} onChange={() => toggleCollab(opt)} className="rounded border-border" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Mensaje adicional</label>
                <textarea className={`${inputClass} h-24 py-3 resize-none`} maxLength={500} value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Opcional — máximo 500 caracteres" />
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

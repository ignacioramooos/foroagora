import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Instagram, Linkedin, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "¿Es realmente gratis?", a: "Sí. No hay costos ocultos ni suscripciones. Somos una iniciativa sin fines de lucro." },
  { q: "¿Necesito saber de economía?", a: "No. El programa está diseñado para personas sin ningún conocimiento previo. Empezamos desde cero." },
  { q: "¿Puedo participar si soy de otro departamento?", a: "Las clases presenciales son en Montevideo, pero ofrecemos acceso a recursos online para participantes de cualquier parte de Uruguay." },
  { q: "¿Qué edad tengo que tener?", a: "El programa está diseñado para estudiantes de 15 a 25 años, pero aceptamos participantes de cualquier edad." },
  { q: "¿Van a enseñarme a hacer trading?", a: "No. Enseñamos análisis fundamental: cómo entender y evaluar empresas. No damos señales de compra/venta." },
];

const ContactPage = () => {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        name: user.name || p.name,
        email: user.email || p.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setLoading(false);

    if (!error) setSent(true);
  };

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
              Contacto
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground max-w-2xl mb-6">
              Hablemos
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              ¿Tenés preguntas, ideas o querés colaborar? Escribinos.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-24 md:py-32 border-y border-border">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-5 gap-16">
            <div className="md:col-span-3">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={40} className="text-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground text-xl mb-2">Mensaje enviado</h3>
                  <p className="text-muted-foreground">Te respondemos lo antes posible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre</label>
                    <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
                    <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Mensaje</label>
                    <textarea className={`${inputClass} h-32 py-3 resize-none`} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
                  </div>
                  <Button type="submit" variant="cta" size="cta" className="w-full" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Enviar mensaje"}
                  </Button>
                </form>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="font-heading font-semibold text-foreground text-lg mb-6">También podés encontrarnos en:</h3>
              <div className="space-y-4">
                <a href="mailto:hola@foroagora.org" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={18} /> hola@foroagora.org
                </a>
                <a href="https://instagram.com/foroagora" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram size={18} /> @foroagora
                </a>
                <a href="https://linkedin.com/company/foroagora" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin size={18} /> Foro Agora
                </a>
                <a href="https://chat.whatsapp.com/LIyfas9fhGUJzpv62LJTWg?mode=gi_t" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle size={18} /> Grupo de WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container max-w-3xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-10 font-heading">FAQ</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-6 overflow-hidden">
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import SectionTag from "@/components/SectionTag";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Instagram, Linkedin, MessageCircle, CheckCircle2 } from "lucide-react";

const faqs = [
  { q: "¿Es realmente gratis?", a: "Sí, 100% gratuito. No hay costos ocultos, ni suscripciones, ni pagos de ningún tipo. Somos una iniciativa sin fines de lucro financiada por voluntarios." },
  { q: "¿Necesito saber de economía?", a: "No. El programa está diseñado para personas sin ningún conocimiento previo. Empezamos desde cero y avanzamos paso a paso." },
  { q: "¿Puedo participar si soy de otro departamento?", a: "Las clases presenciales son en Montevideo, pero ofrecemos acceso a recursos online y comunidad virtual para participantes de cualquier parte de Uruguay." },
  { q: "¿Qué edad tengo que tener?", a: "El programa está diseñado para estudiantes de 15 a 25 años, pero aceptamos participantes de cualquier edad que tengan ganas de aprender." },
  { q: "¿Van a enseñarme a hacer trading?", a: "No. Enseñamos análisis fundamental: cómo entender y evaluar empresas. No damos señales de compra/venta ni enseñamos especulación." },
];

const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  const inputClass = "w-full h-12 px-4 rounded-lg border border-border bg-background text-navy text-sm focus:outline-none focus:ring-2 focus:ring-green/50";

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 bg-navy">
        <div className="container">
          <SectionFade>
            <SectionTag>Contacto</SectionTag>
            <h1 className="text-3xl md:text-5xl font-extrabold text-cream max-w-2xl mb-6">
              Hablemos
            </h1>
            <p className="text-cream/60 text-lg max-w-xl">
              ¿Tenés preguntas, ideas o querés colaborar? Escribinos.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <SectionFade>
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={40} className="text-green mx-auto mb-4" />
                  <h3 className="font-bold text-navy text-xl mb-2">¡Mensaje enviado!</h3>
                  <p className="text-slate">Te respondemos lo antes posible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Nombre</label>
                    <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
                    <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Mensaje</label>
                    <textarea className={`${inputClass} h-32 py-3 resize-none`} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
                  </div>
                  <Button type="submit" variant="cta" size="cta" className="w-full">Enviar mensaje</Button>
                </form>
              )}
            </SectionFade>

            {/* Contact info */}
            <SectionFade delay={0.1}>
              <div className="space-y-6">
                <h3 className="font-bold text-navy text-lg mb-4">También podés encontrarnos en:</h3>
                <a href="mailto:hola@invertiuy.org" className="flex items-center gap-3 text-slate hover:text-green transition-colors">
                  <Mail size={20} /> hola@invertiuy.org
                </a>
                <a href="#" className="flex items-center gap-3 text-slate hover:text-green transition-colors">
                  <Instagram size={20} /> @invertiuy
                </a>
                <a href="#" className="flex items-center gap-3 text-slate hover:text-green transition-colors">
                  <Linkedin size={20} /> InvertíUY
                </a>
                <a href="#" className="flex items-center gap-3 text-slate hover:text-green transition-colors">
                  <MessageCircle size={20} /> WhatsApp
                </a>
              </div>
            </SectionFade>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-3xl">
          <SectionFade>
            <div className="text-center mb-12">
              <SectionTag>Preguntas frecuentes</SectionTag>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">FAQ</h2>
            </div>
          </SectionFade>
          <SectionFade delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-cream border border-border rounded-xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-bold text-navy hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-slate leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionFade>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

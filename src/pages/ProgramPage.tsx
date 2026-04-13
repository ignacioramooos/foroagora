import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import SectionTag from "@/components/SectionTag";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, MapPin, Wifi, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const modules = [
  { id: "m1", title: "Módulo 1: ¿Qué es una acción y por qué importa?", desc: "Entendé qué representa una acción, cómo funcionan los mercados de valores y por qué invertir importa para tu futuro.", duration: "2 horas · Presencial" },
  { id: "m2", title: "Módulo 2: Cómo leer un Income Statement", desc: "Aprendé a interpretar el estado de resultados de una empresa: ingresos, costos, márgenes y beneficios.", duration: "2 horas · Presencial" },
  { id: "m3", title: "Módulo 3: El Balance Sheet y la salud financiera", desc: "Descubrí cómo leer un balance general para evaluar si una empresa está sana o endeudada.", duration: "2 horas · Presencial" },
  { id: "m4", title: "Módulo 4: Métricas clave — P/E, ROE, márgenes, deuda", desc: "Dominá los ratios financieros que usan los profesionales para comparar empresas entre sí.", duration: "2 horas · Presencial" },
  { id: "m5", title: "Módulo 5: Cómo valuar una empresa (DCF simplificado)", desc: "Aprendé una versión simplificada del modelo de flujos descontados para estimar el valor de una empresa.", duration: "2 horas · Presencial" },
  { id: "m6", title: "Módulo 6: Armando un portafolio con criterio", desc: "Integrá todo lo aprendido para construir una cartera diversificada basada en análisis fundamental.", duration: "2 horas · Presencial" },
];

const ProgramPage = () => (
  <>
    {/* Header */}
    <section className="pt-32 md:pt-40 pb-20 bg-navy">
      <div className="container">
        <SectionFade>
          <SectionTag>El programa</SectionTag>
          <h1 className="text-3xl md:text-5xl font-extrabold text-cream max-w-3xl mb-8 leading-tight">
            Un programa diseñado para que entiendas el mercado de verdad
          </h1>
        </SectionFade>
        <SectionFade delay={0.1}>
          <div className="bg-navy-light border border-cream/10 rounded-2xl p-6 md:p-8 max-w-3xl">
            <div className="flex gap-3 items-start">
              <AlertCircle size={20} className="text-destructive mt-0.5 shrink-0" />
              <p className="text-cream/70 leading-relaxed">
                <strong className="text-cream">No enseñamos trading ni especulación.</strong>{" "}
                Enseñamos análisis fundamental: la misma metodología que usan los mejores inversores del mundo.
              </p>
            </div>
          </div>
        </SectionFade>
      </div>
    </section>

    {/* Curriculum */}
    <section className="py-20 md:py-28 bg-cream">
      <div className="container max-w-3xl">
        <SectionFade>
          <SectionTag>Programa de estudio</SectionTag>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-10">
            6 módulos. Todo lo esencial.
          </h2>
        </SectionFade>
        <SectionFade delay={0.1}>
          <Accordion type="single" collapsible className="space-y-3">
            {modules.map((m) => (
              <AccordionItem key={m.id} value={m.id} className="bg-background border border-border rounded-xl px-6 overflow-hidden">
                <AccordionTrigger className="text-left font-bold text-navy hover:no-underline py-5">
                  {m.title}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-slate leading-relaxed mb-2">{m.desc}</p>
                  <span className="font-mono text-xs text-green">{m.duration}</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionFade>
      </div>
    </section>

    {/* Format */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <SectionFade>
          <div className="text-center mb-12">
            <SectionTag>Formato</SectionTag>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
              Modalidad presencial + comunidad online
            </h2>
          </div>
        </SectionFade>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <SectionFade>
            <div className="bg-cream border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-green" />
                <h3 className="font-bold text-navy text-lg">Clases presenciales</h3>
              </div>
              <ul className="space-y-2 text-slate text-sm">
                <li>📍 Montevideo, Centro</li>
                <li>📅 Sábados, 10:00 – 12:00</li>
                <li>⏱️ 6 sesiones (1 por módulo)</li>
                <li>💰 100% gratuito</li>
              </ul>
            </div>
          </SectionFade>
          <SectionFade delay={0.1}>
            <div className="bg-cream border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Wifi size={20} className="text-green" />
                <h3 className="font-bold text-navy text-lg">Recursos online</h3>
              </div>
              <ul className="space-y-2 text-slate text-sm">
                <li>📹 Contenido grabado de cada clase</li>
                <li>📄 Material de lectura complementario</li>
                <li>💬 Comunidad de estudiantes</li>
                <li>📊 Plantillas de análisis</li>
              </ul>
            </div>
          </SectionFade>
        </div>
      </div>
    </section>

    {/* Who is this for */}
    <section className="py-20 md:py-28 bg-cream">
      <div className="container">
        <SectionFade>
          <div className="text-center mb-12">
            <SectionTag>¿Es para vos?</SectionTag>
          </div>
        </SectionFade>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <SectionFade>
            <div className="bg-background border border-green/20 rounded-2xl p-8">
              <CheckCircle2 size={24} className="text-green mb-4" />
              <h3 className="font-bold text-navy mb-3">Ideal si sos...</h3>
              <ul className="space-y-2 text-slate text-sm">
                <li>Estudiante de liceo (15–18 años)</li>
                <li>Curioso/a sobre inversiones</li>
                <li>Alguien sin experiencia previa</li>
                <li>De Montevideo o alrededores</li>
              </ul>
            </div>
          </SectionFade>
          <SectionFade delay={0.1}>
            <div className="bg-background border border-border rounded-2xl p-8">
              <CheckCircle2 size={24} className="text-green/50 mb-4" />
              <h3 className="font-bold text-navy mb-3">También si sos...</h3>
              <ul className="space-y-2 text-slate text-sm">
                <li>Estudiante universitario/a</li>
                <li>Joven profesional (18–25)</li>
                <li>Alguien que quiere entender finanzas</li>
                <li>De otro departamento (recursos online)</li>
              </ul>
            </div>
          </SectionFade>
          <SectionFade delay={0.2}>
            <div className="bg-background border border-destructive/20 rounded-2xl p-8">
              <XCircle size={24} className="text-destructive/50 mb-4" />
              <h3 className="font-bold text-navy mb-3">No es para vos si...</h3>
              <ul className="space-y-2 text-slate text-sm">
                <li>Buscás tips de trading</li>
                <li>Querés "hacerte rico rápido"</li>
                <li>Esperás señales de compra/venta</li>
                <li>Te interesa cripto o especulación</li>
              </ul>
            </div>
          </SectionFade>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28 bg-navy">
      <div className="container text-center">
        <SectionFade>
          <h2 className="text-3xl md:text-5xl font-extrabold text-cream max-w-2xl mx-auto mb-6 leading-tight">
            ¿Listo para aprender a invertir?
          </h2>
          <p className="text-cream/50 mb-10 text-lg">
            Tu lugar te está esperando. Es gratis, es presencial, es ahora.
          </p>
          <Button asChild variant="cta" size="cta">
            <Link to="/registro">Anotate gratis <ArrowRight size={18} /></Link>
          </Button>
        </SectionFade>
      </div>
    </section>
  </>
);

export default ProgramPage;

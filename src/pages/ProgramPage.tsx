import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

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
    <section className="pt-32 md:pt-40 pb-16">
      <div className="container">
        <SectionFade>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
            El programa
          </p>
          <h1 className="text-3xl md:text-5xl text-foreground max-w-4xl mb-8 leading-tight">
            Un programa diseñado para que entiendas el mercado de verdad
          </h1>
        </SectionFade>
        <SectionFade delay={0.1}>
          <div className="border border-border rounded-lg p-6 md:p-8 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">No enseñamos trading ni especulación.</strong>{" "}
              Enseñamos análisis fundamental: la misma metodología que usan los mejores inversores del mundo.
            </p>
          </div>
        </SectionFade>
      </div>
    </section>

    <section className="py-16 md:py-24 border-y border-border">
      <div className="container max-w-4xl">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Programa de estudio
        </p>
        <h2 className="text-3xl md:text-4xl text-foreground mb-10">
          6 módulos. Todo lo esencial.
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {modules.map((m) => (
            <AccordionItem key={m.id} value={m.id} className="border border-border rounded-lg px-6 overflow-hidden">
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5">
                {m.title}
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-muted-foreground leading-relaxed mb-2">{m.desc}</p>
                <span className="text-xs text-muted-foreground font-heading">{m.duration}</span>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Formato
        </p>
        <h2 className="text-3xl md:text-4xl text-foreground mb-10">
          Presencial + comunidad online
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
          <div className="bg-background p-8">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Clases presenciales</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>Montevideo, Centro</li>
              <li>Sábados, 10:00 – 12:00</li>
              <li>6 sesiones (1 por módulo)</li>
              <li>Sin costo</li>
            </ul>
          </div>
          <div className="bg-background p-8">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Recursos online</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>Contenido grabado de cada clase</li>
              <li>Material de lectura complementario</li>
              <li>Comunidad de estudiantes</li>
              <li>Plantillas de análisis</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 border-y border-border">
      <div className="container max-w-4xl">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          ¿Es para vos?
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border-l border-foreground pl-6">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-3">Ideal si sos...</h3>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>Estudiante de liceo (15–18 años)</li>
              <li>Curioso/a sobre inversiones</li>
              <li>Alguien sin experiencia previa</li>
              <li>De Montevideo o alrededores</li>
            </ul>
          </div>
          <div className="border-l border-border pl-6">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-3">También si sos...</h3>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>Estudiante universitario/a</li>
              <li>Joven profesional (18–25)</li>
              <li>Alguien que quiere entender finanzas</li>
              <li>De otro departamento (recursos online)</li>
            </ul>
          </div>
          <div className="border-l border-border pl-6">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-3">No es para vos si...</h3>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>Buscás tips de trading</li>
              <li>Querés "hacerte rico rápido"</li>
              <li>Esperás señales de compra/venta</li>
              <li>Te interesa cripto o especulación</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl text-foreground mb-6 leading-tight">
            ¿Listo para aprender a invertir?
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Tu lugar te está esperando.
          </p>
          <Button asChild variant="cta" size="cta">
            <Link to="/registro">Inscribite <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default ProgramPage;

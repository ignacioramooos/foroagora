import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const modules = [
  {
    id: "m1",
    title: "Módulo 1: Acciones y análisis fundamental",
    desc: "Cómo funcionan las clases presenciales y los recursos online. Qué es una acción, por qué representa una parte de una empresa, qué diferencia a una compañía pública de una privada y qué es una IPO. Introducimos el enfoque del curso: fundamental investing, inspirado en Warren Buffett y Peter Lynch, para evaluar empresas por activos, pasivos, ingresos y crecimiento futuro. También diferenciamos este enfoque del trading y del quantitative investing.",
    duration: "1h 20m · Presencial",
  },
  {
    id: "m2",
    title: "Módulo 2: Income Statement",
    desc: "Aprendemos a leer el estado de resultados línea por línea: ingresos, costos, gastos y ganancias. Vemos por qué la contabilidad prorratea ciertos gastos y qué significan amortización y depreciación con ejemplos simples, como un auto. La idea es entender qué nos dice este estado financiero sobre la rentabilidad de una empresa y por qué muchas veces se mueve con inercia.",
    duration: "1h 20m · Presencial",
  },
  {
    id: "m3",
    title: "Módulo 3: Cash Flow Statement",
    desc: "Vemos el flujo de caja, una de las partes que más buscan maximizar muchas empresas. Explicamos cash from operations, capex, free cash flow y net cash flow. Comparamos cómo se registra una inversión en el cash flow versus en el income statement, y usamos ejemplos como Amazon, Google y Apple si el tiempo lo permite.",
    duration: "1h 20m · Presencial",
  },
  {
    id: "m4",
    title: "Módulo 4: Balance Sheet y métricas de valuación",
    desc: "Estudiamos activos, pasivos y patrimonio, con énfasis en por qué el balance sheet es especialmente importante para bancos. Introducimos book value y las principales métricas para evaluar acciones: P/E, Forward P/E, P/FCF, P/B, PEG y CAGR. También vemos alertas como impuestos extraordinarios y psicología de mercado: comprar cuando otros tienen miedo.",
    duration: "1h 20m · Presencial",
  },
  {
    id: "m5",
    title: "Módulo 5: Margin of safety, ETFs y cierre",
    desc: "Integramos todo con el concepto de margin of safety: la diferencia entre el valor estimado de una empresa y el precio al que cotiza. Vemos cuándo tiene sentido ser compradores netos y cuándo el mercado puede estar pagando demasiado. Cerramos con conceptos extra: earnings calls, guidance, formatos de presentaciones, ETFs como SPY y VOO, las empresas más grandes del mundo y una instancia final de preguntas.",
    duration: "1h 20m · Presencial",
  },
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
          5 módulos. Todo lo esencial.
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
              <li>5 sesiones de 1h 20m</li>
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

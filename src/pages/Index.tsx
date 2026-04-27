import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import LiveStudentCounter from "@/components/LiveStudentCounter";
import CohortCountdown from "@/components/CohortCountdown";
import CapacityBar from "@/components/CapacityBar";
import CoreValues from "@/components/CoreValues";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

const testimonials = [
  "Las clases me abrieron la cabeza. Ahora entiendo temas que antes me parecían aburridos.",
  "Me ayudó a organizar mejor mi dinero y a pensar en grande.",
  "Lo mejor es que podemos preguntar, debatir y participar.",
];

const InjuLogo = () => (
  <div className="flex w-full items-center gap-8 md:justify-end" aria-label="INJU, Instituto Nacional de la Juventud">
    <div className="flex h-28 w-28 shrink-0 items-center justify-center bg-[#5f18ea] p-3">
      <span className="font-hand text-5xl font-bold leading-none text-white">Inju!</span>
    </div>
    <div className="font-heading text-foreground">
      <p className="text-4xl font-black leading-none tracking-normal md:text-5xl">INJU</p>
      <p className="mt-2 max-w-[24rem] text-base font-black uppercase leading-tight tracking-wide text-foreground/70 md:text-xl">Instituto Nacional de la Juventud</p>
      <p className="mt-1 text-base font-bold text-blue-pop md:text-xl">Uruguay</p>
    </div>
  </div>
);

const incomeStatementRows = [
  ["Ingresos", "14.5B", "+29%"],
  ["Costo de ventas", "7.7B", "+24%"],
  ["Ganancia bruta", "6.8B", "+36%"],
  ["Gastos operativos", "4.1B", "+18%"],
  ["Resultado operativo", "2.7B", "+78%"],
  ["Ganancia neta", "1.9B", "+71%"],
  ["Flujo de caja libre", "2.4B", "+43%"],
];

const StockTickerAnimation = () => (
  <div className="absolute inset-x-0 bottom-6 mx-auto h-[76%] w-[92%] overflow-hidden rounded-[2rem] border-2 border-blue-pop bg-[#0b0d10] shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.34),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(255,200,0,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />
    <div className="absolute inset-x-0 top-0 z-10 flex items-center border-b border-white/10 bg-black/20 px-5 py-4 text-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff4b16]" />
        <span className="h-3 w-3 rounded-full bg-[#ffc800]" />
        <span className="h-3 w-3 rounded-full bg-[#3b82f6]" />
      </div>
    </div>
    <div className="relative h-full px-5 pb-5 pt-20">
      <div className="meli-ticker-card absolute left-1/2 top-1/2 w-[72%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-white/[0.09] p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-4xl font-black leading-none text-white">MELI</p>
            <p className="mt-2 font-heading text-sm font-semibold leading-none text-white/55">MercadoLibre Inc.</p>
          </div>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 font-heading text-sm font-black text-emerald-300">+0.9%</span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/45">Precio</p>
            <p className="mt-1 font-heading text-2xl font-black leading-none text-white">USD 1,624</p>
          </div>
          <div className="flex h-16 w-32 items-end gap-2">
            {[28, 44, 36, 58, 50, 72, 64].map((height) => (
              <span key={height} className="stock-ticker-bar flex-1 rounded-t-full bg-blue-pop" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="income-window absolute inset-x-5 bottom-5 top-16 overflow-hidden rounded-3xl border border-white/15 bg-[#f8fbff] text-[#0b1320] shadow-2xl">
        <div className="relative z-10 flex items-center justify-between border-b border-black/10 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="font-heading text-sm font-black leading-none text-[#0b1320]">Estado de resultados de MELI</p>
            <p className="mt-1 font-heading text-xs font-semibold leading-none text-[#0b1320]/55">Resultados anuales · USD</p>
          </div>
          <span className="income-close flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1320] font-heading text-sm font-black leading-none text-white">×</span>
        </div>
        <div className="income-scroll relative z-0 px-4 py-3">
          {incomeStatementRows.map(([label, value, change]) => (
            <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-black/10 py-3 font-heading">
              <span className="text-sm font-bold text-[#0b1320]">{label}</span>
              <span className="text-sm font-black text-[#0b1320]">{value}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">{change}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="stock-cursor" aria-hidden="true" />
    </div>
  </div>
);

const Hero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 30) setShowScrollHint(false);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 md:pt-32 pb-10 md:pb-12">
      <div className="container relative">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 items-center">
          <div className="relative z-10">
            <SectionFade>
              <p className="font-hand text-3xl md:text-4xl text-blue-pop mb-4">Educación financiera accesible</p>
              <h1 className="max-w-3xl text-5xl md:text-6xl lg:text-[4.6rem] font-black leading-[0.92] tracking-normal text-foreground mb-7">
                Aprendé a analizar empresas e invertir con criterio propio, <strong className="font-black">gratis.</strong>
              </h1>
            </SectionFade>
            <SectionFade delay={0.1}>
              <p className="text-base md:text-lg text-foreground/70 max-w-xl mb-8">
                Clases presenciales de análisis fundamental para estudiantes en Uruguay. Sin costos. Sin trading. Sin experiencia previa.
              </p>
            </SectionFade>
            <SectionFade delay={0.12}>
              <div className="mb-8 max-w-md">
                <LiveStudentCounter />
              </div>
            </SectionFade>
            <SectionFade delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Button asChild variant="cta" size="cta">
                  <Link to="/registro">
                    Inscribite ahora
                    <ArrowRight size={17} />
                  </Link>
                </Button>
                <Link to="/programa" className="group inline-flex w-fit items-center gap-2 rounded-full bg-blue-pop px-5 py-3 text-sm font-heading font-bold text-white transition-colors hover:bg-blue-pop/90">
                  Ver programa
                  <ArrowRight size={17} />
                </Link>
              </div>
            </SectionFade>
          </div>

          <SectionFade delay={0.2}>
            <div className="relative min-h-[420px] md:min-h-[500px]">
              <div className="absolute left-8 right-0 top-6 h-[70%] rounded-[52%] bg-sun" />
              <div className="absolute -right-5 top-2 h-24 w-32 rounded-[50%] border-[14px] border-blue-pop border-l-transparent border-b-transparent rotate-[-22deg]" />
              <div className="absolute left-2 top-14 flex gap-3 text-orange-pop">
                <span className="h-14 w-2 rotate-[-28deg] rounded-full bg-current" />
                <span className="h-10 w-2 rotate-[-12deg] rounded-full bg-current" />
                <span className="h-8 w-2 rotate-[18deg] rounded-full bg-current" />
              </div>
              <StockTickerAnimation />
              <div className="absolute bottom-0 left-8 rounded-full bg-blue-pop px-6 py-5 text-center text-sm font-heading font-black uppercase leading-tight text-white shadow-xl rotate-[-8deg]">
                Para estudiantes
                <br />
                de Uruguay
              </div>
            </div>
          </SectionFade>
        </div>
      </div>

      {showScrollHint && <div className="absolute bottom-5 left-1/2 h-9 w-5 -translate-x-1/2 rounded-full border-2 border-foreground/30" />}
    </section>
  );
};

const ProblemSection = () => (
  <section className="relative overflow-hidden bg-blue-soft py-16 md:py-24">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-hand text-3xl text-blue-pop">El problema</p>
          <h2 className="mt-2 max-w-xl text-4xl md:text-5xl font-black leading-tight">
            Nadie nos enseña sobre dinero
          </h2>
          <div className="mt-6 space-y-4 text-lg text-foreground/70">
            <p>
              En Uruguay, el sistema educativo no incluye finanzas personales ni inversiones. Los jóvenes llegan a la adultez sin saber leer un estado financiero, evaluar una inversión, o entender cómo funciona el mercado de valores.
            </p>
            <p>No es por falta de interés. Es por falta de acceso.</p>
          </div>
          <div className="mt-8 h-2 w-40 rounded-full bg-blue-pop" />
        </div>
        <div className="relative">
          <div className="absolute -left-8 bottom-10 h-20 w-20 rounded-full bg-sun" />
          <div className="relative rounded-[2rem] border-2 border-foreground bg-card p-8 shadow-[10px_10px_0_#ffc800]">
            <span className="block font-heading text-7xl md:text-8xl font-black text-foreground">80%</span>
            <p className="mt-3 max-w-md text-lg text-foreground/70">
              de los jóvenes en Latinoamérica nunca recibió educación financiera formal.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ValueProp = () => (
  <section className="relative bg-background py-16 md:py-24">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="font-hand text-3xl text-blue-pop">Qué enseñamos</p>
          <h2 className="mt-2 max-w-lg text-4xl md:text-5xl font-black leading-tight">
            Habilidades financieras reales, no atajos
          </h2>
          <p className="mt-5 text-lg text-foreground/70">
            No enseñamos trading. Enseñamos a pensar como inversores: a leer estados financieros, evaluar empresas, y tomar decisiones con criterio propio.
          </p>
          <Button asChild variant="cta-outline" size="cta" className="mt-8">
            <Link to="/programa">
              Ver programa completo
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Análisis fundamental",
              desc: "Aprendé a leer los estados financieros de cualquier empresa del mundo.",
            },
            {
              num: "02",
              title: "Valoración de empresas",
              desc: "Entendé si una acción está cara o barata, con criterio propio.",
            },
            {
              num: "03",
              title: "Decisiones inteligentes",
              desc: "Evaluá oportunidades de inversión con la misma metodología que los profesionales.",
            },
          ].map((item) => (
            <div key={item.num} className="bg-card p-7">
              <span className="font-hand text-4xl text-orange-pop">{item.num}</span>
              <h3 className="mt-3 font-heading text-xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm text-foreground/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const OurValues = () => (
  <section className="relative py-16 md:py-24 overflow-hidden bg-background">
    <div className="container">
      <SectionFade>
        <p className="font-hand text-3xl text-orange-pop">Nuestros principios</p>
        <h2 className="mt-2 text-4xl md:text-5xl font-black leading-tight">
          Educamos hoy para transformar el mañana
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mt-4 mb-12">
          Cada decisión que tomamos está guiada por nuestros valores fundamentales, que reflejan nuestro compromiso con la educación de calidad y el impacto real.
        </p>
      </SectionFade>

      <SectionFade delay={0.1}>
        <CoreValues />
      </SectionFade>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="font-hand text-3xl text-blue-pop">Cómo funciona</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-black">Cuatro pasos</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { step: "01", title: "Inscribite", desc: "Completá el formulario de inscripción en 2 minutos." },
            { step: "02", title: "Asistí", desc: "Vení a clases presenciales en Montevideo." },
            { step: "03", title: "Aprendé", desc: "Accedé a recursos online y nuestra comunidad." },
            { step: "04", title: "Decidí", desc: "Tomá decisiones financieras con criterio propio." },
          ].map((s) => (
            <div key={s.step} className="rounded-[1.25rem] border border-border bg-card p-6 shadow-sm">
              <span className="font-hand text-4xl text-orange-pop">{s.step}</span>
              <h3 className="mt-3 font-heading text-xl font-black">{s.title}</h3>
              <p className="mt-2 text-foreground/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">Lo que dicen nuestros estudiantes</h2>
          <div className="mt-3 h-2 w-40 rounded-full bg-sun" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((quote, index) => (
            <blockquote key={quote} className="rounded-[1.25rem] border border-border bg-card p-6 shadow-[0_14px_50px_rgba(0,0,0,0.08)]">
              <span className="font-hand text-5xl leading-none text-blue-pop">“</span>
              <p className="mt-1 text-sm text-foreground/75">{quote}</p>
              <footer className="mt-6 font-heading text-sm font-bold text-foreground">Estudiante {index + 1}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PartnersStrip = () => (
  <section className="border-y border-border bg-background py-12 md:py-14">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-[0.45fr_1.55fr] md:items-center">
        <div>
          <h2 className="text-2xl font-black leading-tight">Apoyado por:</h2>
          <div className="mt-2 h-2 w-32 rounded-full bg-blue-pop" />
        </div>
        <div className="flex justify-start md:justify-end">
          <InjuLogo />
        </div>
      </div>
    </div>
  </section>
);

const UpcomingClasses = () => {
  const [cohort, setCohort] = useState<{ start_date: string; location: string; max_capacity: number } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("cohorts")
        .select("start_date, location, max_capacity")
        .eq("is_active", true)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(1);
      if (data && data.length > 0) setCohort(data[0]);
    };
    fetch();
  }, []);

  if (!cohort) return null;

  const startDate = new Date(cohort.start_date);
  const dateStr = startDate.toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="py-16 md:py-24 bg-blue-soft">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <p className="font-hand text-3xl text-blue-pop">Próximas clases</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-black">Próxima clase</h2>
            <p className="text-foreground/70 text-lg leading-relaxed mt-4 mb-6">
              Las clases son presenciales, en grupos reducidos.
            </p>
            <CohortCountdown />
          </div>
          <div className="rounded-[1.5rem] border-2 border-foreground bg-card p-8 shadow-[10px_10px_0_#ffc800]">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-foreground/70">
                <MapPin size={16} className="shrink-0 text-blue-pop" />
                <span>{cohort.location}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <Calendar size={16} className="shrink-0 text-orange-pop" />
                <span className="capitalize">{dateStr}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <Users size={16} className="shrink-0 text-blue-pop" />
                <span>{cohort.max_capacity} lugares</span>
              </div>
            </div>
            <div className="mb-6">
              <CapacityBar />
            </div>
            <Button asChild variant="cta" size="cta" className="w-full">
              <Link to="/registro">Inscribite</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="relative overflow-hidden bg-sun py-14 md:py-20">
    <div className="absolute left-0 top-10 h-24 w-36 rounded-[50%] border-[14px] border-blue-pop border-r-transparent border-b-transparent rotate-[-10deg]" />
    <div className="container relative">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="max-w-3xl text-4xl md:text-5xl font-black leading-tight">
            Sumate a una comunidad que aprende, comparte y transforma.
          </h2>
          <p className="mt-4 text-lg text-foreground/75">
            No se necesitan conocimientos previos. Solo ganas de aprender y crecer.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild variant="default" size="cta" className="bg-foreground text-background hover:bg-foreground/80">
            <Link to="/registro">
              Quiero participar
              <ArrowRight size={17} />
            </Link>
          </Button>
          <p className="font-hand text-3xl text-foreground">¡Te esperamos!</p>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => (
  <>
    <Hero />
    <PartnersStrip />
    <ProblemSection />
    <ValueProp />
    <OurValues />
    <HowItWorks />
    <Testimonials />
    <UpcomingClasses />
    <FinalCTA />
  </>
);

export default Index;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import LiveStudentCounter from "@/components/LiveStudentCounter";
import CohortCountdown from "@/components/CohortCountdown";
import CapacityBar from "@/components/CapacityBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import CoreValues from "@/components/CoreValues";
import StoneTrail from "@/components/StoneTrail";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, MapPin, Calendar, Users, ChevronDown, Sparkles } from "lucide-react";

const Hero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 30) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-secondary-cyan/15 rounded-full blur-2xl" />
      </div>

      <div className="container">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
          <div>
            <SectionFade>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-blue/10 border border-primary-blue/20 mb-6">
                <Sparkles size={14} className="text-primary-blue" />
                <span className="text-xs font-heading font-semibold text-primary-blue">Educación financiera accesible</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[0.95] max-w-4xl mb-8">
                Aprendé a analizar empresas e invertir con criterio propio, <span className="bg-gradient-to-r from-primary-blue to-secondary-cyan bg-clip-text text-transparent">Gratis</span>.
              </h1>
            </SectionFade>
            <SectionFade delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Clases presenciales de análisis fundamental para estudiantes en Uruguay. Sin costos. Sin trading. Sin experiencia previa.
              </p>
            </SectionFade>
            <SectionFade delay={0.12}>
              <div className="mb-12">
                <LiveStudentCounter />
              </div>
            </SectionFade>
            <SectionFade delay={0.15}>
              <Button asChild variant="cta" size="cta" className="bg-primary-blue hover:bg-blue-700">
                <Link to="/registro" className="gap-2">
                  Inscribite ahora
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </SectionFade>
          </div>
          <SectionFade delay={0.2}>
            <div className="hidden md:block relative w-[14rem] lg:w-[18rem] h-[28rem] lg:h-[36rem] pointer-events-none">
              <StoneTrail className="w-full h-full object-contain" />
            </div>
          </SectionFade>
        </div>
      </div>

      {showScrollHint && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={20} className="text-foreground" />
        </div>
      )}
    </section>
  );
};

const ProblemSection = () => (
  <section className="py-14 md:py-20 relative">
    <div className="container">
      <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-start">
        <div className="md:col-span-2">
          <div className="border border-border rounded-lg p-10 bg-card hover:shadow-md transition-all">
            <span className="text-6xl md:text-7xl font-heading font-semibold text-primary-blue leading-none block mb-3">
              80%
            </span>
            <p className="text-muted-foreground text-base">
              de los jóvenes en Latinoamérica nunca recibió educación financiera formal.
            </p>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            El problema
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-8">
            Nadie nos enseña sobre dinero
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              En Uruguay, el sistema educativo no incluye finanzas personales ni inversiones.
              Los jóvenes llegan a la adultez sin saber leer un estado financiero,
              evaluar una inversión, o entender cómo funciona el mercado de valores.
            </p>
            <p>
              No es por falta de interés. Es por falta de acceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ValueProp = () => (
  <section className="py-16 md:py-24 border-y border-border">
    <div className="container">
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Qué enseñamos
      </p>
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl text-foreground mb-6">
            Habilidades financieras reales, no atajos
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            No enseñamos trading. Enseñamos a pensar como inversores — 
            a leer estados financieros, evaluar empresas, y tomar decisiones con criterio propio.
          </p>
          <Button asChild variant="cta-outline" size="cta">
            <Link to="/programa">Ver programa completo <ArrowRight size={16} /></Link>
          </Button>
        </div>

        <div className="space-y-0 divide-y divide-border">
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
            <div key={item.num} className="py-6 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <span className="text-xs text-muted-foreground font-heading font-medium mt-1.5">{item.num}</span>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const OurValues = () => (
  <section className="relative py-16 md:py-24 overflow-hidden">
    <div className="absolute inset-0 -z-10 opacity-50">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/15 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-cyan/15 rounded-full blur-2xl" />
    </div>

    <div className="container">
      <SectionFade>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary-blue" />
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground">
            Nuestros principios
          </p>
        </div>
        <h2 className="text-3xl md:text-4xl text-foreground mb-4">
          Educamos hoy para transformar el mañana
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-12">
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
  <section className="py-14 md:py-20">
    <div className="container max-w-4xl">
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Cómo funciona
      </p>
      <h2 className="text-3xl md:text-4xl text-foreground mb-10">
        Cuatro pasos
      </h2>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
        {[
          { step: "01", title: "Inscribite", desc: "Completá el formulario de inscripción en 2 minutos." },
          { step: "02", title: "Asistí", desc: "Vení a clases presenciales en Montevideo." },
          { step: "03", title: "Aprendé", desc: "Accedé a recursos online y nuestra comunidad." },
          { step: "04", title: "Decidí", desc: "Tomá decisiones financieras con criterio propio." },
        ].map((s) => (
          <div key={s.step} className="flex gap-6 py-5 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground/40 font-heading font-medium w-8 shrink-0 pt-0.5">
              {s.step}
            </span>
            <div>
              <h3 className="font-heading font-semibold text-foreground text-xl mb-1">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
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
    <section className="py-16 md:py-24 border-y border-border">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Próximas clases
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground mb-6">
              Próxima cohorte
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Las clases son presenciales, en grupos reducidos.
            </p>
            <CohortCountdown />
          </div>
          <div className="border border-border rounded-lg p-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={16} className="shrink-0" />
                <span>{cohort.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar size={16} className="shrink-0" />
                <span className="capitalize">{dateStr}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users size={16} className="shrink-0" />
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
  <section className="relative py-16 md:py-24 border-t border-border overflow-hidden">
    <div className="absolute inset-0 -z-10 opacity-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-blue/15 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-cyan/15 rounded-full blur-2xl" />
    </div>

    <div className="container">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl text-foreground leading-tight mb-6">
          El mejor momento para aprender a invertir era ayer.
          <br />
          <span className="bg-gradient-to-r from-primary-blue to-secondary-cyan bg-clip-text text-transparent">
            El segundo mejor es hoy.
          </span>
        </h2>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild variant="cta" size="cta" className="bg-primary-blue hover:bg-blue-700">
            <Link to="/registro" className="gap-2">
              Empezá acá
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="cta">
            <Link to="/impacto">
              Ver impacto
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => (
  <>
    <Hero />
    <ProblemSection />
    <ValueProp />
    <OurValues />
    <HowItWorks />
    <UpcomingClasses />
    <FinalCTA />
  </>
);

export default Index;

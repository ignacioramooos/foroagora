import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import AnimatedCounter from "@/components/AnimatedCounter";
import { ArrowRight, MapPin, Calendar, Users, Clock } from "lucide-react";

const Hero = () => (
  <section className="min-h-[88vh] flex items-center">
    <div className="container py-32 md:py-40">
      <SectionFade>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[0.95] max-w-4xl mb-8">
          Aprendé a analizar empresas e invertir con criterio propio
        </h1>
      </SectionFade>
      <SectionFade delay={0.1}>
        <p className="text-lg text-muted-foreground max-w-lg mb-12 leading-relaxed">
          Clases presenciales de análisis fundamental para estudiantes en Uruguay. Sin costos. Sin trading. Sin experiencia previa.
        </p>
      </SectionFade>
      <SectionFade delay={0.15}>
        <Button asChild variant="cta" size="cta">
          <Link to="/registro">Inscribite</Link>
        </Button>
      </SectionFade>
    </div>
  </section>
);

const SocialProof = () => (
  <section className="border-y border-border">
    <div className="container py-8">
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
        {[
          { value: 150, suffix: "+", label: "estudiantes" },
          { value: 24, label: "clases dictadas" },
          { value: 96, suffix: "%", label: "lo recomiendan" },
        ].map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-semibold text-foreground">
              <AnimatedCounter end={s.value} suffix={s.suffix} />
            </span>
            <span className="text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-24 md:py-32">
    <div className="container">
      <div className="grid md:grid-cols-5 gap-16 items-start">
        <div className="md:col-span-2">
          <div className="border border-border rounded-lg p-10">
            <span className="text-6xl md:text-7xl font-heading font-semibold text-foreground leading-none block mb-3">
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
  <section className="py-24 md:py-32 border-y border-border">
    <div className="container">
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Qué enseñamos
      </p>
      <div className="grid md:grid-cols-2 gap-16 items-start">
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

const HowItWorks = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-3xl">
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Cómo funciona
      </p>
      <h2 className="text-3xl md:text-4xl text-foreground mb-12">
        Cuatro pasos
      </h2>
      <div className="space-y-0">
        {[
          { step: "01", title: "Inscribite", desc: "Completá el formulario de inscripción en 2 minutos." },
          { step: "02", title: "Asistí", desc: "Vení a clases presenciales en Montevideo." },
          { step: "03", title: "Aprendé", desc: "Accedé a recursos online y nuestra comunidad." },
          { step: "04", title: "Decidí", desc: "Tomá decisiones financieras con criterio propio." },
        ].map((s) => (
          <div key={s.step} className="flex gap-6 md:gap-8 py-6 border-b border-border last:border-0">
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

const UpcomingClasses = () => (
  <section className="py-24 md:py-32 border-y border-border">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Próximas clases
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-6">
            Próxima cohorte
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Las clases son presenciales, en grupos reducidos.
          </p>
        </div>
        <div className="border border-border rounded-lg p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin size={16} className="shrink-0" />
              <span>Montevideo, Centro</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar size={16} className="shrink-0" />
              <span>Sábados, Mayo 2025</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock size={16} className="shrink-0" />
              <span>10:00 – 12:00</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Users size={16} className="shrink-0" />
              <span>25 lugares disponibles</span>
            </div>
          </div>
          <Button asChild variant="cta" size="cta" className="w-full">
            <Link to="/registro">Ver inscripción</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-3xl">
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Testimonios
      </p>
      <h2 className="text-3xl md:text-4xl text-foreground mb-16">
        Lo que dicen nuestros estudiantes
      </h2>
      <div className="space-y-12">
        {[
          { name: "Valentina R.", age: "17 años, Liceo 7", quote: "Nunca pensé que iba a entender un balance general. Ahora puedo analizar empresas con mis propios criterios." },
          { name: "Martín G.", age: "16 años, Liceo Francés", quote: "Me encantó que no nos hablen de hacernos ricos rápido. Aprendí a pensar a largo plazo." },
          { name: "Camila S.", age: "18 años, UTU", quote: "Las clases son claras, los profes tienen nuestra edad y eso hace que todo sea más cercano." },
        ].map((t) => (
          <blockquote key={t.name} className="border-l border-border pl-8">
            <p className="text-foreground text-xl md:text-2xl font-heading font-medium leading-snug mb-4">
              "{t.quote}"
            </p>
            <footer className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">{t.name}</strong> — {t.age}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-24 md:py-32 border-t border-border">
    <div className="container">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-5xl text-foreground leading-tight mb-6">
          El mejor momento para aprender a invertir era ayer.
          El segundo mejor es hoy.
        </h2>
        <div className="mt-10">
          <Button asChild variant="cta" size="cta">
            <Link to="/registro">Empezá acá</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => (
  <>
    <Hero />
    <SocialProof />
    <ProblemSection />
    <ValueProp />
    <HowItWorks />
    <UpcomingClasses />
    <Testimonials />
    <FinalCTA />
  </>
);

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import SectionTag from "@/components/SectionTag";
import AnimatedCounter from "@/components/AnimatedCounter";
import { BarChart3, FileText, Brain, ArrowRight, MapPin, Calendar, Users, Clock, Quote } from "lucide-react";

const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-navy" />
    {/* Decorative grid lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cream" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Abstract chart decoration */}
    <svg className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-[0.05]" viewBox="0 0 400 300">
      <polyline points="0,280 50,240 100,260 150,180 200,200 250,120 300,140 350,60 400,80" fill="none" stroke="#22D07A" strokeWidth="2" />
      <polyline points="0,290 50,270 100,250 150,230 200,190 250,170 300,130 350,100 400,110" fill="none" stroke="#F8F7F2" strokeWidth="1" />
    </svg>
  </div>
);

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center">
    <HeroBackground />
    <div className="container relative z-10 py-32 md:py-40">
      <SectionFade>
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-green font-medium mb-6">
          100% Gratuito · Sin fines de lucro
        </span>
      </SectionFade>
      <SectionFade delay={0.1}>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-cream leading-[1.05] max-w-4xl mb-6 text-balance">
          Aprendé a invertir.{" "}
          <span className="text-green">Gratis.</span> Ahora.
        </h1>
      </SectionFade>
      <SectionFade delay={0.2}>
        <p className="text-lg md:text-xl text-cream/60 max-w-2xl mb-10 leading-relaxed">
          Clases presenciales gratuitas de análisis de empresas para estudiantes.
          Sin costos, sin trading, sin excusas.
        </p>
      </SectionFade>
      <SectionFade delay={0.3}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="cta" size="cta">
            <Link to="/registro">Anotate gratis</Link>
          </Button>
          <Button asChild variant="ghost" size="cta" className="text-cream/70 hover:text-green hover:bg-transparent">
            <Link to="/programa">
              Ver el programa <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </SectionFade>
    </div>
  </section>
);

const SocialProof = () => (
  <section className="bg-cream border-y border-border">
    <div className="container py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: 150, suffix: "+", label: "Estudiantes inscriptos" },
          { value: 24, label: "Clases dictadas" },
          { value: 96, suffix: "%", label: "Recomendarían el programa" },
          { value: 100, suffix: "%", label: "Gratuito", prefix: "" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-4xl font-extrabold text-navy mb-1">
              <AnimatedCounter end={s.value} suffix={s.suffix} prefix={s.prefix} />
            </div>
            <div className="text-sm text-slate">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-20 md:py-28 bg-cream">
    <div className="container">
      <SectionFade>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-navy rounded-2xl p-8 md:p-12">
            <span className="text-5xl md:text-6xl font-extrabold text-green leading-none block mb-4">
              80%
            </span>
            <p className="text-cream/70 text-lg">
              de los jóvenes en Latinoamérica nunca recibió educación financiera formal.
            </p>
          </div>
          <div>
            <SectionTag>El problema</SectionTag>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-6">
              Nadie nos enseña sobre dinero
            </h2>
            <p className="text-slate text-lg leading-relaxed mb-4">
              En Uruguay, el sistema educativo no incluye finanzas personales ni inversiones.
              Los jóvenes llegan a la adultez sin saber leer un estado financiero,
              evaluar una inversión, o entender cómo funciona el mercado de valores.
            </p>
            <p className="text-slate text-lg leading-relaxed">
              No es por falta de interés. Es por falta de acceso. Nosotros cambiamos eso.
            </p>
          </div>
        </div>
      </SectionFade>
    </div>
  </section>
);

const ValueProp = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container">
      <SectionFade>
        <div className="text-center mb-16">
          <SectionTag>Qué enseñamos</SectionTag>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy max-w-2xl mx-auto">
            Habilidades financieras reales, no atajos
          </h2>
        </div>
      </SectionFade>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: BarChart3,
            title: "Análisis fundamental",
            desc: "Aprendé a leer los estados financieros de cualquier empresa del mundo.",
          },
          {
            icon: FileText,
            title: "Valoración de empresas",
            desc: "Entendé si una acción está cara o barata, con criterio propio.",
          },
          {
            icon: Brain,
            title: "Decisiones inteligentes",
            desc: "No te enseñamos a hacer trading. Te enseñamos a pensar como inversores reales.",
          },
        ].map((card, i) => (
          <SectionFade key={card.title} delay={i * 0.1}>
            <div className="bg-cream border border-border rounded-2xl p-8 h-full hover:border-green/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center mb-6 group-hover:bg-green/20 transition-colors">
                <card.icon size={24} className="text-green" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{card.title}</h3>
              <p className="text-slate leading-relaxed">{card.desc}</p>
            </div>
          </SectionFade>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-20 md:py-28 bg-cream">
    <div className="container">
      <SectionFade>
        <div className="text-center mb-16">
          <SectionTag>Cómo funciona</SectionTag>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
            Cuatro pasos. Cero complicaciones.
          </h2>
        </div>
      </SectionFade>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { step: "01", title: "Anotate", desc: "Completá el formulario de inscripción en 2 minutos." },
          { step: "02", title: "Asistí", desc: "Vení a clases presenciales gratuitas en Montevideo." },
          { step: "03", title: "Aprendé", desc: "Accedé a recursos online y nuestra comunidad." },
          { step: "04", title: "Decidí", desc: "Tomá decisiones financieras con criterio propio." },
        ].map((s, i) => (
          <SectionFade key={s.step} delay={i * 0.1}>
            <div className="relative">
              <span className="font-mono text-5xl font-extrabold text-green/15 block mb-2">{s.step}</span>
              <h3 className="text-lg font-bold text-navy mb-2">{s.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{s.desc}</p>
            </div>
          </SectionFade>
        ))}
      </div>
      <SectionFade delay={0.4}>
        <div className="text-center mt-12">
          <Button asChild variant="cta" size="cta">
            <Link to="/registro">Empezar ahora <ArrowRight size={18} /></Link>
          </Button>
        </div>
      </SectionFade>
    </div>
  </section>
);

const UpcomingClasses = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container">
      <SectionFade>
        <div className="text-center mb-12">
          <SectionTag>Próximas clases</SectionTag>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
            Reservá tu lugar
          </h2>
        </div>
      </SectionFade>
      <SectionFade delay={0.1}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-cream border border-border rounded-2xl p-8 relative overflow-hidden">
            <span className="absolute top-4 right-4 bg-destructive/10 text-destructive text-xs font-bold font-mono px-3 py-1 rounded-full">
              Cupos limitados
            </span>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-navy">
                <MapPin size={18} className="text-green" />
                <span className="font-medium">Montevideo, Centro</span>
              </div>
              <div className="flex items-center gap-3 text-navy">
                <Calendar size={18} className="text-green" />
                <span className="font-medium">Sábados, Mayo 2025</span>
              </div>
              <div className="flex items-center gap-3 text-navy">
                <Clock size={18} className="text-green" />
                <span className="font-medium">10:00 – 12:00</span>
              </div>
              <div className="flex items-center gap-3 text-navy">
                <Users size={18} className="text-green" />
                <span className="font-medium">25 lugares disponibles</span>
              </div>
            </div>
            <Button asChild variant="cta" size="cta" className="w-full">
              <Link to="/registro">Reservar mi lugar</Link>
            </Button>
          </div>
        </div>
      </SectionFade>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-20 md:py-28 bg-cream">
    <div className="container">
      <SectionFade>
        <div className="text-center mb-12">
          <SectionTag>Testimonios</SectionTag>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
            Lo que dicen nuestros estudiantes
          </h2>
        </div>
      </SectionFade>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Valentina R.", age: "17 años, Liceo 7", quote: "Nunca pensé que iba a entender un balance general. Ahora puedo analizar empresas con mis propios criterios." },
          { name: "Martín G.", age: "16 años, Liceo Francés", quote: "Me encantó que no nos hablen de hacernos ricos rápido. Aprendí a pensar a largo plazo." },
          { name: "Camila S.", age: "18 años, UTU", quote: "Las clases son claras, los profes tienen nuestra edad y eso hace que todo sea más cercano." },
        ].map((t, i) => (
          <SectionFade key={t.name} delay={i * 0.1}>
            <div className="bg-background border border-border rounded-2xl p-8 h-full flex flex-col">
              <Quote size={24} className="text-green/30 mb-4" />
              <p className="text-navy font-medium leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div>
                <div className="font-bold text-navy text-sm">{t.name}</div>
                <div className="text-slate text-sm">{t.age}</div>
              </div>
            </div>
          </SectionFade>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="relative py-20 md:py-28">
    <div className="absolute inset-0 bg-navy" />
    <div className="container relative z-10 text-center">
      <SectionFade>
        <h2 className="text-3xl md:text-5xl font-extrabold text-cream max-w-3xl mx-auto mb-6 leading-tight text-balance">
          El mejor momento para aprender a invertir era ayer.
          <span className="text-green"> El segundo mejor es hoy.</span>
        </h2>
        <p className="text-cream/50 mb-10 text-lg">
          Sin tarjeta de crédito. Sin compromisos. Solo querés aprender.
        </p>
        <Button asChild variant="cta" size="cta">
          <Link to="/registro">Anotate ahora — es gratis</Link>
        </Button>
      </SectionFade>
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

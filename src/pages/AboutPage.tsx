import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import SectionTag from "@/components/SectionTag";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Heart, BookOpen, Users, Globe, Linkedin } from "lucide-react";

const team = [
  { name: "Santiago Pérez", role: "Fundador & Director", bio: "Estudiante de Economía, UdelaR. Apasionado por democratizar las finanzas." },
  { name: "Lucía Fernández", role: "Coordinadora Académica", bio: "Estudiante de Contabilidad. Traduce estados financieros a lenguaje humano." },
  { name: "Mateo Rodríguez", role: "Instructor Principal", bio: "Estudiante de Ingeniería. Fan del análisis fundamental y los modelos DCF." },
  { name: "Isabella García", role: "Comunicación & Redes", bio: "Estudiante de Comunicación. Convierte conceptos financieros en contenido accesible." },
  { name: "Tomás Silva", role: "Instructor", bio: "Estudiante de Administración. Especialista en lectura de balances." },
  { name: "Valentina López", role: "Operaciones", bio: "Estudiante de Derecho. Gestiona alianzas institucionales y logística." },
];

const AboutPage = () => (
  <>
    {/* Mission */}
    <section className="pt-32 md:pt-40 pb-20 bg-navy">
      <div className="container text-center">
        <SectionFade>
          <SectionTag>Nuestra misión</SectionTag>
          <h1 className="text-3xl md:text-5xl font-extrabold text-cream max-w-3xl mx-auto mb-8 text-balance leading-tight">
            Que cada joven en Uruguay pueda tomar decisiones financieras con criterio propio.
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Somos un grupo de jóvenes voluntarios que creemos que la educación financiera
            no debería ser un privilegio. Por eso enseñamos análisis fundamental — gratis,
            presencial y en tu idioma.
          </p>
        </SectionFade>
      </div>
    </section>

    {/* Our Story */}
    <section className="py-20 md:py-28 bg-cream">
      <div className="container">
        <SectionFade>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTag>Nuestra historia</SectionTag>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-6">
                Empezamos porque nadie más lo hacía
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-4">
                En 2024, un grupo de estudiantes universitarios en Montevideo se dieron cuenta de que
                sabían más de derivadas que de finanzas personales. Y que sus compañeros de liceo
                estaban aún peor.
              </p>
              <p className="text-slate text-lg leading-relaxed mb-4">
                Decidieron armar clases gratuitas de análisis fundamental — la misma metodología que
                usan inversores como Warren Buffett — adaptada para estudiantes de liceo sin
                experiencia previa.
              </p>
              <p className="text-slate text-lg leading-relaxed">
                Lo que empezó como un taller en un salón prestado se convirtió en un movimiento.
                Hoy somos un equipo de voluntarios comprometidos con cerrar la brecha de
                educación financiera en Uruguay.
              </p>
            </div>
            <div className="bg-navy rounded-2xl aspect-[4/3] flex items-center justify-center">
              <span className="text-cream/20 font-mono text-sm">[Foto del equipo]</span>
            </div>
          </div>
        </SectionFade>
      </div>
    </section>

    {/* Team */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <SectionFade>
          <div className="text-center mb-16">
            <SectionTag>El equipo</SectionTag>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
              Jóvenes que enseñan a jóvenes
            </h2>
          </div>
        </SectionFade>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <SectionFade key={m.name} delay={i * 0.05}>
              <div className="bg-cream border border-border rounded-2xl p-6 hover:border-green/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-navy/10 mb-4 flex items-center justify-center">
                  <span className="font-bold text-navy text-lg">{m.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <h3 className="font-bold text-navy text-lg">{m.name}</h3>
                <span className="text-green text-sm font-medium font-mono">{m.role}</span>
                <p className="text-slate text-sm mt-3 leading-relaxed">{m.bio}</p>
                <a href="#" className="inline-flex items-center gap-1 text-slate/50 hover:text-green text-sm mt-3 transition-colors">
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </SectionFade>
          ))}
        </div>
        <SectionFade delay={0.3}>
          <div className="text-center mt-12">
            <Button asChild variant="cta-outline" size="cta">
              <Link to="/contacto">Sumarte al equipo</Link>
            </Button>
          </div>
        </SectionFade>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 md:py-28 bg-cream">
      <div className="container">
        <SectionFade>
          <div className="text-center mb-16">
            <SectionTag>Nuestros valores</SectionTag>
          </div>
        </SectionFade>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Globe, title: "Acceso universal", desc: "La educación financiera es un derecho, no un privilegio." },
            { icon: BookOpen, title: "Rigor intelectual", desc: "Enseñamos con la misma seriedad que una universidad, pero sin barreras." },
            { icon: Users, title: "Comunidad", desc: "Aprender juntos es más poderoso que aprender solo." },
            { icon: Heart, title: "Impacto local", desc: "Empezamos en Montevideo, con la visión de llegar a todo Uruguay." },
          ].map((v, i) => (
            <SectionFade key={v.title} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-green" />
                </div>
                <h3 className="font-bold text-navy mb-2">{v.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{v.desc}</p>
              </div>
            </SectionFade>
          ))}
        </div>
      </div>
    </section>

    {/* Impact */}
    <section className="py-20 md:py-28 bg-navy">
      <div className="container">
        <SectionFade>
          <div className="text-center mb-12">
            <SectionTag>Nuestro impacto</SectionTag>
            <h2 className="text-3xl md:text-4xl font-extrabold text-cream">
              Números que importan
            </h2>
          </div>
        </SectionFade>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 150, suffix: "+", label: "Estudiantes alcanzados" },
            { value: 24, label: "Clases dictadas" },
            { value: 5, label: "Instituciones aliadas" },
            { value: 3, label: "Liceos visitados" },
          ].map((s) => (
            <SectionFade key={s.label}>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-green mb-2">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-cream/50 text-sm">{s.label}</div>
              </div>
            </SectionFade>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;

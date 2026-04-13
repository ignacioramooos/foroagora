import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Linkedin } from "lucide-react";
import teamIgnacio from "@/assets/team-ignacio.jpeg";
import teamNicolas from "@/assets/team-nicolas.jpeg";
import teamPhoto from "@/assets/team-photo.jpeg";

const team = [
  { name: "Nicolás Sales", age: 17, role: "Co-fundador & Instructor", bio: "El que sabe. Especialista en análisis fundamental y mercados financieros.", photo: teamNicolas },
  { name: "Juan Ignacio Ramos", age: 18, role: "Co-fundador", bio: "Apasionado por las finanzas y la educación. Lidera la visión y estrategia de InvertíUY.", photo: teamIgnacio },
];

const AboutPage = () => (
  <>
    <section className="pt-32 md:pt-40 pb-20">
      <div className="container">
        <SectionFade>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
            Nuestra misión
          </p>
          <h1 className="text-3xl md:text-5xl text-foreground max-w-4xl mb-8 leading-tight">
            Que cada joven en Uruguay pueda tomar decisiones financieras con criterio propio.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Somos un grupo de jóvenes voluntarios que creemos que la educación financiera
            no debería ser un privilegio. Enseñamos análisis fundamental —
            presencial y en tu idioma.
          </p>
        </SectionFade>
      </div>
    </section>

    <section className="py-24 md:py-32 border-y border-border">
      <div className="container">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-3">
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Nuestra historia
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground mb-8">
              Empezamos porque nadie más lo hacía
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                En 2024, un grupo de estudiantes universitarios en Montevideo se dieron cuenta de que
                sabían más de derivadas que de finanzas personales. Y que sus compañeros de liceo
                estaban aún peor.
              </p>
              <p>
                Decidieron armar clases de análisis fundamental — la misma metodología que
                usan inversores como Warren Buffett — adaptada para estudiantes de liceo sin
                experiencia previa.
              </p>
              <p>
                Lo que empezó como un taller en un salón prestado se convirtió en un movimiento.
                Hoy somos un equipo de voluntarios comprometidos con cerrar la brecha de
                educación financiera en Uruguay.
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <img src={teamPhoto} alt="El equipo de InvertíUY" className="rounded-lg w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 md:py-32">
      <div className="container">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          El equipo
        </p>
        <h2 className="text-3xl md:text-4xl text-foreground mb-12">
          Jóvenes que enseñan a jóvenes
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl">
          {team.map((m) => (
            <div key={m.name} className="flex items-start gap-4">
              <img src={m.photo} alt={m.name} className="w-20 h-20 rounded-full object-cover object-[center_20%] shrink-0" />
              <div className="pt-1">
                <h3 className="font-heading font-semibold text-foreground text-lg">{m.name}</h3>
                <span className="text-muted-foreground text-sm">{m.role} · {m.age} años</span>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild variant="cta-outline" size="cta">
            <Link to="/contacto">Sumarte al equipo</Link>
          </Button>
        </div>
      </div>
    </section>

    <section className="py-24 md:py-32 border-y border-border">
      <div className="container max-w-3xl">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Nuestros valores
        </p>
        <div className="space-y-0 divide-y divide-border">
          {[
            { title: "Acceso universal", desc: "La educación financiera es un derecho, no un privilegio." },
            { title: "Rigor intelectual", desc: "Enseñamos con la misma seriedad que una universidad, pero sin barreras." },
            { title: "Comunidad", desc: "Aprender juntos es más poderoso que aprender solo." },
            { title: "Impacto local", desc: "Empezamos en Montevideo, con la visión de llegar a todo Uruguay." },
          ].map((v) => (
            <div key={v.title} className="py-6 first:pt-0 last:pb-0">
              <h3 className="font-heading font-semibold text-foreground text-lg mb-1">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 md:py-32">
      <div className="container">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Nuestro impacto
        </p>
        <h2 className="text-3xl md:text-4xl text-foreground mb-12">
          Números que importan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: 150, suffix: "+", label: "Estudiantes alcanzados" },
            { value: 24, label: "Clases dictadas" },
            { value: 5, label: "Instituciones aliadas" },
            { value: 3, label: "Liceos visitados" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-heading font-semibold text-foreground mb-2">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;

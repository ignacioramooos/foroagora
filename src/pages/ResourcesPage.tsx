import SectionFade from "@/components/SectionFade";
import { BookOpen, FileText, Play, Clock, ExternalLink } from "lucide-react";

const resources = [
  { title: "Guía: Cómo leer un Income Statement", type: "PDF", category: "Lectura de Estados Financieros", time: "10 min", icon: FileText },
  { title: "¿Qué es el P/E ratio?", type: "Artículo", category: "Conceptos Básicos", time: "5 min", icon: BookOpen },
  { title: "Caso de estudio: Análisis de Apple", type: "Video", category: "Casos de Estudio", time: "15 min", icon: Play },
  { title: "Plantilla de análisis fundamental", type: "PDF", category: "Análisis Fundamental", time: "—", icon: FileText },
  { title: "El Balance Sheet explicado simple", type: "Artículo", category: "Lectura de Estados Financieros", time: "8 min", icon: BookOpen },
  { title: "Introducción al DCF", type: "Video", category: "Análisis Fundamental", time: "20 min", icon: Play },
];

const glossary = [
  { term: "Acción", def: "Una fracción de propiedad de una empresa. Si comprás una acción de Apple, sos dueño de una pequeña parte de Apple." },
  { term: "Balance Sheet", def: "Estado financiero que muestra qué tiene (activos), qué debe (pasivos) y cuánto vale (patrimonio) una empresa en un momento dado." },
  { term: "DCF (Flujo de Caja Descontado)", def: "Método de valoración que estima cuánto vale una empresa hoy basándose en el dinero que generará en el futuro." },
  { term: "P/E Ratio", def: "Precio de la acción dividido por las ganancias por acción. Indica cuánto están dispuestos a pagar los inversores por cada peso de ganancia." },
  { term: "ROE (Return on Equity)", def: "Mide qué tan eficiente es una empresa generando ganancias con el dinero de sus accionistas." },
];

const books = [
  { title: "El inversor inteligente", author: "Benjamin Graham", pitch: "La biblia del value investing. Lectura obligatoria." },
  { title: "One Up on Wall Street", author: "Peter Lynch", pitch: "Cómo encontrar buenas inversiones en tu vida cotidiana." },
  { title: "Padre Rico, Padre Pobre", author: "Robert Kiyosaki", pitch: "Introducción accesible a la mentalidad financiera." },
  { title: "A Random Walk Down Wall Street", author: "Burton Malkiel", pitch: "Perspectiva equilibrada sobre los mercados y la inversión." },
];

const ResourcesPage = () => (
  <>
    <section className="pt-32 md:pt-40 pb-20 bg-secondary">
      <div className="container">
        <SectionFade>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-6">
            Recursos
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary-foreground max-w-3xl mb-6">
            Aprendé a tu ritmo
          </h1>
          <p className="text-secondary-foreground/50 text-lg max-w-xl">
            Guías, artículos, videos y herramientas para profundizar en análisis fundamental.
          </p>
        </SectionFade>
      </div>
    </section>

    {/* Resource Library */}
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">Biblioteca de recursos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {resources.map((r) => (
            <div key={r.title} className="bg-card p-6 hover:bg-background transition-colors group flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">{r.type}</span>
                <span className="font-mono text-xs text-muted-foreground">{r.category}</span>
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2 flex-1">{r.title}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock size={12} /> {r.time}</span>
                <span className="text-primary text-sm font-medium group-hover:underline cursor-pointer flex items-center gap-1">
                  Ver recurso <ExternalLink size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Glossary */}
    <section className="py-24 md:py-32 bg-card border-y border-border">
      <div className="container max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">
          Glosario
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
          Términos financieros en simple
        </h2>
        <div className="divide-y divide-border">
          {glossary.map((g) => (
            <div key={g.term} className="py-6 first:pt-0 last:pb-0">
              <h3 className="font-heading font-bold text-foreground text-lg mb-1">{g.term}</h3>
              <p className="text-muted-foreground leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Recommended Reading */}
    <section className="py-24 md:py-32 bg-background">
      <div className="container max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">
          Lectura recomendada
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
          Libros que cambian tu perspectiva
        </h2>
        <div className="divide-y divide-border">
          {books.map((b) => (
            <div key={b.title} className="py-6 first:pt-0 last:pb-0 flex gap-6 items-start">
              <div className="w-16 h-20 bg-secondary/10 rounded flex-shrink-0 flex items-center justify-center">
                <BookOpen size={20} className="text-muted-foreground/30" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">{b.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{b.author}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.pitch}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default ResourcesPage;

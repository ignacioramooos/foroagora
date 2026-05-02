import { useState } from "react";
import SectionFade from "@/components/SectionFade";
import { BookOpen, FileText, Play, ChevronDown, Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { curriculumClasses, type CurriculumClass } from "@/lib/curriculum";

type ClassVideo = {
  curriculum: CurriculumClass;
  videoUrl: string | null;
};

const classes: ClassVideo[] = curriculumClasses.map((curriculum) => ({
  curriculum,
  videoUrl: null,
}));

const books = [
  { title: "El inversor inteligente", author: "Benjamin Graham", pitch: "La biblia del value investing. Lectura obligatoria." },
  { title: "One Up on Wall Street", author: "Peter Lynch", pitch: "Cómo encontrar buenas inversiones en tu vida cotidiana." },
  { title: "Padre Rico, Padre Pobre", author: "Robert Kiyosaki", pitch: "Introducción accesible a la mentalidad financiera." },
  { title: "Beating the Street", author: "Peter Lynch", pitch: "Más del legendario Peter Lynch." },
];

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] || null;
};

const ClassCard = ({ item, isOpen, onToggle }: { item: ClassVideo; isOpen: boolean; onToggle: () => void }) => {
  const youtubeId = item.videoUrl ? extractYouTubeId(item.videoUrl) : null;
  const { curriculum } = item;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 hover:bg-secondary/40 transition-colors flex items-start gap-4"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
          {item.videoUrl ? (
            <Play size={18} className="text-foreground" />
          ) : (
            <Lock size={16} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Clase {curriculum.classNumber} · {curriculum.duration} · Video próximamente
          </p>
          <h3 className="font-heading font-semibold text-foreground text-lg mb-1">{curriculum.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{curriculum.summary}</p>
        </div>
        <ChevronDown
          size={18}
          className={cn(
            "flex-shrink-0 text-muted-foreground transition-transform mt-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="border-t border-border p-6 space-y-6 bg-secondary/20">
          {/* Video */}
          <div>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Clase grabada
            </p>
            {youtubeId ? (
              <div className="aspect-video rounded-md overflow-hidden bg-muted">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={curriculum.title}
                />
              </div>
            ) : (
              <div className="aspect-video rounded-md border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
                <Lock size={20} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Video disponible cuando se dicte la clase.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Las clases se graban y se publican acá después de cada sesión.
                </p>
              </div>
            )}
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Recursos adjuntos
            </p>
            <div className="divide-y divide-border border border-border rounded-md bg-background">
              {curriculum.resources.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{r.label}</p>
                      <p className="text-xs text-muted-foreground font-heading">{r.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                    <Download size={12} /> Próximamente
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourcesPage = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
              Recursos
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground max-w-3xl mb-6">
              Aprendé a tu ritmo
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Videos de las clases y materiales adjuntos para profundizar en cada tema del recorrido.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-24 md:py-32 border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl text-foreground mb-3 font-heading">Biblioteca de clases</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Tocá cualquier clase para ver el video y los recursos adjuntos.
          </p>
          <div className="space-y-3">
            {classes.map((c) => (
              <ClassCard
                key={c.curriculum.id}
                item={c}
                isOpen={openId === c.curriculum.id}
                onToggle={() => setOpenId(openId === c.curriculum.id ? null : c.curriculum.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Lectura recomendada
          </p>
          <h2 className="text-2xl md:text-3xl text-foreground mb-10 font-heading">
            Libros que cambian tu perspectiva
          </h2>
          <div className="divide-y divide-border">
            {books.map((b) => (
              <div key={b.title} className="py-6 first:pt-0 last:pb-0 flex gap-6 items-start">
                <div className="w-16 h-20 bg-secondary rounded flex-shrink-0 flex items-center justify-center">
                  <BookOpen size={20} className="text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{b.title}</h3>
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
};

export default ResourcesPage;

import { useAuth } from "@/contexts/AuthContext";
import { mockModules, mockCommunityPosts } from "@/lib/mockData";
import { Flame, BookOpen, FileText, Target, MapPin, Clock, CalendarDays } from "lucide-react";

const DashboardHome = () => {
  const { user } = useAuth();
  if (!user) return null;

  const progressPercent = Math.round((user.completedClasses / user.totalClasses) * 100);
  const currentModule = mockModules.find((m) => m.status === "in_progress");

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl text-foreground mb-1">
          Hola, {user.name}!
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          Tu racha actual: {user.streak} días <Flame size={16} className="text-orange-500" />
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-heading mb-3">
            <BookOpen size={16} /> Progreso Total
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-heading font-semibold text-foreground">{progressPercent}%</span>
            <span className="text-sm text-muted-foreground mb-1">{user.completedClasses}/{user.totalClasses} clases</span>
          </div>
          <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-heading mb-3">
            <FileText size={16} /> Tesis Publicadas
          </div>
          <span className="text-3xl font-heading font-semibold text-foreground">{user.publishedTheses}</span>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-heading mb-3">
            <Target size={16} /> Próximo Hito
          </div>
          <span className="text-lg font-heading font-medium text-foreground">
            {currentModule ? `Módulo: ${currentModule.title}` : "Completar programa"}
          </span>
        </div>
      </div>

      {/* Next Event */}
      <div className="border border-border rounded-lg p-6 mb-10">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
          Próxima clase presencial
        </p>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
          Análisis Fundamental — Clase 3
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Jueves 19 de Junio</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> 19:00 hs</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} /> Sede INJU</span>
        </div>
        <button className="h-10 px-5 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors">
          Confirmar asistencia
        </button>
      </div>

      {/* Community Feed */}
      <div>
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Comunidad
        </p>
        <div className="divide-y divide-border border border-border rounded-lg">
          {mockCommunityPosts.map((post) => (
            <div key={post.id} className="p-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.date}</p>
              </div>
              <span className={`text-xs font-heading px-2 py-0.5 rounded ${
                post.type === "announcement" ? "bg-secondary text-foreground" : "bg-background text-muted-foreground border border-border"
              }`}>
                {post.type === "announcement" ? "Anuncio" : "Análisis"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

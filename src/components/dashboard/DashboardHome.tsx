import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { mockModules } from "@/lib/mockData";
import { Flame, BookOpen, FileText, Target, MapPin, Clock, CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RegisteredEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
}

interface CommunityPost {
  id: string;
  author: string;
  type: "analysis" | "announcement";
  title: string;
  created_at: string;
}

const DashboardHome = () => {
  const { user, session } = useAuth();
  const [myEvents, setMyEvents] = useState<RegisteredEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoadingEvents(false);
      return;
    }

    const fetchMyEvents = async () => {
      setLoadingEvents(true);
      try {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", session.user.id);

        if (!regs || regs.length === 0) {
          setMyEvents([]);
          return;
        }

        const ids = regs.map((r: { event_id: string }) => r.event_id);
        const { data: evts } = await supabase
          .from("events")
          .select("id, title, event_date, location")
          .in("id", ids)
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(3);

        setMyEvents((evts as RegisteredEvent[]) || []);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchMyEvents();
  }, [session]);

  useEffect(() => {
    const fetchCommunity = async () => {
      setLoadingCommunity(true);
      try {
        const { data } = await supabase
          .from("community_posts")
          .select("id, author, type, title, created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (data) setCommunityPosts(data as CommunityPost[]);
      } finally {
        setLoadingCommunity(false);
      }
    };

    fetchCommunity();
  }, []);

  if (!user) return null;

  const progressPercent = Math.round((user.completedClasses / user.totalClasses) * 100);
  const currentModule = mockModules.find((m) => m.status === "in_progress");

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "long" });
  };
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Go to landing */}
      <Button asChild variant="cta-outline" size="cta" className="w-full mb-8">
        <Link to="/">
          Ir a la página principal <ArrowRight size={16} />
        </Link>
      </Button>

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

      {/* My upcoming events */}
      {loadingEvents && (
        <div className="mb-10 space-y-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      )}

      {!loadingEvents && myEvents.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Mis próximos eventos
          </p>
          <div className="space-y-3">
            {myEvents.map((event) => (
              <div key={event.id} className="border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(event.event_date)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(event.event_date)}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-heading">
                  <CheckCircle2 size={14} /> Anotado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Feed */}
      <div>
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Comunidad
        </p>
        <div className="divide-y divide-border border border-border rounded-lg">
          {loadingCommunity && (
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          )}
          {communityPosts.map((post) => (
            <div key={post.id} className="p-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.author} · {new Date(post.created_at).toLocaleDateString("es-UY")}
                </p>
              </div>
              <span className={`text-xs font-heading px-2 py-0.5 rounded ${
                post.type === "announcement" ? "bg-secondary text-foreground" : "bg-background text-muted-foreground border border-border"
              }`}>
                {post.type === "announcement" ? "Anuncio" : "Análisis"}
              </span>
            </div>
          ))}
          {!loadingCommunity && communityPosts.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Próximamente — publicaciones del equipo y análisis de alumnos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

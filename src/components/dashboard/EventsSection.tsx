import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sendRegistrationToSheet } from "@/lib/eventUtils";
import { CalendarDays, Clock, MapPin, Users, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  description: string | null;
  speaker_name: string | null;
  speaker_role: string | null;
  event_date: string;
  location: string;
  spots_total: number;
  spots_taken: number;
  is_active: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "long" });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
};

const getCountdown = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
};

const EventsSection = () => {
  const { user, session } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: evts } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true });

      setEvents((evts as Event[]) || []);

      if (session?.user) {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", session.user.id);
        setRegisteredIds(new Set((regs || []).map((r: { event_id: string }) => r.event_id)));
      }
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const handleRegister = async (event: Event) => {
    if (!session?.user || !user) return;
    setRegistering(true);

    // Insert registration
    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: event.id, user_id: session.user.id });

    if (error) {
      toast.error("Error al registrarte. Intentá de nuevo.");
      setRegistering(false);
      return;
    }

    // Send to Google Sheet (non-blocking)
    sendRegistrationToSheet({
      userName: user.name,
      userEmail: user.email,
      userAge: null,
      userInstitution: null,
      userDepartment: null,
      eventTitle: event.title,
      eventDate: event.event_date,
    });

    setRegisteredIds((prev) => new Set([...prev, event.id]));
    toast.success(`¡Listo, ${user.name.split(" ")[0]}! Ya estás anotado.`);
    setRegistering(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>
    );
  }

  const myEvents = events.filter((e) => registeredIds.has(e.id));
  const availableEvents = events.filter((e) => !registeredIds.has(e.id));

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">
        Eventos
      </h1>
      <p className="text-muted-foreground mb-8">Anotate a clases presenciales, workshops y charlas.</p>

      {/* My upcoming events */}
      {myEvents.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Mis próximos eventos
          </p>
          <div className="grid gap-4">
            {myEvents.map((event) => (
              <div key={event.id} className="border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(event.event_date)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(event.event_date)}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1.5 self-start">
                  <CheckCircle2 size={12} /> Anotado
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available events */}
      <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Eventos disponibles
      </p>
      {availableEvents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay eventos disponibles en este momento.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {availableEvents.map((event) => {
            const spotsLeft = event.spots_total - event.spots_taken;
            const isLow = spotsLeft <= 5;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="border border-border rounded-lg p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-heading font-semibold text-foreground">{event.title}</h3>
                  <Badge variant={isLow ? "default" : "outline"} className="shrink-0 text-xs">
                    {isLow ? "Últimos lugares" : "Cupos disponibles"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(event.event_date)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} /> {event.location}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setSelectedEvent(null)}>
          <div
            className="bg-background border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
                    {selectedEvent.title}
                  </h2>
                  {(() => {
                    const countdown = getCountdown(selectedEvent.event_date);
                    return countdown ? (
                      <p className="text-sm text-muted-foreground">Comienza en {countdown}</p>
                    ) : null;
                  })()}
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={20} />
                </button>
              </div>

              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>
              )}

              {selectedEvent.speaker_name && (
                <div className="border border-border rounded-md p-4 mb-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-heading font-semibold text-sm">
                    {selectedEvent.speaker_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-medium text-foreground text-sm">{selectedEvent.speaker_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedEvent.speaker_role}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(selectedEvent.event_date)}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(selectedEvent.event_date)}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {selectedEvent.location}</span>
                <span className="flex items-center gap-1.5"><Users size={14} /> {selectedEvent.spots_taken}/{selectedEvent.spots_total} anotados</span>
              </div>

              {registeredIds.has(selectedEvent.id) ? (
                <Button variant="secondary" size="cta" className="w-full" disabled>
                  <CheckCircle2 size={16} /> Ya estás anotado
                </Button>
              ) : (
                <Button
                  variant="cta"
                  size="cta"
                  className="w-full"
                  disabled={registering}
                  onClick={() => handleRegister(selectedEvent)}
                >
                  {registering ? <Loader2 size={16} className="animate-spin" /> : null}
                  {registering ? "Procesando registro..." : "Anotarme a este evento"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsSection;

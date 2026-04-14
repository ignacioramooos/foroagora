import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import CertificateView from "@/components/CertificateView";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, LogIn, BookOpen, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Lesson {
  id: string;
  module_number: number;
  lesson_number: number;
  title: string;
  content: string;
  estimated_minutes: number;
}

const moduleNames: Record<number, string> = {
  1: "¿Por qué invertir?",
  2: "Entendiendo una empresa",
  3: "Primeros pasos en análisis fundamental",
};

const FormacionPage = () => {
  const { isLoggedIn, session } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [certificate, setCertificate] = useState<{ certificate_code: string; issued_at: string } | null>(null);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);

  // Fetch lessons
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("lesson_number", { ascending: true });
      if (data) setLessons(data as Lesson[]);
      setLoading(false);
    };
    fetch();
  }, []);

  // Fetch progress + certificate
  useEffect(() => {
    if (!session?.user) return;
    const fetchProgress = async () => {
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", session.user.id);
      if (progress) setCompletedIds(new Set(progress.map((p: { lesson_id: string }) => p.lesson_id)));

      const { data: cert } = await supabase
        .from("certificates")
        .select("certificate_code, issued_at")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cert) setCertificate(cert);
    };
    fetchProgress();
  }, [session]);

  const currentLesson = useMemo(
    () => lessons.find((l) => l.lesson_number === activeLesson),
    [lessons, activeLesson]
  );

  const modules = useMemo(() => {
    const map = new Map<number, Lesson[]>();
    lessons.forEach((l) => {
      if (!map.has(l.module_number)) map.set(l.module_number, []);
      map.get(l.module_number)!.push(l);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [lessons]);

  const allCompleted = lessons.length > 0 && lessons.every((l) => completedIds.has(l.id));

  const handleComplete = async () => {
    if (!session?.user || !currentLesson || completedIds.has(currentLesson.id)) return;
    setMarking(true);
    await supabase.from("lesson_progress").insert({
      user_id: session.user.id,
      lesson_id: currentLesson.id,
    });
    const newCompleted = new Set(completedIds);
    newCompleted.add(currentLesson.id);
    setCompletedIds(newCompleted);

    // Check if all completed → issue certificate
    if (lessons.every((l) => newCompleted.has(l.id)) && !certificate) {
      const { data: cert } = await supabase
        .from("certificates")
        .insert({ user_id: session.user.id })
        .select("certificate_code, issued_at")
        .single();
      if (cert) setCertificate(cert);
    }
    setMarking(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background pt-16">
          <span className="text-muted-foreground text-sm font-heading">Cargando...</span>
        </div>
        <Footer />
      </>
    );
  }

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {isLoggedIn && (
        <div className="mb-6">
          <div className="text-xs font-heading text-muted-foreground mb-1">
            {completedIds.size} de {lessons.length} lecciones completadas
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${lessons.length > 0 ? (completedIds.size / lessons.length) * 100 : 0}%`,
                backgroundColor: "#22D07A",
              }}
            />
          </div>
        </div>
      )}
      {modules.map(([modNum, modLessons]) => (
        <div key={modNum} className="mb-5">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Módulo {modNum}: {moduleNames[modNum]}
          </p>
          <div className="space-y-1">
            {modLessons.map((l) => {
              const isActive = l.lesson_number === activeLesson;
              const isCompleted = completedIds.has(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => { setActiveLesson(l.lesson_number); setMobileModulesOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-heading text-left transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} style={{ color: "#22D07A" }} className="shrink-0" />
                  ) : (
                    <Circle size={14} className="text-muted-foreground/40 shrink-0" />
                  )}
                  <span className="truncate">{l.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="flex">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 border-r border-border p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            {sidebarContent}
          </aside>

          {/* Main content */}
          <div className="flex-1 max-w-3xl mx-auto px-6 py-10">
            {/* Mobile module accordion */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setMobileModulesOpen(!mobileModulesOpen)}
                className="w-full flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm font-heading font-medium text-foreground"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Módulos y lecciones
                </span>
                <ChevronDown size={16} className={`transition-transform ${mobileModulesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileModulesOpen && (
                <div className="border border-t-0 border-border rounded-b-lg p-4">
                  {sidebarContent}
                </div>
              )}
            </div>

            {/* Certificate congratulations */}
            {allCompleted && certificate && (
              <CertificateView certificate={certificate} />
            )}

            {/* Lesson content */}
            {currentLesson && !allCompleted && (
              <>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground font-heading">
                  <span>Módulo {currentLesson.module_number}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {currentLesson.estimated_minutes} min</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                  {currentLesson.title}
                </h1>
                <div className="prose prose-sm max-w-none text-foreground prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-border prose-th:text-foreground prose-td:text-muted-foreground">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                {/* Complete button */}
                <div className="mt-10 mb-8 border-t border-border pt-6">
                  {!isLoggedIn ? (
                    <div className="border border-border rounded-lg p-5 text-center">
                      <LogIn size={20} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Iniciá sesión para guardar tu progreso y obtener tu certificado.
                      </p>
                      <Button asChild variant="cta" size="sm">
                        <Link to="/auth">Iniciar sesión</Link>
                      </Button>
                    </div>
                  ) : completedIds.has(currentLesson.id) ? (
                    <button disabled className="flex items-center gap-2 text-sm font-heading font-medium" style={{ color: "#22D07A" }}>
                      <CheckCircle2 size={16} /> Completada
                    </button>
                  ) : (
                    <Button onClick={handleComplete} disabled={marking} variant="cta" size="sm">
                      {marking ? "Guardando..." : "Marcar como completada"}
                    </Button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  {activeLesson > 1 ? (
                    <button
                      onClick={() => setActiveLesson(activeLesson - 1)}
                      className="flex items-center gap-1.5 text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronLeft size={16} /> Lección anterior
                    </button>
                  ) : <div />}
                  {activeLesson < lessons.length ? (
                    <button
                      onClick={() => setActiveLesson(activeLesson + 1)}
                      className="flex items-center gap-1.5 text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Siguiente lección <ChevronRight size={16} />
                    </button>
                  ) : <div />}
                </div>
              </>
            )}

            {/* Show current lesson even after completion when clicking sidebar */}
            {currentLesson && allCompleted && (
              <>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground font-heading">
                  <span>Módulo {currentLesson.module_number}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {currentLesson.estimated_minutes} min</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                  {currentLesson.title}
                </h1>
                <div className="prose prose-sm max-w-none text-foreground prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-border prose-th:text-foreground prose-td:text-muted-foreground">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormacionPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CertificateView from "@/components/CertificateView";
import { BookOpen, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  module_number: number;
  lesson_number: number;
  title: string;
}

const moduleNames: Record<number, string> = {
  1: "¿Por qué invertir?",
  2: "Entendiendo una empresa",
  3: "Primeros pasos",
};

const DashboardFormacion = () => {
  const { session } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [certificate, setCertificate] = useState<{ certificate_code: string; issued_at: string } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id, module_number, lesson_number, title")
        .eq("is_published", true)
        .order("lesson_number", { ascending: true });
      if (data) setLessons(data as Lesson[]);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    const fetch = async () => {
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
    fetch();
  }, [session]);

  // Group by module
  const modules = new Map<number, Lesson[]>();
  lessons.forEach((l) => {
    if (!modules.has(l.module_number)) modules.set(l.module_number, []);
    modules.get(l.module_number)!.push(l);
  });

  const completedCount = completedIds.size;
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Certificate card */}
      {certificate && <CertificateView certificate={certificate} compact />}

      {/* Progress overview */}
      {!certificate && totalCount > 0 && (
        <div className="border border-border rounded-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-heading text-foreground">
              <BookOpen size={16} />
              <span>Formación Online</span>
            </div>
            <span className="text-xs text-muted-foreground font-heading">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%`, backgroundColor: "#22D07A" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {completedCount} de {totalCount} lecciones completadas
          </p>
          <Button asChild variant="cta-outline" size="sm" className="gap-1.5">
            <Link to="/formacion">
              {completedCount === 0 ? "Empezar" : "Continuar"} <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      )}

      {/* Module breakdown */}
      {totalCount > 0 && (
        <div className="space-y-3">
          {Array.from(modules.entries()).sort(([a], [b]) => a - b).map(([modNum, modLessons]) => {
            const modCompleted = modLessons.filter((l) => completedIds.has(l.id)).length;
            return (
              <div key={modNum} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                    Módulo {modNum}: {moduleNames[modNum]}
                  </p>
                  <span className="text-xs text-muted-foreground">{modCompleted}/{modLessons.length}</span>
                </div>
                <div className="space-y-1">
                  {modLessons.map((l) => (
                    <div key={l.id} className="flex items-center gap-2 text-sm">
                      {completedIds.has(l.id) ? (
                        <CheckCircle2 size={13} style={{ color: "#22D07A" }} className="shrink-0" />
                      ) : (
                        <Circle size={13} className="text-muted-foreground/30 shrink-0" />
                      )}
                      <span className={completedIds.has(l.id) ? "text-muted-foreground" : "text-foreground"}>
                        {l.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardFormacion;

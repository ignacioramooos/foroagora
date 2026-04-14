import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SectionFade from "@/components/SectionFade";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImpactPage = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [departments, setDepartments] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const [profilesRes, deptsRes, lessonsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("department").not("department", "is", null),
        supabase.from("lesson_progress").select("id", { count: "exact", head: true }),
      ]);

      setTotalStudents(profilesRes.count || 0);
      const uniqueDepts = new Set((deptsRes.data || []).map((d: any) => d.department));
      setDepartments(uniqueDepts.size);
      setLessonsCompleted(lessonsRes.count || 0);
      setLoading(false);
    };
    fetchMetrics();

    // Realtime subscription for new profiles
    const channel = supabase
      .channel("impact-profiles")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, () => {
        setTotalStudents((prev) => prev + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Impacto de Crecí con Criterio",
        text: "¡Mirá el impacto de Crecí con Criterio en Uruguay! 🇺🇾📈",
        url: window.location.href,
      });
    }
  };

  const milestones = [
    { date: "Abril 2025", label: "Primer sitio web lanzado" },
    { date: "Por anunciar", label: "Primer cohort" },
  ];

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20" style={{ backgroundColor: "#0D1B2A" }}>
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-white/40 mb-4">
              Impacto en tiempo real
            </p>
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D07A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22D07A]" />
              </span>
              <span className="text-white/60 text-sm font-heading">En vivo</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {!loading && (
                <>
                  <div>
                    <AnimatedCounter end={totalStudents} />
                    <p className="text-white/50 text-sm mt-1">Inscriptos totales</p>
                  </div>
                  <div>
                    <AnimatedCounter end={departments} />
                    <p className="text-white/50 text-sm mt-1">Departamentos representados</p>
                  </div>
                  <div>
                    <AnimatedCounter end={lessonsCompleted} />
                    <p className="text-white/50 text-sm mt-1">Lecciones online completadas</p>
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleShare} variant="cta-outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <Share2 size={14} /> Compartir
            </Button>
          </SectionFade>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 md:py-32">
        <div className="container max-w-2xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Línea de tiempo
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-12">Hitos del proyecto</h2>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#22D07A]" />
                  {i < milestones.length - 1 && <div className="w-px h-12 bg-border" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide">{m.date}</p>
                  <p className="text-foreground font-heading font-medium">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ImpactPage;

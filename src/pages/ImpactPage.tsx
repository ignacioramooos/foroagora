import { useEffect, useMemo, useState } from "react";
import SectionFade from "@/components/SectionFade";
import { supabase } from "@/integrations/supabase/client";
import { Activity, BookOpen, GraduationCap, Layers } from "lucide-react";

interface ImpactStats {
  students: number;
  activeCohorts: number;
  publishedContent: number;
}

interface DepartmentPoint {
  name: string;
  x: number;
  y: number;
}

const departmentPoints: DepartmentPoint[] = [
  { name: "Artigas", x: 34, y: 10 },
  { name: "Salto", x: 24, y: 22 },
  { name: "Paysandú", x: 30, y: 30 },
  { name: "Río Negro", x: 37, y: 36 },
  { name: "Soriano", x: 44, y: 41 },
  { name: "Colonia", x: 50, y: 47 },
  { name: "San José", x: 56, y: 54 },
  { name: "Montevideo", x: 63, y: 61 },
  { name: "Canelones", x: 69, y: 58 },
  { name: "Maldonado", x: 79, y: 64 },
  { name: "Rocha", x: 88, y: 56 },
  { name: "Lavalleja", x: 72, y: 49 },
  { name: "Treinta y Tres", x: 82, y: 44 },
  { name: "Florida", x: 60, y: 45 },
  { name: "Flores", x: 51, y: 40 },
  { name: "Durazno", x: 57, y: 35 },
  { name: "Tacuarembó", x: 55, y: 24 },
  { name: "Rivera", x: 49, y: 12 },
  { name: "Cerro Largo", x: 72, y: 26 },
];

const LiveCounter = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = display;
    const duration = 900;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString("es-UY")}</span>;
};

const ImpactPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ImpactStats>({ students: 0, activeCohorts: 0, publishedContent: 0 });
  const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({});

  const fetchImpactData = async () => {
    const [studentsRes, cohortsRes, contentRes, departmentsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("cohorts").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("profiles").select("department").not("department", "is", null),
    ]);

    setStats({
      students: studentsRes.count ?? 0,
      activeCohorts: cohortsRes.count ?? 0,
      publishedContent: contentRes.count ?? 0,
    });

    const grouped = (departmentsRes.data ?? []).reduce<Record<string, number>>((acc, row) => {
      const department = (row.department || "").trim();
      if (!department) {
        return acc;
      }
      acc[department] = (acc[department] ?? 0) + 1;
      return acc;
    }, {});

    setDepartmentCounts(grouped);
    setLoading(false);
  };

  useEffect(() => {
    fetchImpactData();

    const channel = supabase
      .channel("impact-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchImpactData)
      .on("postgres_changes", { event: "*", schema: "public", table: "cohorts" }, fetchImpactData)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_items" }, fetchImpactData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const rankedDepartments = useMemo(
    () => Object.entries(departmentCounts).sort((a, b) => b[1] - a[1]),
    [departmentCounts],
  );

  const maxDepartment = Math.max(...Object.values(departmentCounts), 1);

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute top-44 -left-24 h-64 w-64 rounded-full bg-foreground/10 blur-3xl" />
          <div className="absolute top-64 -right-24 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="container max-w-6xl">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Impacto público
            </p>
            <h1 className="text-4xl md:text-6xl leading-[0.95] text-foreground max-w-4xl mb-6">
              Impacto de Foro Agora en tiempo real
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Este tablero se actualiza directamente desde nuestra base de datos para mostrar crecimiento de estudiantes,
              cohortes activas y contenido publicado.
            </p>
          </SectionFade>

          <SectionFade delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="rounded-2xl border border-border bg-background/80 backdrop-blur p-6">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Estudiantes</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.students} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <GraduationCap size={14} /> Registros totales en perfiles
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 backdrop-blur p-6">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Cohortes activas</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.activeCohorts} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Layers size={14} /> Cohortes con estado activo
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 backdrop-blur p-6">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Contenido publicado</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.publishedContent} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <BookOpen size={14} /> Clases y recursos visibles
                </p>
              </div>
            </div>
          </SectionFade>
        </div>
      </section>

      <section className="pt-16 md:pt-24">
        <div className="container max-w-6xl">
          <SectionFade>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Activity size={16} />
              <p className="text-xs font-heading uppercase tracking-widest">Mapa por departamento</p>
            </div>
            <h2 className="text-3xl md:text-4xl text-foreground mb-3">Distribución de estudiantes en Uruguay</h2>
            <p className="text-muted-foreground max-w-2xl mb-10">
              Agrupación en vivo por el campo department de perfiles.
            </p>
          </SectionFade>

          <div className="grid lg:grid-cols-3 gap-6">
            <SectionFade className="lg:col-span-2" delay={0.06}>
              <div className="relative rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-background p-6 md:p-8 min-h-[26rem]">
                <div className="absolute inset-4 rounded-xl border border-border/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] [background-size:20px_20px] opacity-20" />

                <div className="relative h-full">
                  {departmentPoints.map((point) => {
                    const count = departmentCounts[point.name] ?? 0;
                    const size = Math.max(8, Math.min(34, 8 + (count / maxDepartment) * 26));
                    return (
                      <div
                        key={point.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        title={`${point.name}: ${count}`}
                      >
                        <div
                          className={`rounded-full border border-background shadow-sm ${count > 0 ? "bg-accent" : "bg-muted"}`}
                          style={{ width: `${size}px`, height: `${size}px`, opacity: count > 0 ? 0.95 : 0.55 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionFade>

            <SectionFade delay={0.12}>
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-heading text-lg text-foreground mb-5">Top departamentos</h3>
                <div className="space-y-4">
                  {rankedDepartments.slice(0, 8).map(([department, count]) => {
                    const pct = Math.round((count / maxDepartment) * 100);
                    return (
                      <div key={department}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-heading text-foreground">{department}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {!loading && rankedDepartments.length === 0 && (
                    <p className="text-sm text-muted-foreground">Todavía no hay datos de departamentos para mostrar.</p>
                  )}
                </div>
              </div>
            </SectionFade>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;

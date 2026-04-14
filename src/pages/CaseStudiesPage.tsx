import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SectionFade from "@/components/SectionFade";
import { AlertTriangle, ArrowRight, FileText } from "lucide-react";

interface CaseStudy {
  id: string;
  author_first_name: string;
  author_last_initial: string;
  author_school: string | null;
  cohort_label: string | null;
  company_name: string;
  company_ticker: string | null;
  company_sector: string | null;
  summary: string;
  created_at: string;
}

const CaseStudiesPage = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("case_studies")
      .select("id, author_first_name, author_last_initial, author_school, cohort_label, company_name, company_ticker, company_sector, summary, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setStudies(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Análisis de estudiantes
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground max-w-3xl mb-4">
              Así analizan nuestros alumnos
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-8">
              Análisis reales escritos por estudiantes del programa. No son recomendaciones de inversión.
            </p>
          </SectionFade>
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 flex items-start gap-3 max-w-3xl">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Estos análisis son ejercicios educativos realizados por estudiantes. No constituyen asesoramiento financiero ni recomendaciones de compra o venta.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-5 bg-secondary rounded w-2/3 mb-3" />
                  <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
                  <div className="h-16 bg-secondary rounded mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : studies.length === 0 ? (
            <div className="text-center py-16 max-w-lg mx-auto">
              <FileText size={40} className="mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl text-foreground mb-4">
                Todavía no publicamos análisis
              </h2>
              <p className="text-muted-foreground text-lg">
                Los primeros aparecerán cuando finalice nuestro primer cohort.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((s) => (
                <Link
                  key={s.id}
                  to={`/analisis/${s.id}`}
                  className="border border-border rounded-lg p-6 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading font-semibold text-foreground text-lg">{s.company_name}</h3>
                    {s.company_ticker && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-heading font-medium">
                        {s.company_ticker}
                      </span>
                    )}
                  </div>
                  {s.company_sector && (
                    <span className="text-xs text-muted-foreground/60 font-heading">{s.company_sector}</span>
                  )}
                  <p className="text-muted-foreground text-sm mt-3 mb-4 leading-relaxed line-clamp-3">
                    {s.summary.length > 150 ? s.summary.slice(0, 150) + "..." : s.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {s.author_first_name} {s.author_last_initial}
                      {s.author_school && ` · ${s.author_school}`}
                    </span>
                    <span className="text-sm font-heading font-medium text-foreground group-hover:underline flex items-center gap-1">
                      Leer análisis <ArrowRight size={14} />
                    </span>
                  </div>
                  {s.cohort_label && (
                    <p className="text-xs text-muted-foreground/50 mt-2">{s.cohort_label}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CaseStudiesPage;

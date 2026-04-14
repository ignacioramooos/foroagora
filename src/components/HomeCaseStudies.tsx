import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SectionFade from "@/components/SectionFade";
import { ArrowRight } from "lucide-react";

interface CaseStudy {
  id: string;
  company_name: string;
  company_ticker: string | null;
  author_first_name: string;
  author_last_initial: string;
  summary: string;
}

const HomeCaseStudies = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    supabase
      .from("case_studies")
      .select("id, company_name, company_ticker, author_first_name, author_last_initial, summary")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setStudies(data); });
  }, []);

  if (studies.length === 0) return null;

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <SectionFade>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">Análisis de estudiantes</p>
              <h2 className="text-3xl md:text-4xl text-foreground">Así analizan nuestros alumnos</h2>
            </div>
            <Link to="/analisis" className="hidden md:flex items-center gap-1 text-sm font-heading font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
        </SectionFade>
        <div className="grid md:grid-cols-3 gap-6">
          {studies.map((s) => (
            <Link key={s.id} to={`/analisis/${s.id}`} className="border border-border rounded-lg p-6 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-heading font-semibold text-foreground">{s.company_name}</h3>
                {s.company_ticker && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-heading">{s.company_ticker}</span>}
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{s.summary}</p>
              <span className="text-xs text-muted-foreground">{s.author_first_name} {s.author_last_initial}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCaseStudies;

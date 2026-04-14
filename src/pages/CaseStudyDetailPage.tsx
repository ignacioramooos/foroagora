import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyMetric {
  label: string;
  value: string;
}

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
  content: string;
  key_metrics: KeyMetric[];
  verdict: string | null;
  created_at: string;
}

const CaseStudyDetailPage = () => {
  const { id } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single()
      .then(({ data }) => {
        if (data) {
          setStudy({
            ...data,
            key_metrics: Array.isArray(data.key_metrics) ? (data.key_metrics as unknown as KeyMetric[]) : [],
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3" />
            <div className="h-6 bg-secondary rounded w-1/2" />
            <div className="h-40 bg-secondary rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="pt-32 pb-20">
        <div className="container max-w-3xl text-center">
          <h1 className="text-2xl text-foreground mb-4">Análisis no encontrado</h1>
          <Button asChild variant="cta-outline">
            <Link to="/analisis">← Volver a análisis</Link>
          </Button>
        </div>
      </div>
    );
  }

  const dateStr = new Date(study.created_at).toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pt-32 pb-20">
      <div className="container max-w-3xl">
        <Link to="/analisis" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver a análisis
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">{study.company_name}</h1>
          {study.company_ticker && (
            <span className="text-sm px-3 py-1 rounded-full bg-secondary text-muted-foreground font-heading font-medium">
              {study.company_ticker}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
          {study.company_sector && <span>{study.company_sector}</span>}
          <span>·</span>
          <span>{study.author_first_name} {study.author_last_initial}{study.author_school && ` · ${study.author_school}`}</span>
          {study.cohort_label && <><span>·</span><span>{study.cohort_label}</span></>}
          <span>·</span>
          <span>{dateStr}</span>
        </div>

        <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 flex items-start gap-3 mb-8">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Este análisis es un ejercicio educativo. No constituye asesoramiento financiero.
          </p>
        </div>

        {study.key_metrics.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {study.key_metrics.map((m, i) => (
              <div key={i} className="border border-border rounded-lg px-5 py-3 min-w-[120px]">
                <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide mb-1">{m.label}</p>
                <p className="text-lg font-heading font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
          <ReactMarkdown>{study.content}</ReactMarkdown>
        </div>

        {study.verdict && (
          <div className="border-l-4 border-[#22D07A] bg-[#22D07A]/5 rounded-r-lg p-6 mb-8">
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-2">Veredicto del estudiante</p>
            <p className="text-foreground font-heading font-semibold text-lg">{study.verdict}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudyDetailPage;

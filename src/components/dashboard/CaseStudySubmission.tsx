import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Plus, X, CheckCircle2, Eye, EyeOff } from "lucide-react";

interface Metric {
  label: string;
  value: string;
}

const CaseStudySubmission = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    company_name: "", company_ticker: "", company_sector: "",
    summary: "", content: "", verdict: "",
  });
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const addMetric = () => { if (metrics.length < 8) setMetrics([...metrics, { label: "", value: "" }]); };
  const updateMetric = (i: number, field: "label" | "value", val: string) => {
    const copy = [...metrics]; copy[i][field] = val; setMetrics(copy);
  };
  const removeMetric = (i: number) => setMetrics(metrics.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.company_name || !form.summary || !form.content) return;

    const { data: profile } = await supabase
      .from("profiles").select("full_name, institution").eq("user_id", user.id).single();

    const fullName = profile?.full_name || user.name || "Anónimo";
    const parts = fullName.trim().split(" ");
    const firstName = parts[0];
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] + "." : "";

    setSubmitting(true);
    const { error } = await supabase.from("case_studies").insert({
      author_first_name: firstName,
      author_last_initial: lastInitial,
      author_school: profile?.institution || null,
      company_name: form.company_name,
      company_ticker: form.company_ticker || null,
      company_sector: form.company_sector || null,
      summary: form.summary,
      content: form.content,
      key_metrics: metrics.filter((m) => m.label && m.value),
      verdict: form.verdict || null,
      is_published: false,
    } as any);
    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "No pudimos enviar tu análisis.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = "w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  if (submitted) {
    return (
      <div className="p-6">
        <div className="border border-[#22D07A]/30 bg-[#22D07A]/5 rounded-lg p-8 text-center">
          <CheckCircle2 size={40} className="text-[#22D07A] mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-foreground text-xl mb-2">¡Gracias!</h3>
          <p className="text-muted-foreground">Tu análisis fue enviado para revisión. Te avisamos cuando lo publiquemos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Subir mi análisis</h2>
      <p className="text-sm text-muted-foreground mb-6">Enviá tu análisis de una empresa para revisión. Si es aprobado, se publicará en /analisis.</p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-heading font-medium text-foreground mb-1">Empresa *</label>
            <input className={inputClass} value={form.company_name} onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-heading font-medium text-foreground mb-1">Ticker</label>
            <input className={inputClass} placeholder="e.g. AAPL" value={form.company_ticker} onChange={(e) => setForm((p) => ({ ...p, company_ticker: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-heading font-medium text-foreground mb-1">Sector</label>
            <input className={inputClass} placeholder="e.g. Tecnología" value={form.company_sector} onChange={(e) => setForm((p) => ({ ...p, company_sector: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading font-medium text-foreground mb-1">Resumen * (máx. 300 caracteres)</label>
          <textarea className={`${inputClass} h-20 py-2 resize-none`} maxLength={300} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} required />
          <p className="text-xs text-muted-foreground mt-1">{form.summary.length}/300</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-heading font-medium text-foreground">Análisis completo * (Markdown)</label>
            <button type="button" onClick={() => setPreview(!preview)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {preview ? <EyeOff size={12} /> : <Eye size={12} />} {preview ? "Editar" : "Vista previa"}
            </button>
          </div>
          {preview ? (
            <div className="border border-border rounded-md p-4 min-h-[200px] prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{form.content || "*Escribí tu análisis arriba.*"}</ReactMarkdown>
            </div>
          ) : (
            <textarea className={`${inputClass} h-48 py-2 resize-y`} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required placeholder="Escribí tu análisis aquí. Podés usar Markdown." />
          )}
        </div>

        <div>
          <label className="block text-xs font-heading font-medium text-foreground mb-2">Métricas clave</label>
          {metrics.map((m, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className={`${inputClass} flex-1`} placeholder="Etiqueta (e.g. P/E)" value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} />
              <input className={`${inputClass} flex-1`} placeholder="Valor (e.g. 25.3x)" value={m.value} onChange={(e) => updateMetric(i, "value", e.target.value)} />
              <button type="button" onClick={() => removeMetric(i)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
          ))}
          {metrics.length < 8 && (
            <button type="button" onClick={addMetric} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Plus size={14} /> Agregar métrica
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-heading font-medium text-foreground mb-1">Veredicto</label>
          <input className={inputClass} placeholder="e.g. Interesante para seguir de cerca" value={form.verdict} onChange={(e) => setForm((p) => ({ ...p, verdict: e.target.value }))} />
        </div>

        <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar para revisión"}
        </Button>
      </form>
    </div>
  );
};

export default CaseStudySubmission;

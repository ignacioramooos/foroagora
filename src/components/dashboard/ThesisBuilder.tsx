import { useState } from "react";
import { mockTheses, Thesis } from "@/lib/mockData";
import { Plus, FileText } from "lucide-react";

const companies = ["Mercado Libre", "Globant", "Vista Energy", "Dlocal", "YPF", "Nu Holdings", "Coca-Cola", "Apple", "Google", "Otra"];

const ThesisBuilder = () => {
  const [theses, setTheses] = useState<Thesis[]>(mockTheses);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company: "", content: "" });

  const handleSubmit = () => {
    const newThesis: Thesis = {
      id: String(Date.now()),
      company: form.company,
      date: new Date().toISOString().split("T")[0],
      status: "borrador",
      content: form.content,
    };
    setTheses([newThesis, ...theses]);
    setShowForm(false);
    setStep(1);
    setForm({ company: "", content: "" });
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl text-foreground">Mis Tesis</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors"
        >
          <Plus size={16} /> Nueva Tesis
        </button>
      </div>
      <p className="text-muted-foreground mb-8">Tus análisis de empresas.</p>

      {showForm && (
        <div className="border border-border rounded-lg p-6 mb-8">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Paso {step} de 3
          </p>
          {step === 1 && (
            <>
              <p className="text-sm font-heading font-medium text-foreground mb-3">Elegí la empresa</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {companies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, company: c })}
                    className={`px-3 py-1.5 rounded-md text-sm font-heading border transition-colors ${
                      form.company === c
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={() => form.company && setStep(2)}
                disabled={!form.company}
                className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors disabled:opacity-40"
              >
                Siguiente
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm font-heading font-medium text-foreground mb-3">¿Por qué te gusta {form.company}?</p>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none mb-4"
                placeholder="Escribí tu tesis de inversión..."
              />
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="h-9 px-4 rounded-md border border-border text-sm font-heading text-muted-foreground hover:text-foreground transition-colors">
                  Atrás
                </button>
                <button
                  onClick={() => form.content.trim() && setStep(3)}
                  disabled={!form.content.trim()}
                  className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="text-sm font-heading font-medium text-foreground mb-3">Adjuntar archivo (opcional)</p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                <FileText size={24} className="mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Arrastrá un PDF o imagen acá</p>
                <p className="text-xs text-muted-foreground/60 mt-1">(Simulado — no se sube nada)</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="h-9 px-4 rounded-md border border-border text-sm font-heading text-muted-foreground hover:text-foreground transition-colors">
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors"
                >
                  Guardar Tesis
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Theses List */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {theses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No tenés tesis todavía. ¡Empezá con tu primer análisis!
          </div>
        ) : (
          theses.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-heading font-medium text-foreground">{t.company}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.date}</p>
              </div>
              <span className={`text-xs font-heading px-2 py-0.5 rounded border ${
                t.status === "publicado" ? "bg-secondary text-foreground border-border" : "text-muted-foreground border-border"
              }`}>
                {t.status === "publicado" ? "Publicado" : "Borrador"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThesisBuilder;

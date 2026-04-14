import { useState } from "react";
import { DollarSign, HeartPulse, UserCheck } from "lucide-react";
import GlossaryContent from "@/components/GlossaryContent";

/* ---- Opportunity Cost Calculator ---- */
const OpportunityCostCalc = () => {
  const [dailyCost, setDailyCost] = useState("");
  const [frequency, setFrequency] = useState("30");
  const result10 = dailyCost && frequency ? calcCompound(Number(dailyCost) * Number(frequency), 0.07, 10) : null;
  const result20 = dailyCost && frequency ? calcCompound(Number(dailyCost) * Number(frequency), 0.07, 20) : null;

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={18} className="text-muted-foreground" />
        <h3 className="font-heading font-semibold text-foreground text-lg">Costo de Oportunidad</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        ¿Cuánto podrías tener si invertís ese gasto diario?
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-heading text-muted-foreground mb-1">Gasto diario (UYU)</label>
          <input
            type="number"
            value={dailyCost}
            onChange={(e) => setDailyCost(e.target.value)}
            placeholder="Ej: 150"
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div>
          <label className="block text-xs font-heading text-muted-foreground mb-1">Días por mes</label>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>
      {result10 !== null && (
        <div className="bg-secondary rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-heading">En 10 años:</span>
            <span className="font-heading font-semibold text-foreground">UYU {formatNumber(result10)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-heading">En 20 años:</span>
            <span className="font-heading font-semibold text-foreground">UYU {formatNumber(result20!)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Asumiendo retorno anual del 7% compuesto.</p>
        </div>
      )}
    </div>
  );
};

/* ---- Valuation Lite ---- */
const ValuationLite = () => {
  const [revenue, setRevenue] = useState("");
  const [debt, setDebt] = useState("");
  const [cash, setCash] = useState("");

  const getResult = () => {
    const r = Number(revenue), d = Number(debt), c = Number(cash);
    if (!r || r <= 0) return null;
    const debtToRevenue = d / r;
    const cashToDebt = d > 0 ? c / d : 999;
    if (debtToRevenue < 0.3 && cashToDebt > 1) return { color: "bg-green-100 text-green-800 border-green-200", label: "Saludable", advice: "Baja deuda relativa y buena posición de caja." };
    if (debtToRevenue < 0.7 || cashToDebt > 0.5) return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Moderado", advice: "Nivel de deuda manejable pero merece atención." };
    return { color: "bg-red-100 text-red-800 border-red-200", label: "Riesgoso", advice: "Alta deuda relativa a ingresos. Investigar más antes de invertir." };
  };

  const result = (revenue && debt && cash) ? getResult() : null;

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <HeartPulse size={18} className="text-muted-foreground" />
        <h3 className="font-heading font-semibold text-foreground text-lg">Health Check</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">Evaluá rápidamente la salud financiera de una empresa.</p>
      <div className="space-y-3 mb-4">
        {[
          { label: "Ingresos Anuales (USD)", value: revenue, set: setRevenue },
          { label: "Deuda Total (USD)", value: debt, set: setDebt },
          { label: "Efectivo en Mano (USD)", value: cash, set: setCash },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-heading text-muted-foreground mb-1">{f.label}</label>
            <input
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
        ))}
      </div>
      {result && (
        <div className={`rounded-lg p-4 border ${result.color}`}>
          <p className="font-heading font-semibold text-sm mb-1">{result.label}</p>
          <p className="text-xs">{result.advice}</p>
        </div>
      )}
    </div>
  );
};

/* ---- Investor Profile Quiz ---- */
const quizQuestions = [
  { q: "¿Cómo reaccionás si tu inversión baja 20% en un mes?", opts: ["Vendo todo", "Espero a ver qué pasa", "Compro más"] },
  { q: "¿Cuánto tiempo pensás mantener una inversión?", opts: ["Menos de 1 año", "1-5 años", "Más de 5 años"] },
  { q: "¿Qué preferís?", opts: ["Ganar poco pero seguro", "Balance entre riesgo y ganancia", "Ganar mucho aunque arriesgue"] },
  { q: "¿Tenés un fondo de emergencia?", opts: ["No", "Algo pero no suficiente", "Sí, para 6+ meses"] },
  { q: "¿Cuánto sabés de inversiones?", opts: ["Nada", "Lo básico", "Bastante"] },
];

const InvestorQuiz = () => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionIdx: number, answerIdx: number) => {
    const next = [...answers];
    next[questionIdx] = answerIdx;
    setAnswers(next);
  };

  const getProfile = () => {
    const score = answers.reduce((a, b) => a + b, 0);
    if (score <= 4) return { profile: "Conservador", desc: "Preferís la seguridad y estabilidad. Ideal para empezar con renta fija y fondos indexados de bajo riesgo." };
    if (score <= 8) return { profile: "Moderado", desc: "Buscás un balance entre seguridad y crecimiento. Una mezcla de renta fija y acciones puede funcionar bien." };
    return { profile: "Agresivo", desc: "Estás dispuesto a tolerar volatilidad a cambio de mayor retorno potencial. Las acciones individuales y mercados emergentes pueden ser para vos." };
  };

  const allAnswered = answers.length === 5 && answers.every((a) => a !== undefined);

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck size={18} className="text-muted-foreground" />
        <h3 className="font-heading font-semibold text-foreground text-lg">Perfil de Inversor</h3>
      </div>
      {!showResult ? (
        <>
          <p className="text-sm text-muted-foreground mb-5">5 preguntas para conocer tu perfil.</p>
          <div className="space-y-5">
            {quizQuestions.map((q, qi) => (
              <div key={qi}>
                <p className="text-sm font-heading font-medium text-foreground mb-2">{qi + 1}. {q.q}</p>
                <div className="flex flex-wrap gap-2">
                  {q.opts.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, oi)}
                      className={`px-3 py-1.5 rounded-md text-sm font-heading border transition-colors ${
                        answers[qi] === oi
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {allAnswered && (
            <button
              onClick={() => setShowResult(true)}
              className="mt-6 h-10 px-5 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors"
            >
              Ver resultado
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs font-heading uppercase tracking-widest text-muted-foreground mb-2">Tu perfil</p>
          <p className="text-3xl font-heading font-semibold text-foreground mb-3">{getProfile().profile}</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">{getProfile().desc}</p>
          <button
            onClick={() => { setAnswers([]); setShowResult(false); }}
            className="h-9 px-4 rounded-md border border-border text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

/* ---- Glossary ---- */
const Glossary = () => {
  const [search, setSearch] = useState("");
  const filtered = mockGlossary.filter((t) =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search size={18} className="text-muted-foreground" />
        <h3 className="font-heading font-semibold text-foreground text-lg">Glosario</h3>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar término..."
        className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50 mb-4"
      />
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {filtered.map((t) => (
          <div key={t.term} className="py-3">
            <p className="text-sm font-heading font-medium text-foreground">{t.term}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground text-center">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

/* ---- Main Toolkit View ---- */
const Toolkit = () => (
  <div className="p-6 md:p-10 max-w-4xl">
    <h1 className="text-2xl md:text-3xl text-foreground mb-2">Herramientas</h1>
    <p className="text-muted-foreground mb-10">Calculadoras y recursos interactivos para practicar.</p>
    <div className="grid md:grid-cols-2 gap-6">
      <OpportunityCostCalc />
      <ValuationLite />
      <InvestorQuiz />
      <Glossary />
    </div>
  </div>
);

function calcCompound(annualContribution: number, rate: number, years: number): number {
  let total = 0;
  for (let y = 0; y < years; y++) {
    total = (total + annualContribution) * (1 + rate);
  }
  return Math.round(total);
}

function formatNumber(n: number): string {
  return n.toLocaleString("es-UY");
}

export default Toolkit;

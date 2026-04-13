import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const departments = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores",
  "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro",
  "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres",
];

const howFoundOptions = [
  "Instagram",
  "Amigo / Boca a boca",
  "Charla en mi centro educativo",
  "Otro",
];

const interestOptions = [
  "Aprender a invertir",
  "Entender la economía",
  "Conocer gente con mis mismos intereses",
  "Certificar mis conocimientos",
];

const ageRanges = ["Menor de 15", "15 a 18", "19 a 25", "Más de 25"];

interface OnboardingData {
  fullName: string;
  ageRange: string;
  department: string;
  institution: string;
  howFoundUs: string;
  interests: string[];
  acceptedTerms: boolean;
}

const OnboardingFlow = () => {
  const { session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    ageRange: "",
    department: "",
    institution: "",
    howFoundUs: "",
    interests: [],
    acceptedTerms: false,
  });

  const set = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Validation per step
  const canAdvance = () => {
    if (step === 1) return data.fullName.trim().length > 0 && data.ageRange !== "";
    if (step === 2) return data.department !== "" && data.institution.trim().length > 0 && data.howFoundUs !== "";
    if (step === 3) return data.interests.length > 0 && data.acceptedTerms;
    return false;
  };

  const handleFinish = async () => {
    if (!session?.user) return;
    setSaving(true);

    await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        display_name: data.fullName,
        age_range: data.ageRange,
        department: data.department,
        institution: data.institution,
        how_found_us: data.howFoundUs,
        interests: data.interests,
        accepted_terms: data.acceptedTerms,
        onboarding_completed: true,
      })
      .eq("user_id", session.user.id);

    setSaving(false);
    setComplete(true);
  };

  const handleGoToDashboard = async () => {
    await refreshProfile();
    navigate("/dashboard");
  };

  // Prevent closing/refreshing during onboarding
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!complete) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [complete]);

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-3">
            ¡Bienvenido al movimiento, {data.fullName.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mb-8">
            Ya sos parte de la nueva generación financiera de Uruguay.
          </p>
          <Button variant="cta" size="cta" className="w-full" onClick={handleGoToDashboard}>
            Ir a mi Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-foreground" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Paso {step} de 3
        </p>

        {/* Step 1: Identidad Personal */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Identidad Personal</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tu nombre aparecerá en tus futuros certificados.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre y Apellido *</label>
                <input
                  className={inputClass}
                  value={data.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Ej: Ignacio Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Edad *</label>
                <select
                  className={inputClass}
                  value={data.ageRange}
                  onChange={(e) => set("ageRange", e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {ageRanges.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contexto Educativo */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Contexto Educativo</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Queremos conocer de dónde venís.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Departamento *</label>
                <select
                  className={inputClass}
                  value={data.department}
                  onChange={(e) => set("department", e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Institución educativa *</label>
                <input
                  className={inputClass}
                  value={data.institution}
                  onChange={(e) => set("institution", e.target.value)}
                  placeholder="¿A qué liceo, UTU o facultad vas?"
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo nos conociste? *</label>
                <select
                  className={inputClass}
                  value={data.howFoundUs}
                  onChange={(e) => set("howFoundUs", e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {howFoundOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Compromiso */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Compromiso con el Movimiento</h2>
            <p className="text-sm text-muted-foreground mb-6">
              ¿Qué te trae acá?
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-3">¿Qué te interesa? * <span className="text-muted-foreground font-normal">(elegí una o más)</span></label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2.5 rounded-md border text-sm font-heading transition-colors ${
                        data.interests.includes(interest)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:bg-secondary"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={data.acceptedTerms}
                  onChange={(e) => set("acceptedTerms", e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <label className="text-sm text-muted-foreground">
                  Acepto que InvertíUY es un movimiento educativo sin fines de lucro y acepto los términos de uso. *
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8">
          {step > 1 && (
            <Button variant="cta-outline" size="cta" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="cta"
              size="cta"
              className="flex-1"
              disabled={!canAdvance()}
              onClick={() => setStep(step + 1)}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="cta"
              size="cta"
              className="flex-1"
              disabled={!canAdvance() || saving}
              onClick={handleFinish}
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Completar registro
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

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

type FlowStep =
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "reset-sent"
  | "password-updated"
  | "step-1"
  | "step-2"
  | "step-3"
  | "email-confirmation";

interface OnboardingData {
  fullName: string;
  ageRange: string;
  department: string;
  institution: string;
  howFoundUs: string;
  interests: string[];
  acceptedTerms: boolean;
}

const AuthPage = () => {
  const { isLoggedIn, user, login, signup, refreshProfile, loading } = useAuth();
  const [step, setStep] = useState<FlowStep>(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.search.includes("reset-password=true") || window.location.hash.includes("type=recovery")) {
      return "reset-password";
    }
    if (params.get("mode") === "signup") {
      return "signup";
    }
    return "login";
  });
  const [email, setEmail] = useState(() => new URLSearchParams(window.location.search).get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Google OAuth users who need to complete profile
  const [completingProfile, setCompletingProfile] = useState(false);

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: "",
    ageRange: "",
    department: "",
    institution: "",
    howFoundUs: "",
    interests: [],
    acceptedTerms: false,
  });

  // Track the newly created user ID for profile updates
  const [newUserId, setNewUserId] = useState<string | null>(null);

  if (loading) return null;

  // If logged in and onboarding completed, go to dashboard
  if (isLoggedIn && user?.onboardingCompleted && !completingProfile && step !== "reset-password" && step !== "password-updated") {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in but onboarding NOT completed (Google OAuth case), show profile steps
  if (isLoggedIn && user && !user.onboardingCompleted && !completingProfile && step !== "reset-password" && step !== "password-updated") {
    setCompletingProfile(true);
    setOnboardingData((prev) => ({
      ...prev,
      fullName: user.name || "",
    }));
    setStep("step-1");
  }

  const set = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setOnboardingData((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (interest: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const canAdvanceStep = () => {
    if (step === "step-1") return onboardingData.fullName.trim().length > 0 && onboardingData.ageRange !== "";
    if (step === "step-2") return onboardingData.department !== "" && onboardingData.institution.trim().length > 0 && onboardingData.howFoundUs !== "";
    if (step === "step-3") return onboardingData.interests.length > 0 && onboardingData.acceptedTerms;
    return false;
  };

  const currentStepNumber = step === "step-1" ? 1 : step === "step-2" ? 2 : step === "step-3" ? 3 : 0;

  const handleGoogleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth",
      },
    });
    if (error) {
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setSubmitting(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresá tu email");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset-password=true`,
    });
    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setStep("reset-sent");
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    setPassword("");
    setConfirmPassword("");
    setSubmitting(false);
    setStep("password-updated");
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Ingresá tu nombre"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }

    setSubmitting(true);
    const result = await signup(email, password, name);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    // Get user ID from the newly created session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      setNewUserId(sessionData.session.user.id);
    }

    // Pre-fill fullName from signup name
    setOnboardingData((prev) => ({ ...prev, fullName: name }));
    setSubmitting(false);
    setStep("step-1");
  };

  const handleFinishOnboarding = async () => {
    setSubmitting(true);

    const userId = completingProfile ? user?.id : newUserId;
    if (!userId) {
      // Fallback: try session
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id;
      if (!uid) {
        setError("No se pudo guardar el perfil. Intentá de nuevo.");
        setSubmitting(false);
        return;
      }
      setNewUserId(uid);
    }

    const finalUserId = completingProfile ? user?.id : (newUserId || (await supabase.auth.getSession()).data.session?.user?.id);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: onboardingData.fullName,
        display_name: onboardingData.fullName,
        age_range: onboardingData.ageRange,
        department: onboardingData.department,
        institution: onboardingData.institution,
        how_found_us: onboardingData.howFoundUs,
        interests: onboardingData.interests,
        accepted_terms: onboardingData.acceptedTerms,
        onboarding_completed: true,
      })
      .eq("user_id", finalUserId!);

    if (updateError) {
      setError("Error al guardar el perfil. Intentá de nuevo.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    if (completingProfile) {
      // Google OAuth: refresh profile and redirect
      await refreshProfile();
      window.location.href = "/dashboard";
    } else {
      // Email signup: show email confirmation
      setStep("email-confirmation");
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  if (step === "reset-sent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-3">
            Revisá tu email
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Si existe una cuenta con <strong className="text-foreground">{email}</strong>, Supabase enviará un link para verificar tu email y crear una nueva contraseña.
          </p>
          <Button variant="cta-outline" size="cta" onClick={() => { setStep("login"); setError(""); }}>
            Volver a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  if (step === "password-updated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-3">
            Contraseña actualizada
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Ya podés iniciar sesión con tu nueva contraseña.
          </p>
          <Button variant="cta" size="cta" onClick={() => { setStep("login"); setError(""); }}>
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  // Email confirmation screen
  if (step === "email-confirmation") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-3">
            ¡Bienvenido, {onboardingData.fullName.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mb-2">
            Ya sos parte de la nueva generación financiera de Uruguay.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Te enviamos un link de confirmación a <strong className="text-foreground">{email}</strong>. Hacé click en el link para activar tu cuenta.
          </p>
          <Button variant="cta-outline" size="cta" asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Onboarding steps (step-1, step-2, step-3)
  if (step === "step-1" || step === "step-2" || step === "step-3") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="max-w-md w-full">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= currentStepNumber ? "bg-foreground" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Paso {currentStepNumber} de 3
          </p>

          {step === "step-1" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Identidad Personal</h2>
              <p className="text-sm text-muted-foreground mb-6">Tu nombre aparecerá en tus futuros certificados.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre y Apellido *</label>
                  <input className={inputClass} value={onboardingData.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Ej: Ignacio Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Edad *</label>
                  <select className={inputClass} value={onboardingData.ageRange} onChange={(e) => set("ageRange", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {ageRanges.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === "step-2" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Contexto Educativo</h2>
              <p className="text-sm text-muted-foreground mb-6">Queremos conocer de dónde venís.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Departamento *</label>
                  <select className={inputClass} value={onboardingData.department} onChange={(e) => set("department", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Institución educativa *</label>
                  <input className={inputClass} value={onboardingData.institution} onChange={(e) => set("institution", e.target.value)} placeholder="¿A qué liceo, UTU o facultad vas?" />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo nos conociste? *</label>
                  <select className={inputClass} value={onboardingData.howFoundUs} onChange={(e) => set("howFoundUs", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {howFoundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === "step-3" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Compromiso con el Movimiento</h2>
              <p className="text-sm text-muted-foreground mb-6">¿Qué te trae acá?</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-3">¿Qué te interesa? * <span className="text-muted-foreground font-normal">(elegí una o más)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2.5 rounded-md border text-sm font-heading transition-colors ${
                          onboardingData.interests.includes(interest)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:bg-secondary"
                        }`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" checked={onboardingData.acceptedTerms} onChange={(e) => set("acceptedTerms", e.target.checked)} className="mt-1 w-4 h-4" />
                  <label className="text-sm text-muted-foreground">
                    Acepto que Foro Agora es un movimiento educativo sin fines de lucro y acepto los términos de uso. *
                  </label>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-destructive text-sm mt-4">{error}</p>}

          <div className="flex items-center gap-3 mt-8">
            {currentStepNumber > 1 && (
              <Button variant="cta-outline" size="cta" onClick={() => setStep(currentStepNumber === 2 ? "step-1" : "step-2")}>
                Atrás
              </Button>
            )}
            {currentStepNumber < 3 ? (
              <Button variant="cta" size="cta" className="flex-1" disabled={!canAdvanceStep()} onClick={() => setStep(currentStepNumber === 1 ? "step-2" : "step-3")}>
                Siguiente
              </Button>
            ) : (
              <Button variant="cta" size="cta" className="flex-1" disabled={!canAdvanceStep() || submitting} onClick={handleFinishOnboarding}>
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Completar registro
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login / Signup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={14} /> Volver
        </Link>

        <h1 className="text-2xl font-heading font-semibold text-foreground mb-1">
          {step === "login" ? "Iniciar sesión" : step === "forgot-password" ? "Recuperar contraseña" : step === "reset-password" ? "Nueva contraseña" : "Crear cuenta"}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {step === "login"
            ? "Ingresá a tu cuenta de Foro Agora."
            : step === "forgot-password"
              ? "Te enviaremos un link de verificación para cambiarla."
              : step === "reset-password"
                ? "Ingresá una contraseña nueva para tu cuenta."
                : "Registrate para acceder al programa."}
        </p>

        {(step === "login" || step === "signup") && (
          <>
            <button onClick={handleGoogleLogin}
              className="w-full h-12 rounded-md border border-border bg-background text-foreground text-sm font-heading font-medium flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-6">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-heading">o con email</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </>
        )}

        <form onSubmit={step === "login" ? handleLoginSubmit : step === "forgot-password" ? handleForgotPasswordSubmit : step === "reset-password" ? handleUpdatePasswordSubmit : handleSignupSubmit} className="space-y-4">
          {step === "signup" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
          )}
          {step !== "reset-password" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
          )}
          {(step === "login" || step === "signup" || step === "reset-password") && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">
                {step === "reset-password" ? "Nueva contraseña" : "Contraseña"}
              </label>
              <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
          )}
          {(step === "signup" || step === "reset-password") && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">
                {step === "reset-password" ? "Confirmar nueva contraseña" : "Confirmar contraseña"}
              </label>
              <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {step === "login" ? "Entrar" : step === "forgot-password" ? "Enviar link" : step === "reset-password" ? "Actualizar contraseña" : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {step === "login" ? (
            <>
              <button onClick={() => { setStep("forgot-password"); setError(""); }} className="text-foreground font-medium hover:underline">Olvidé mi contraseña</button>
              <span className="mx-2">·</span>
              ¿No tenés cuenta? <button onClick={() => { setStep("signup"); setError(""); }} className="text-foreground font-medium hover:underline">Registrate</button>
            </>
          ) : step === "forgot-password" || step === "reset-password" ? (
            <>¿Ya tenés cuenta? <button onClick={() => { setStep("login"); setError(""); }} className="text-foreground font-medium hover:underline">Iniciá sesión</button></>
          ) : (
            <>¿Ya tenés cuenta? <button onClick={() => { setStep("login"); setError(""); }} className="text-foreground font-medium hover:underline">Iniciá sesión</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

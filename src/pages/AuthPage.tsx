import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

const AuthPage = () => {
  const { isLoggedIn, login, signup, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (loading) return null;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const handleGoogleLogin = async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (mode === "login") {
      const result = await login(email, password);
      if (result.error) setError(result.error);
    } else {
      if (!name.trim()) {
        setError("Ingresá tu nombre");
        setSubmitting(false);
        return;
      }
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setSubmitting(false);
        return;
      }
      const result = await signup(email, password, name);
      if (result.error) {
        setError(result.error);
      } else {
        setSignupSuccess(true);
      }
    }
    setSubmitting(false);
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">Revisá tu email</h1>
          <p className="text-muted-foreground mb-6">
            Te enviamos un link de confirmación a <strong className="text-foreground">{email}</strong>.
            Hacé click en el link para activar tu cuenta.
          </p>
          <Button variant="cta-outline" size="cta" asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={14} /> Volver
        </Link>

        <h1 className="text-2xl font-heading font-semibold text-foreground mb-1">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {mode === "login" ? "Ingresá a tu cuenta de InvertíUY." : "Registrate para acceder al programa."}
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-md border border-border bg-background text-foreground text-sm font-heading font-medium flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-6"
        >
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
          )}
          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Contraseña</label>
            <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Confirmar contraseña</label>
              <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {mode === "login" ? (
            <>¿No tenés cuenta? <button onClick={() => { setMode("signup"); setError(""); }} className="text-foreground font-medium hover:underline">Registrate</button></>
          ) : (
            <>¿Ya tenés cuenta? <button onClick={() => { setMode("login"); setError(""); }} className="text-foreground font-medium hover:underline">Iniciá sesión</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

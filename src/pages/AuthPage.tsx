import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const AuthPage = () => {
  const { isLoggedIn, login, signup, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (loading) return null;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

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
            <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>

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

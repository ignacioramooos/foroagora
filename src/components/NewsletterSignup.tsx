import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

interface Props {
  variant?: "default" | "dark";
}

const NewsletterSignup = ({ variant = "default" }: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (localStorage.getItem("newsletter_subscribed") === "true") {
      setStatus("success");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed });

    if (error) {
      if (error.code === "23505") {
        setStatus("duplicate");
        localStorage.setItem("newsletter_subscribed", "true");
      } else {
        setStatus("error");
      }
    } else {
      setStatus("success");
      localStorage.setItem("newsletter_subscribed", "true");
    }
  };

  const isDark = variant === "dark";
  const textColor = isDark ? "text-primary-foreground" : "text-foreground";
  const mutedColor = isDark ? "text-primary-foreground/60" : "text-muted-foreground";

  if (status === "success") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={18} className="text-accent" />
        <span className={`text-sm font-heading ${textColor}`}>
          ¡Te sumaste! Te escribimos pronto.
        </span>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-heading text-warning">
          Ya estás en la lista. ¡Gracias!
        </span>
      </div>
    );
  }

  return (
    <div>
      <p className={`font-heading font-semibold text-base mb-1 ${textColor}`}>
        Recibí un concepto financiero por semana.
      </p>
      <p className={`text-sm mb-4 ${mutedColor}`}>
        Sin spam. Solo valor. Gratis.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          placeholder="tu@email.com"
          required
          className={`h-11 px-4 rounded-lg text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50 flex-1 min-w-0 ${
            isDark
              ? "bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
              : "bg-background border border-border text-foreground placeholder:text-muted-foreground"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 px-6 rounded-lg text-sm font-heading font-semibold bg-accent text-accent-foreground transition-colors shrink-0 disabled:opacity-50 hover:opacity-90"
        >
          {status === "loading" ? "..." : "Suscribirme"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-sm mt-2 text-destructive">
          Algo salió mal. Intentá de nuevo.
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;

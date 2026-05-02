import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2, MapPin, Calendar, Gift, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { curriculumClassCount } from "@/lib/curriculum";

const departments = [
  "Montevideo", "Canelones", "Maldonado", "Salto", "Colonia", "Paysandú",
  "Rivera", "Soriano", "Cerro Largo", "San José", "Tacuarembó", "Rocha",
  "Florida", "Durazno", "Artigas", "Treinta y Tres", "Lavalleja", "Flores", "Río Negro",
];

const hearOptions = ["Instagram", "Un amigo/a", "Mi liceo", "LinkedIn", "Google", "Otro"];

interface ClassSession {
  id: string;
  title: string;
  module_number: number;
  class_date: string;
  location: string;
  max_capacity: number;
}

const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("class") || "");
  const [moduleWarningOpen, setModuleWarningOpen] = useState(false);
  const [moduleWarningAccepted, setModuleWarningAccepted] = useState(false);
  const [accountPromptOpen, setAccountPromptOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "", age: "", school: "", department: "", email: "", phone: "", hearAbout: "", why: "", consent: false,
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;

  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        name: user.name || p.name,
        email: user.email || p.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setClassesLoading(false);
    }, 5000);

    const fetchClasses = async () => {
      const { data, error } = await (supabase as any)
        .from("class_sessions")
        .select("id, title, module_number, class_date, location, max_capacity")
        .eq("is_active", true)
        .gte("class_date", new Date().toISOString())
        .order("class_date", { ascending: true });

      if (error) {
        if (cancelled) return;
        setClasses([]);
        setClassesLoading(false);
        return;
      }

      if (cancelled) return;
      const sessions = (data || []) as ClassSession[];
      setClasses(sessions);
      if (!selectedClassId && sessions.length > 0) {
        setSelectedClassId(sessions[0].id);
      }
      setClassesLoading(false);
    };
    fetchClasses();
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [selectedClassId]);

  const set = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Campo requerido";
    if (!form.age || Number(form.age) < 13 || Number(form.age) > 99) e.age = "Ingresá una edad válida";
    if (!form.school.trim()) e.school = "Campo requerido";
    if (!form.department) e.department = "Seleccioná un departamento";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email inválido";
    if (!selectedClassId) e.class = "Seleccioná una clase";
    if (!form.consent) e.consent = "Debés aceptar para continuar";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitRegistration = async () => {
    setLoading(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    const { error } = await (supabase as any).from("class_registrations").insert({
      class_id: selectedClassId,
      name: form.name,
      age: Number(form.age),
      school: form.school,
      department: form.department,
      email: form.email,
      phone: form.phone || null,
      hear_about: form.hearAbout || null,
      why: form.why || null,
      consent: form.consent,
    });

    setLoading(false);

    if (error) {
      setErrors((prev) => ({ ...prev, submit: "Hubo un error. Intentá de nuevo." }));
      return;
    }

    setAccountPromptOpen(true);
  };

  const goToSignup = () => {
    const params = new URLSearchParams({
      mode: "signup",
      email: form.email.trim(),
    });
    navigate(`/auth?${params.toString()}`);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    if (selectedClass && selectedClass.module_number > 1 && !moduleWarningAccepted) {
      setModuleWarningOpen(true);
      return;
    }

    await submitRegistration();
  };

  const confirmModuleWarning = async () => {
    setModuleWarningAccepted(true);
    setModuleWarningOpen(false);
    await submitRegistration();
  };

  const formatClassDate = (value: string) => {
    const date = new Date(value);
    return `${date.toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "long" })}, ${date.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })}`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <SectionFade>
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-4">Inscripción recibida</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Te enviamos un email de confirmación a <strong className="text-foreground">{form.email}</strong>.
              Revisá tu bandeja de entrada para los próximos pasos.
            </p>
            <div className="border border-border rounded-lg p-6 text-left space-y-3 text-sm">
              <p className="font-heading font-semibold text-foreground">¿Qué sigue?</p>
              <p className="text-muted-foreground">Email con detalles de la clase</p>
              <p className="text-muted-foreground">Ubicación exacta 48h antes</p>
              <p className="text-muted-foreground">Invitación a la comunidad online</p>
            </div>
          </div>
        </SectionFade>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full h-12 px-4 rounded-md border bg-background text-foreground text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-ring/50 font-heading ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-5 gap-16">
          <div className="md:col-span-3">
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Inscripción
            </p>
            <h1 className="text-3xl md:text-4xl text-foreground mb-2">
              Inscribite a una clase
            </h1>
            <p className="text-muted-foreground mb-8">Completá el formulario. Toma 2 minutos.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Clase *</label>
                <select
                  className={inputClass("class")}
                  value={selectedClassId}
                  disabled={classesLoading || classes.length === 0}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setModuleWarningAccepted(false);
                    setErrors((p) => ({ ...p, class: "" }));
                  }}
                >
                  <option value="">{classesLoading ? "Cargando clases..." : classes.length === 0 ? "No hay clases disponibles" : "Seleccionar clase..."}</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} - Clase {c.module_number} de {curriculumClassCount} - {formatClassDate(c.class_date)}
                    </option>
                  ))}
                </select>
                {errors.class && <p className="text-destructive text-xs mt-1">{errors.class}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre completo *</label>
                <input className={inputClass("name")} value={form.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Edad *</label>
                  <input type="number" className={inputClass("age")} value={form.age} onChange={(e) => set("age", e.target.value)} />
                  {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Departamento *</label>
                  <select className={inputClass("department")} value={form.department} onChange={(e) => set("department", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-destructive text-xs mt-1">{errors.department}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Institución educativa *</label>
                <input className={inputClass("school")} value={form.school} onChange={(e) => set("school", e.target.value)} />
                {errors.school && <p className="text-destructive text-xs mt-1">{errors.school}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email *</label>
                <input type="email" className={inputClass("email")} value={form.email} onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Teléfono / WhatsApp <span className="text-muted-foreground text-xs">(opcional)</span></label>
                <input className={inputClass("phone")} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo nos conociste?</label>
                <select className={inputClass("hearAbout")} value={form.hearAbout} onChange={(e) => set("hearAbout", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {hearOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Por qué querés participar? <span className="text-muted-foreground text-xs">(opcional, máx 200 caracteres)</span></label>
                <textarea
                  className={`${inputClass("why")} h-24 py-3 resize-none`}
                  maxLength={200}
                  value={form.why}
                  onChange={(e) => set("why", e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <label className="text-sm text-muted-foreground">
                  Acepto recibir información sobre el programa por email. *
                </label>
              </div>
              {errors.consent && <p className="text-destructive text-xs">{errors.consent}</p>}
              {errors.submit && <p className="text-destructive text-xs">{errors.submit}</p>}
              <Button type="submit" variant="cta" size="cta" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Inscribirme"}
              </Button>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="border border-border rounded-lg p-8 sticky top-28 space-y-6">
              <h3 className="font-heading font-semibold text-foreground text-lg">¿Qué incluye?</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Clase seleccionada:</strong><br /><span className="text-muted-foreground">{selectedClass ? `${selectedClass.title} · Clase ${selectedClass.module_number} de ${curriculumClassCount}` : "Seleccioná una clase"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Ubicación:</strong><br /><span className="text-muted-foreground">{selectedClass?.location || "A confirmar"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Fecha y hora:</strong><br /><span className="text-muted-foreground">{selectedClass ? formatClassDate(selectedClass.class_date) : "A confirmar"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Gift size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Costo:</strong><br /><span className="text-muted-foreground">Sin costo</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Comunidad:</strong><br /><span className="text-muted-foreground">Acceso a grupo y recursos online</span></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground text-sm">
                  ¿Tenés dudas?{" "}
                  <a href="/contacto" className="text-foreground font-medium hover:underline">Contactanos</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={moduleWarningOpen} onOpenChange={setModuleWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Esta clase empieza en la clase {selectedClass?.module_number} del plan</DialogTitle>
            <DialogDescription>
              Si es tu primera vez viniendo a clase, la clase anterior puede estar grabada y subida en la sección de clases. Podés verla antes de asistir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button variant="outline" onClick={() => setModuleWarningOpen(false)}>
              No, no quiero registrarme
            </Button>
            <Button variant="cta" onClick={confirmModuleWarning} disabled={loading}>
              Sí, quiero registrarme
            </Button>
            <Button asChild variant="secondary">
              <Link to="/auth">Ver clases grabadas --&gt;</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={accountPromptOpen} onOpenChange={setAccountPromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Querés crear una cuenta?</DialogTitle>
            <DialogDescription>
              Tu inscripción a la clase quedó registrada. Si creás una cuenta en Foro Agora, vas a poder acceder a clases grabadas y más materiales del programa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button variant="cta" onClick={goToSignup}>
              Sí, crear cuenta
            </Button>
            <Button variant="outline" onClick={() => { setAccountPromptOpen(false); setSubmitted(true); }}>
              No, continuar sin cuenta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterPage;

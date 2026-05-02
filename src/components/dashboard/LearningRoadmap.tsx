import { useAuth } from "@/contexts/AuthContext";
import { buildCurriculumProgress, type CurriculumProgressStatus } from "@/lib/curriculum";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const statusConfig: Record<CurriculumProgressStatus, { icon: typeof CheckCircle2; label: string; color: string }> = {
  completed: { icon: CheckCircle2, label: "Completado", color: "text-foreground" },
  in_progress: { icon: Circle, label: "En curso", color: "text-accent" },
  locked: { icon: Lock, label: "Bloqueado", color: "text-muted-foreground/40" },
};

const LearningRoadmap = () => {
  const { user } = useAuth();
  const progressItems = buildCurriculumProgress(user?.completedClasses ?? 0);

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl md:text-3xl text-foreground mb-2">Mi Progreso</h1>
      <p className="text-muted-foreground mb-10">Tu recorrido por las 5 clases de análisis fundamental.</p>

      <div className="space-y-0">
        {progressItems.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          const isLast = i === progressItems.length - 1;

          return (
            <div key={item.id} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  item.status === "completed" ? "border-foreground bg-foreground" :
                  item.status === "in_progress" ? "border-accent bg-background" :
                  "border-border bg-secondary"
                }`}>
                  <Icon size={18} className={
                    item.status === "completed" ? "text-background" :
                    item.status === "in_progress" ? "text-accent" :
                    "text-muted-foreground/40"
                  } />
                </div>
                {!isLast && (
                  <div className={`w-px flex-1 min-h-[40px] ${
                    item.status === "completed" ? "bg-foreground" : "bg-border"
                  }`} />
                )}
              </div>

              <div className={`pb-8 ${item.status === "locked" ? "opacity-50" : ""}`}>
                <h3 className="font-heading font-semibold text-foreground text-lg">
                  Clase {item.classNumber}: {item.title}
                </h3>
                <p className={`text-sm font-heading ${config.color}`}>{config.label}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.summary}</p>
                {item.status === "in_progress" && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
                    <button className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors">
                      Continuar Clase {item.classNumber}
                    </button>
                  </div>
                )}
                {item.status === "completed" && (
                  <p className="text-sm text-muted-foreground mt-2">Clase completada</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningRoadmap;

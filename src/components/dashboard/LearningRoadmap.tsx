import { mockModules } from "@/lib/mockData";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Completado", color: "text-foreground" },
  in_progress: { icon: Circle, label: "En curso", color: "text-accent" },
  locked: { icon: Lock, label: "Bloqueado", color: "text-muted-foreground/40" },
};

const LearningRoadmap = () => (
  <div className="p-6 md:p-10 max-w-3xl">
    <h1 className="text-2xl md:text-3xl text-foreground mb-2">Mi Progreso</h1>
    <p className="text-muted-foreground mb-10">Tu recorrido por el programa de análisis fundamental.</p>

    <div className="space-y-0">
      {mockModules.map((mod, i) => {
        const config = statusConfig[mod.status];
        const Icon = config.icon;
        const isLast = i === mockModules.length - 1;

        return (
          <div key={mod.id} className="flex gap-5">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                mod.status === "completed" ? "border-foreground bg-foreground" :
                mod.status === "in_progress" ? "border-accent bg-background" :
                "border-border bg-secondary"
              }`}>
                <Icon size={18} className={
                  mod.status === "completed" ? "text-background" :
                  mod.status === "in_progress" ? "text-accent" :
                  "text-muted-foreground/40"
                } />
              </div>
              {!isLast && (
                <div className={`w-px flex-1 min-h-[40px] ${
                  mod.status === "completed" ? "bg-foreground" : "bg-border"
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-8 ${mod.status === "locked" ? "opacity-50" : ""}`}>
              <h3 className="font-heading font-semibold text-foreground text-lg">{mod.title}</h3>
              <p className={`text-sm font-heading ${config.color}`}>{config.label}</p>
              {mod.status === "in_progress" && mod.currentClass && mod.totalClasses && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Clase {mod.currentClass} de {mod.totalClasses}</p>
                  <button className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 transition-colors">
                    Continuar Clase {mod.currentClass}
                  </button>
                </div>
              )}
              {mod.status === "completed" && mod.totalClasses && (
                <p className="text-sm text-muted-foreground mt-1">{mod.totalClasses} clases completadas</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default LearningRoadmap;

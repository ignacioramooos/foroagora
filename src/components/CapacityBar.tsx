import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const CapacityBar = () => {
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [taken, setTaken] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: classes } = await (supabase as any)
        .from("class_sessions")
        .select("id, max_capacity")
        .eq("is_active", true)
        .gte("class_date", new Date().toISOString())
        .order("class_date", { ascending: true })
        .limit(1);

      if (!classes || classes.length === 0) {
        setLoading(false);
        return;
      }

      setMaxCapacity(classes[0].max_capacity);

      const { count } = await (supabase as any)
        .from("class_registrations")
        .select("*", { count: "exact", head: true })
        .eq("class_id", classes[0].id);

      setTaken(count ?? 0);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || maxCapacity === null) return null;

  const available = maxCapacity - taken;
  const percent = Math.min((taken / maxCapacity) * 100, 100);
  const availablePercent = (available / maxCapacity) * 100;
  const isFull = available <= 0;

  let barColorClass = "bg-accent";
  let urgencyText: string | null = null;
  let urgencyColorClass = "";

  if (isFull) {
    barColorClass = "bg-destructive";
  } else if (availablePercent < 10) {
    barColorClass = "bg-destructive";
    urgencyText = "¡Últimos cupos!";
    urgencyColorClass = "text-destructive";
  } else if (availablePercent <= 30) {
    barColorClass = "bg-warning";
    urgencyText = "¡Quedan pocos lugares!";
    urgencyColorClass = "text-warning";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {isFull
            ? "Cupos agotados"
            : `${taken} de ${maxCapacity} cupos ocupados`}
        </span>
        {urgencyText && (
          <span className={`font-heading font-medium text-xs ${urgencyColorClass}`}>
            {urgencyText}
          </span>
        )}
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;

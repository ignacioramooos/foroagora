import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const CapacityBar = () => {
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [taken, setTaken] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get active cohort
      const { data: cohorts } = await supabase
        .from("cohorts")
        .select("max_capacity")
        .eq("is_active", true)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(1);

      if (!cohorts || cohorts.length === 0) {
        setLoading(false);
        return;
      }

      setMaxCapacity(cohorts[0].max_capacity);

      // TODO: registrations aren't linked to cohorts yet, using total profile count as proxy
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

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

  let barColor = "#22D07A";
  let urgencyText: string | null = null;

  if (isFull) {
    barColor = "#EF4444";
    urgencyText = null; // handled separately
  } else if (availablePercent < 10) {
    barColor = "#EF4444";
    urgencyText = "¡Últimos cupos!";
  } else if (availablePercent <= 30) {
    barColor = "#F59E0B";
    urgencyText = "¡Quedan pocos lugares!";
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
          <span className="font-heading font-medium text-xs" style={{ color: barColor }}>
            {urgencyText}
          </span>
        )}
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;

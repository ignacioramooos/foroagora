import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CohortCountdown = () => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      const { data } = await supabase
        .from("cohorts")
        .select("start_date")
        .eq("is_active", true)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(1);

      if (data && data.length > 0) {
        setTargetDate(new Date(data[0].start_date));
      }
      setLoading(false);
    };
    fetchCohort();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (loading || (!targetDate && !expired)) return null;

  if (expired) {
    return (
      <p className="text-sm font-heading font-medium" style={{ color: "#22D07A" }}>
        ¡Inscripciones abiertas para el próximo cohorte!
      </p>
    );
  }

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "DÍAS" },
    { value: timeLeft.hours, label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEG" },
  ];

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center justify-center rounded"
          style={{
            width: 40,
            height: 48,
            backgroundColor: "#0D1B2A",
          }}
        >
          <span className="text-white text-xl font-semibold leading-none tabular-nums">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-white/50 mt-0.5">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CohortCountdown;

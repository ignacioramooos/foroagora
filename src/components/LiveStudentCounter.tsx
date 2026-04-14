import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const LiveStudentCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { count: total } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setCount(total ?? 0);
    };
    fetchCount();

    const channel = supabase
      .channel("profiles-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchCount()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Animate count-up
  useEffect(() => {
    if (count === null || animatedRef.current) return;
    animatedRef.current = true;
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * count));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [count]);

  // Update display when count changes after initial animation
  useEffect(() => {
    if (count !== null && animatedRef.current) {
      setDisplayCount(count);
    }
  }, [count]);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22D07A" }} />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22D07A" }} />
      </span>
      <span className="text-sm text-muted-foreground">
        {count === 0 ? (
          "Sé el primero en anotarte"
        ) : (
          <><span className="font-heading font-semibold text-foreground">{displayCount}</span> jóvenes ya se anotaron</>
        )}
      </span>
    </div>
  );
};

export default LiveStudentCounter;

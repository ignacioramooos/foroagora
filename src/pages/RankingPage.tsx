import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SectionFade from "@/components/SectionFade";
import { Trophy } from "lucide-react";

interface RankEntry {
  display_name: string | null;
  full_name: string | null;
  last_portfolio_value: number | null;
  cash_balance: number;
  user_id: string;
}

const RankingPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{ name: string; value: number; returnPct: number; userId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("user_id, cash_balance, last_portfolio_value");

      if (!portfolios || portfolios.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = portfolios.map((p) => p.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, full_name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const ranked = portfolios
        .map((p) => {
          const profile = profileMap.get(p.user_id);
          const fullName = profile?.full_name || profile?.display_name || "Anónimo";
          const parts = fullName.trim().split(" ");
          const name = parts[0] + (parts.length > 1 ? ` ${parts[parts.length - 1][0]}.` : "");
          const totalValue = p.last_portfolio_value ?? p.cash_balance;
          return {
            name,
            value: totalValue,
            returnPct: ((totalValue / 10000 - 1) * 100),
            userId: p.user_id,
          };
        })
        .sort((a, b) => b.value - a.value);

      setEntries(ranked);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const podiumColors = ["text-yellow-400", "text-gray-400", "text-amber-600"];

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Ranking
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground mb-4">Tabla de posiciones</h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Ranking de portafolios simulados de los estudiantes del programa.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <Trophy size={40} className="mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl text-foreground mb-4">El ranking está vacío</h2>
              <p className="text-muted-foreground">¡Sé el primero en operar!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e, i) => {
                const isCurrentUser = user?.id === e.userId;
                return (
                  <div
                    key={e.userId}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
                      isCurrentUser ? "border-[#22D07A]/40 bg-[#22D07A]/5" : "border-border"
                    }`}
                  >
                    <span className={`text-lg font-heading font-bold w-8 text-center ${i < 3 ? podiumColors[i] : "text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 font-heading font-medium text-foreground text-sm">{e.name}</span>
                    <span className="text-sm text-muted-foreground font-heading">
                      ${e.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-heading font-medium ${e.returnPct >= 0 ? "text-[#22D07A]" : "text-red-500"}`}>
                      {e.returnPct >= 0 ? "+" : ""}{e.returnPct.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RankingPage;

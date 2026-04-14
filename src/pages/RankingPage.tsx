import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RankEntry {
  user_id: string;
  display_name: string;
  last_portfolio_value: number;
  return_pct: number;
}

const RankingPage = () => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadRanking = async () => {
    setLoading(true);
    // Fetch portfolios and profiles separately, then join by user_id
    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("user_id, last_portfolio_value")
      .order("last_portfolio_value", { ascending: false });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, full_name");

    if (portfolios) {
      const profileMap = new Map<string, { display_name?: string; full_name?: string }>();
      (profiles || []).forEach((p: any) => profileMap.set(p.user_id, p));

      const mapped: RankEntry[] = portfolios.map((row: any) => {
        const profile = profileMap.get(row.user_id);
        const name = profile?.full_name || profile?.display_name || "Anónimo";
        const parts = name.trim().split(" ");
        const anonymized = parts.length > 1
          ? `${parts[0]} ${parts[parts.length - 1][0]}.`
          : parts[0];

        return {
          user_id: row.user_id,
          display_name: anonymized,
          last_portfolio_value: Number(row.last_portfolio_value) || 10000,
          return_pct: ((Number(row.last_portfolio_value) || 10000) / 10000 - 1) * 100,
        };
      });
      setEntries(mapped);
    }
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { loadRanking(); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <Trophy size={36} className="mx-auto mb-3" style={{ color: "#22D07A" }} />
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">Ranking</h1>
            <p className="text-muted-foreground text-sm">
              Portfolios simulados de los estudiantes de InvertíUY
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">El ranking está vacío. ¡Sé el primero en operar!</p>
            </div>
          ) : (
            <>
              {/* Podium */}
              {top3.length > 0 && (
                <div className="flex items-end justify-center gap-4 mb-10">
                  {[1, 0, 2].map((idx) => {
                    const entry = top3[idx];
                    if (!entry) return <div key={idx} className="w-24" />;
                    const isFirst = idx === 0;
                    const rank = idx + 1;
                    const isCurrentUser = session?.user?.id === entry.user_id;
                    return (
                      <div key={idx} className="text-center">
                        <div
                          className={`rounded-xl border border-border p-4 ${isFirst ? "pb-8" : "pb-5"} ${isCurrentUser ? "ring-2" : ""}`}
                          style={{
                            minWidth: isFirst ? 130 : 110,
                            ...(isCurrentUser ? { borderColor: "#22D07A", ringColor: "#22D07A" } : {}),
                          }}
                        >
                          <span
                            className="text-2xl font-heading font-bold block mb-1"
                            style={{ color: podiumColors[idx] }}
                          >
                            {rank}°
                          </span>
                          <p className="text-sm font-heading font-medium text-foreground truncate">
                            {entry.display_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{formatCurrency(entry.last_portfolio_value)}</p>
                          <p
                            className="text-xs font-heading font-medium mt-0.5"
                            style={{ color: entry.return_pct >= 0 ? "#22D07A" : "#EF4444" }}
                          >
                            {entry.return_pct >= 0 ? "+" : ""}{entry.return_pct.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rest of ranking */}
              {rest.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["#", "Nombre", "Valor", "Retorno"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rest.map((e, i) => {
                        const isCurrentUser = session?.user?.id === e.user_id;
                        return (
                          <tr
                            key={e.user_id}
                            className={`border-b border-border last:border-0 ${isCurrentUser ? "bg-secondary/50" : ""}`}
                          >
                            <td className="px-4 py-3 font-heading text-muted-foreground">{i + 4}</td>
                            <td className="px-4 py-3 font-heading font-medium text-foreground">
                              {e.display_name}
                              {isCurrentUser && <span className="ml-2 text-xs" style={{ color: "#22D07A" }}>(vos)</span>}
                            </td>
                            <td className="px-4 py-3 font-heading text-foreground">{formatCurrency(e.last_portfolio_value)}</td>
                            <td className="px-4 py-3">
                              <span className="font-heading font-medium" style={{ color: e.return_pct >= 0 ? "#22D07A" : "#EF4444" }}>
                                {e.return_pct >= 0 ? "+" : ""}{e.return_pct.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Refresh */}
          <div className="flex items-center justify-center mt-6 gap-3">
            <Button onClick={loadRanking} variant="cta-outline" size="sm" className="gap-2">
              <RefreshCw size={14} /> Actualizar
            </Button>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground font-heading">
                Última actualización: {lastUpdated.toLocaleTimeString("es-UY")}
              </span>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RankingPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, RefreshCw } from "lucide-react";

const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

interface LeaderboardEntry {
  display_name: string;
  user_id: string;
  total_value: number;
  return_percent: number;
}

const RankingPage = () => {
  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("user_id, cash_balance, last_portfolio_value")
      .order("last_portfolio_value", { ascending: false })
      .limit(50);

    if (!portfolios?.length) { setEntries([]); setLoading(false); return; }

    const userIds = portfolios.map(p => p.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, full_name")
      .in("user_id", userIds);

    const profileMap = new Map<string, string>();
    profiles?.forEach(p => {
      const name = p.display_name || p.full_name || "Anónimo";
      const parts = name.split(" ");
      const display = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
      profileMap.set(p.user_id, display);
    });

    const result: LeaderboardEntry[] = portfolios.map(p => {
      const totalValue = Number(p.last_portfolio_value || p.cash_balance || 10000);
      return {
        user_id: p.user_id,
        display_name: profileMap.get(p.user_id) || "Anónimo",
        total_value: totalValue,
        return_percent: ((totalValue / 10000) - 1) * 100,
      };
    });

    setEntries(result);
    setLoading(false);
  };

  useEffect(() => { fetchLeaderboard(); }, []);

  const top3 = entries.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 md:py-24 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Ranking del portafolio</h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Clasificación de participantes por rendimiento. Solo con fines educativos.
          </p>
          <p className="text-xs text-muted-foreground mt-2 bg-secondary inline-block px-3 py-1 rounded-full">
            Los valores se actualizan cuando cada usuario visita su portafolio.
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button size="sm" variant="outline" onClick={fetchLeaderboard} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualizar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}
          </div>
        ) : entries.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground space-y-3">
            <p className="font-heading font-medium">El ranking está vacío.</p>
            <p className="text-sm">¡Sé el primero en operar desde tu dashboard!</p>
            <Button variant="cta" asChild><Link to="/dashboard">Ir al dashboard</Link></Button>
          </CardContent></Card>
        ) : (
          <>
            {/* Podium (desktop) */}
            {entries.length >= 3 && (
            <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
              {podiumOrder.map((entry, i) => {
                const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
                const isCenter = rank === 1;
                return (
                  <Card key={entry.user_id} className={`${isCenter ? "scale-105 border-accent/30" : ""} ${entry.user_id === currentUserId ? "ring-1 ring-accent/20" : ""}`}>
                    <CardContent className={`p-5 text-center ${isCenter ? "py-8" : ""}`}>
                      <div className={`text-2xl font-heading font-bold mb-1 ${rank === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                        {rank === 1 && <Trophy size={20} className="inline mr-1 text-accent" />}#{rank}
                      </div>
                      <p className="font-heading font-medium text-sm mb-2">{entry.display_name}</p>
                      <p className="text-lg font-heading font-semibold tabular-nums">{fmt(entry.total_value)}</p>
                      <p className={`text-sm tabular-nums ${entry.return_percent >= 0 ? "text-accent" : "text-destructive"}`}>
                        {pct(entry.return_percent)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            )}

            {/* Full table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Valor del portafolio</TableHead>
                    <TableHead>Retorno</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((e, i) => (
                    <TableRow key={e.user_id} className={e.user_id === currentUserId ? "bg-accent/5 font-semibold" : ""}>
                      <TableCell className="font-heading font-bold">{i + 1}</TableCell>
                      <TableCell className="font-heading">{e.display_name}</TableCell>
                      <TableCell className="tabular-nums">{fmt(e.total_value)}</TableCell>
                      <TableCell className={`tabular-nums ${e.return_percent >= 0 ? "text-accent" : "text-destructive"}`}>
                        {pct(e.return_percent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          Este portafolio es simulado con fines educativos. No constituye asesoramiento financiero ni involucra dinero real. InvertíUY no es un broker ni servicio de inversión.
        </p>
      </div>
    </div>
  );
};

export default RankingPage;

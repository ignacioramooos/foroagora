import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMultipleStockPrices, StockQuote, SUPPORTED_STOCKS, fetchStockHistory, StockHistoryPoint } from "@/lib/stockData";
import { DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, ChevronDown, ChevronUp, Search, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Portfolio {
  id: string;
  cash_balance: number;
  last_portfolio_value: number;
}

interface Holding {
  id: string;
  portfolio_id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost_per_share: number;
}

interface Transaction {
  id: string;
  ticker: string;
  company_name: string;
  transaction_type: string;
  shares: number;
  price_per_share: number;
  total_amount: number;
  executed_at: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const PortfolioTab = () => {
  const { session } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [txPage, setTxPage] = useState(0);

  // Trade state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [tradeShares, setTradeShares] = useState("");
  const [tradeMode, setTradeMode] = useState<"BUY" | "SELL">("BUY");
  const [trading, setTrading] = useState(false);
  const [tradeError, setTradeError] = useState("");

  // Chart modal
  const [chartTicker, setChartTicker] = useState<string | null>(null);
  const [chartData, setChartData] = useState<StockHistoryPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const userId = session?.user?.id;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Check if portfolio exists, create if not
    let { data: p } = await supabase
      .from("portfolios")
      .select("id, cash_balance, last_portfolio_value")
      .eq("user_id", userId)
      .maybeSingle();

    if (!p) {
      const { data: newP } = await supabase
        .from("portfolios")
        .insert({ user_id: userId })
        .select("id, cash_balance, last_portfolio_value")
        .single();
      p = newP;
    }

    if (!p) { setLoading(false); return; }
    setPortfolio(p as Portfolio);

    const [{ data: h }, { data: t }] = await Promise.all([
      supabase.from("portfolio_holdings").select("*").eq("portfolio_id", p.id).gt("shares", 0),
      supabase.from("portfolio_transactions").select("*").eq("portfolio_id", p.id).order("executed_at", { ascending: false }),
    ]);

    const holdingsData = (h || []) as Holding[];
    setHoldings(holdingsData);
    setTransactions((t || []) as Transaction[]);
    setLoading(false);

    // Fetch prices
    if (holdingsData.length > 0) {
      setPricesLoading(true);
      const tickers = holdingsData.map((h) => h.ticker);
      const priceMap = await fetchMultipleStockPrices(tickers);
      setPrices(priceMap);
      setPricesLoading(false);

      // Update last_portfolio_value
      let holdingsValue = 0;
      holdingsData.forEach((h) => {
        const q = priceMap.get(h.ticker);
        if (q) holdingsValue += q.price * h.shares;
      });
      const totalValue = p.cash_balance + holdingsValue;
      await supabase.from("portfolios").update({ last_portfolio_value: totalValue }).eq("id", p.id);
    }
  }, [userId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Calculate metrics
  const holdingsValue = holdings.reduce((sum, h) => {
    const q = prices.get(h.ticker);
    return sum + (q ? q.price * h.shares : h.avg_cost_per_share * h.shares);
  }, 0);
  const totalValue = (portfolio?.cash_balance || 0) + holdingsValue;
  const totalReturn = ((totalValue / 10000) - 1) * 100;

  // Search
  const searchResults = searchQuery.length > 0
    ? SUPPORTED_STOCKS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectTicker = async (ticker: string) => {
    setSelectedTicker(ticker);
    setSearchQuery("");
    setTradeError("");
    setTradeShares("");
    const existingHolding = holdings.find((h) => h.ticker === ticker);
    setTradeMode(existingHolding ? "BUY" : "BUY");

    // Fetch fresh price
    const priceMap = await fetchMultipleStockPrices([ticker]);
    const q = priceMap.get(ticker);
    setSelectedQuote(q || null);
  };

  const tradeSharesNum = parseFloat(tradeShares) || 0;
  const tradeTotal = tradeSharesNum * (selectedQuote?.price || 0);
  const existingHolding = holdings.find((h) => h.ticker === selectedTicker);

  const handleTrade = async () => {
    if (!portfolio || !selectedTicker || !selectedQuote || tradeSharesNum <= 0) return;
    setTradeError("");
    setTrading(true);

    try {
      if (tradeMode === "BUY") {
        if (tradeTotal > portfolio.cash_balance) {
          setTradeError("Saldo insuficiente");
          setTrading(false);
          return;
        }

        // Deduct cash
        await supabase.from("portfolios").update({
          cash_balance: portfolio.cash_balance - tradeTotal,
        }).eq("id", portfolio.id);

        // Upsert holding
        if (existingHolding) {
          const newShares = existingHolding.shares + tradeSharesNum;
          const newAvg = (existingHolding.shares * existingHolding.avg_cost_per_share + tradeSharesNum * selectedQuote.price) / newShares;
          await supabase.from("portfolio_holdings").update({
            shares: newShares,
            avg_cost_per_share: Math.round(newAvg * 100) / 100,
          }).eq("id", existingHolding.id);
        } else {
          await supabase.from("portfolio_holdings").insert({
            portfolio_id: portfolio.id,
            ticker: selectedTicker,
            company_name: selectedQuote.companyName,
            shares: tradeSharesNum,
            avg_cost_per_share: selectedQuote.price,
          });
        }

        // Record transaction
        await supabase.from("portfolio_transactions").insert({
          portfolio_id: portfolio.id,
          ticker: selectedTicker,
          company_name: selectedQuote.companyName,
          transaction_type: "BUY",
          shares: tradeSharesNum,
          price_per_share: selectedQuote.price,
          total_amount: tradeTotal,
        });
      } else {
        // SELL
        if (!existingHolding || tradeSharesNum > existingHolding.shares) {
          setTradeError("No tenés suficientes acciones");
          setTrading(false);
          return;
        }

        const proceeds = tradeSharesNum * selectedQuote.price;

        await supabase.from("portfolios").update({
          cash_balance: portfolio.cash_balance + proceeds,
        }).eq("id", portfolio.id);

        const remainingShares = existingHolding.shares - tradeSharesNum;
        if (remainingShares <= 0) {
          await supabase.from("portfolio_holdings").delete().eq("id", existingHolding.id);
        } else {
          await supabase.from("portfolio_holdings").update({
            shares: remainingShares,
          }).eq("id", existingHolding.id);
        }

        await supabase.from("portfolio_transactions").insert({
          portfolio_id: portfolio.id,
          ticker: selectedTicker,
          company_name: selectedQuote.companyName,
          transaction_type: "SELL",
          shares: tradeSharesNum,
          price_per_share: selectedQuote.price,
          total_amount: proceeds,
        });
      }

      setSelectedTicker(null);
      setSelectedQuote(null);
      setTradeShares("");
      await loadData();
    } catch {
      setTradeError("Error al ejecutar la operación");
    }
    setTrading(false);
  };

  const openChart = async (ticker: string) => {
    setChartTicker(ticker);
    setChartLoading(true);
    const data = await fetchStockHistory(ticker);
    setChartData(data);
    setChartLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const paginatedTx = transactions.slice(txPage * 10, (txPage + 1) * 10);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Saldo disponible", value: formatCurrency(portfolio?.cash_balance || 0), icon: Wallet },
          { label: "Valor holdings", value: pricesLoading ? "..." : formatCurrency(holdingsValue), icon: PieChart },
          { label: "Valor total", value: pricesLoading ? "..." : formatCurrency(totalValue), icon: DollarSign },
          {
            label: "Retorno total",
            value: pricesLoading ? "..." : `${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`,
            icon: totalReturn >= 0 ? TrendingUp : TrendingDown,
            color: totalReturn >= 0 ? "#22D07A" : "#EF4444",
          },
        ].map((m) => (
          <div key={m.label} className="border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <m.icon size={14} className="text-muted-foreground" style={m.color ? { color: m.color } : undefined} />
              <span className="text-xs font-heading text-muted-foreground">{m.label}</span>
            </div>
            <p className="text-lg font-heading font-semibold text-foreground" style={m.color ? { color: m.color } : undefined}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Trade panel */}
      <div className="border border-border rounded-lg p-5">
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">Operar</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ticker o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 font-heading"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              {searchResults.map((s) => (
                <button
                  key={s.ticker}
                  onClick={() => handleSelectTicker(s.ticker)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-heading hover:bg-secondary transition-colors"
                >
                  <span className="font-medium text-foreground">{s.ticker}</span>
                  <span className="text-muted-foreground text-xs">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected stock trade form */}
        {selectedTicker && selectedQuote && (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-heading font-semibold text-foreground">{selectedQuote.companyName}</p>
                <p className="text-xs text-muted-foreground">{selectedTicker} · Precio en tiempo real</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-semibold text-foreground">{formatCurrency(selectedQuote.price)}</p>
                <p className="text-xs" style={{ color: selectedQuote.change >= 0 ? "#22D07A" : "#EF4444" }}>
                  {selectedQuote.change >= 0 ? "+" : ""}{selectedQuote.change} ({selectedQuote.changePercent}%)
                </p>
              </div>
            </div>

            {/* Buy/Sell toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setTradeMode("BUY"); setTradeError(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-heading font-medium transition-colors ${
                  tradeMode === "BUY" ? "text-white" : "bg-secondary text-muted-foreground"
                }`}
                style={tradeMode === "BUY" ? { backgroundColor: "#22D07A" } : undefined}
              >
                Comprar
              </button>
              <button
                onClick={() => { setTradeMode("SELL"); setTradeError(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-heading font-medium transition-colors ${
                  tradeMode === "SELL" ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground"
                }`}
              >
                Vender
              </button>
            </div>

            {tradeMode === "SELL" && existingHolding && (
              <p className="text-xs text-muted-foreground mb-2">
                Tenés {existingHolding.shares} acciones de {selectedTicker}
              </p>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-heading text-muted-foreground mb-1 block">Cantidad de acciones</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tradeShares}
                  onChange={(e) => { setTradeShares(e.target.value); setTradeError(""); }}
                  placeholder="0.00"
                  className="font-heading"
                />
              </div>
              <div className="text-right pb-1">
                <p className="text-xs text-muted-foreground">
                  {tradeMode === "BUY" ? "Total a invertir" : "Recibirás"}
                </p>
                <p className="font-heading font-semibold text-foreground">{formatCurrency(tradeTotal)}</p>
              </div>
            </div>

            {tradeError && (
              <p className="text-xs text-red-500 mt-2">{tradeError}</p>
            )}

            <Button
              onClick={handleTrade}
              disabled={trading || tradeSharesNum <= 0}
              className="w-full mt-4 gap-2"
              variant="cta"
              size="sm"
            >
              {trading ? "Ejecutando..." : tradeMode === "BUY" ? "Comprar" : "Vender"} <ArrowRight size={14} />
            </Button>

            <button
              onClick={() => { setSelectedTicker(null); setSelectedQuote(null); }}
              className="w-full text-center text-xs text-muted-foreground mt-2 hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Holdings */}
      <div>
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Mis posiciones
        </p>
        {holdings.length === 0 ? (
          <div className="border border-border rounded-lg p-8 text-center">
            <PieChart size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Tu portafolio está vacío. ¡Comprá tu primera acción! ↑
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Ticker", "Acciones", "Costo prom.", "Precio actual", "Valor", "P&L", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const q = prices.get(h.ticker);
                  const currentPrice = q?.price || h.avg_cost_per_share;
                  const value = currentPrice * h.shares;
                  const pnl = (currentPrice - h.avg_cost_per_share) * h.shares;
                  const pnlPct = ((currentPrice / h.avg_cost_per_share) - 1) * 100;
                  const isPositive = pnl >= 0;

                  return (
                    <tr key={h.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-heading font-medium text-foreground">{h.ticker}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{h.company_name}</p>
                      </td>
                      <td className="px-4 py-3 font-heading text-foreground">{h.shares}</td>
                      <td className="px-4 py-3 font-heading text-muted-foreground">{formatCurrency(h.avg_cost_per_share)}</td>
                      <td className="px-4 py-3 font-heading text-foreground">
                        {pricesLoading ? "..." : formatCurrency(currentPrice)}
                      </td>
                      <td className="px-4 py-3 font-heading text-foreground">{pricesLoading ? "..." : formatCurrency(value)}</td>
                      <td className="px-4 py-3">
                        <span className="font-heading font-medium" style={{ color: isPositive ? "#22D07A" : "#EF4444" }}>
                          {isPositive ? "+" : ""}{formatCurrency(pnl)}
                          <span className="text-xs ml-1">({pnlPct.toFixed(1)}%)</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openChart(h.ticker)} className="text-xs text-muted-foreground hover:text-foreground font-heading">
                            Gráfico
                          </button>
                          <span className="text-muted-foreground/30">·</span>
                          <button
                            onClick={() => { handleSelectTicker(h.ticker); setTradeMode("SELL"); }}
                            className="text-xs text-red-400 hover:text-red-300 font-heading"
                          >
                            Vender
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transactions */}
      {transactions.length > 0 && (
        <div>
          <button
            onClick={() => setTxOpen(!txOpen)}
            className="flex items-center gap-2 text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3 hover:text-foreground transition-colors"
          >
            Historial de operaciones
            {txOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {txOpen && (
            <div className="border border-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Fecha", "Tipo", "Ticker", "Acciones", "Precio", "Total"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedTx.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground font-heading">
                        {new Date(t.executed_at).toLocaleDateString("es-UY")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-heading font-medium px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: t.transaction_type === "BUY" ? "rgba(34,208,122,0.1)" : "rgba(239,68,68,0.1)",
                            color: t.transaction_type === "BUY" ? "#22D07A" : "#EF4444",
                          }}
                        >
                          {t.transaction_type === "BUY" ? "Compra" : "Venta"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-heading font-medium text-foreground">{t.ticker}</td>
                      <td className="px-4 py-3 font-heading text-foreground">{t.shares}</td>
                      <td className="px-4 py-3 font-heading text-muted-foreground">{formatCurrency(t.price_per_share)}</td>
                      <td className="px-4 py-3 font-heading text-foreground">{formatCurrency(t.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length > 10 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <button
                    disabled={txPage === 0}
                    onClick={() => setTxPage(txPage - 1)}
                    className="text-xs font-heading text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-muted-foreground font-heading">
                    Página {txPage + 1} de {Math.ceil(transactions.length / 10)}
                  </span>
                  <button
                    disabled={(txPage + 1) * 10 >= transactions.length}
                    onClick={() => setTxPage(txPage + 1)}
                    className="text-xs font-heading text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chart modal */}
      <Dialog open={!!chartTicker} onOpenChange={() => setChartTicker(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">{chartTicker} — Últimos 3 meses</DialogTitle>
          </DialogHeader>
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Cargando...</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => `$${v}`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [formatCurrency(v), "Precio"]}
                    labelFormatter={(l) => l}
                  />
                  <Line type="monotone" dataKey="close" stroke="#22D07A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioTab;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, TrendingDown, Search, DollarSign, BarChart3 } from "lucide-react";
import { SUPPORTED_TICKERS, fetchQuote } from "@/lib/stockData";

interface Portfolio {
  id: string;
  cash_balance: number;
}

interface Holding {
  id: string;
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

const PortfolioTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [tradeShares, setTradeShares] = useState("");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [trading, setTrading] = useState(false);
  const [showTxns, setShowTxns] = useState(false);

  const filteredTickers = searchTerm
    ? SUPPORTED_TICKERS.filter((t) => t.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Get or create portfolio
      let { data: p } = await supabase.from("portfolios").select("id, cash_balance").eq("user_id", user.id).single();
      if (!p) {
        const { data: created } = await supabase.from("portfolios").insert({ user_id: user.id }).select("id, cash_balance").single();
        p = created;
      }
      if (!p) { setLoading(false); return; }
      setPortfolio(p);

      const [holdingsRes, txnRes] = await Promise.all([
        supabase.from("portfolio_holdings").select("*").eq("portfolio_id", p.id),
        supabase.from("portfolio_transactions").select("*").eq("portfolio_id", p.id).order("executed_at", { ascending: false }).limit(20),
      ]);
      setHoldings(holdingsRes.data || []);
      setTransactions(txnRes.data || []);

      // Fetch prices for holdings
      if (holdingsRes.data && holdingsRes.data.length > 0) {
        const priceMap: Record<string, number> = {};
        await Promise.all(
          holdingsRes.data.map(async (h) => {
            const quote = await fetchQuote(h.ticker);
            if (quote) priceMap[h.ticker] = quote.price;
          })
        );
        setPrices(priceMap);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const selectTicker = async (ticker: string) => {
    setSelectedTicker(ticker);
    setSearchTerm("");
    const quote = await fetchQuote(ticker);
    if (quote) setPrices((p) => ({ ...p, [ticker]: quote.price }));
  };

  const executeTrade = async () => {
    if (!portfolio || !selectedTicker || !tradeShares) return;
    const shares = parseFloat(tradeShares);
    const price = prices[selectedTicker];
    if (!price || shares <= 0) return;

    const total = shares * price;
    const tickerInfo = SUPPORTED_TICKERS.find((t) => t.ticker === selectedTicker);

    if (tradeType === "BUY") {
      if (total > portfolio.cash_balance) {
        toast({ title: "Saldo insuficiente", variant: "destructive" });
        return;
      }
    } else {
      const holding = holdings.find((h) => h.ticker === selectedTicker);
      if (!holding || shares > holding.shares) {
        toast({ title: "No tenés suficientes acciones", variant: "destructive" });
        return;
      }
    }

    setTrading(true);

    // Insert transaction
    await supabase.from("portfolio_transactions").insert({
      portfolio_id: portfolio.id, ticker: selectedTicker,
      company_name: tickerInfo?.name || selectedTicker,
      transaction_type: tradeType, shares, price_per_share: price, total_amount: total,
    });

    // Update cash
    const newCash = tradeType === "BUY" ? portfolio.cash_balance - total : portfolio.cash_balance + total;
    await supabase.from("portfolios").update({ cash_balance: newCash }).eq("id", portfolio.id);

    // Update holdings
    const existing = holdings.find((h) => h.ticker === selectedTicker);
    if (tradeType === "BUY") {
      if (existing) {
        const newShares = existing.shares + shares;
        const newAvg = (existing.shares * existing.avg_cost_per_share + shares * price) / newShares;
        await supabase.from("portfolio_holdings").update({ shares: newShares, avg_cost_per_share: newAvg }).eq("id", existing.id);
      } else {
        await supabase.from("portfolio_holdings").insert({
          portfolio_id: portfolio.id, ticker: selectedTicker,
          company_name: tickerInfo?.name || selectedTicker,
          shares, avg_cost_per_share: price,
        });
      }
    } else {
      if (existing) {
        const newShares = existing.shares - shares;
        if (newShares <= 0) {
          await supabase.from("portfolio_holdings").delete().eq("id", existing.id);
        } else {
          await supabase.from("portfolio_holdings").update({ shares: newShares }).eq("id", existing.id);
        }
      }
    }

    // Refresh
    setPortfolio({ ...portfolio, cash_balance: newCash });
    const { data: h } = await supabase.from("portfolio_holdings").select("*").eq("portfolio_id", portfolio.id);
    setHoldings(h || []);
    const { data: t } = await supabase.from("portfolio_transactions").select("*").eq("portfolio_id", portfolio.id).order("executed_at", { ascending: false }).limit(20);
    setTransactions(t || []);
    setTradeShares("");
    setTrading(false);
    toast({ title: tradeType === "BUY" ? "Compra ejecutada" : "Venta ejecutada" });
  };

  const holdingsValue = holdings.reduce((sum, h) => sum + h.shares * (prices[h.ticker] || h.avg_cost_per_share), 0);
  const totalValue = (portfolio?.cash_balance || 0) + holdingsValue;
  const totalReturn = ((totalValue / 10000 - 1) * 100);

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-20 bg-secondary rounded-lg" /><div className="h-40 bg-secondary rounded-lg" /></div></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">Mi Portafolio</h2>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide mb-1">Saldo disponible</p>
          <p className="text-lg font-heading font-semibold text-foreground">${portfolio?.cash_balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide mb-1">Valor holdings</p>
          <p className="text-lg font-heading font-semibold text-foreground">${holdingsValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide mb-1">Valor total</p>
          <p className="text-lg font-heading font-semibold text-foreground">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-heading uppercase tracking-wide mb-1">Retorno total</p>
          <p className={`text-lg font-heading font-semibold ${totalReturn >= 0 ? "text-[#22D07A]" : "text-red-500"}`}>
            {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Trade */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Operar</h3>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 font-heading"
            placeholder="Buscar ticker (e.g. AAPL, MELI)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredTickers.length > 0 && searchTerm && (
            <div className="absolute top-11 left-0 right-0 bg-background border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredTickers.map((t) => (
                <button key={t.ticker} onClick={() => selectTicker(t.ticker)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors font-heading">
                  <span className="font-medium text-foreground">{t.ticker}</span>
                  <span className="text-muted-foreground ml-2">{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTicker && prices[selectedTicker] && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-heading font-semibold text-foreground">{selectedTicker}</span>
                <span className="text-muted-foreground text-sm ml-2">${prices[selectedTicker].toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTradeType("BUY")} className={`px-3 py-1 rounded text-sm font-heading font-medium ${tradeType === "BUY" ? "bg-[#22D07A] text-white" : "bg-secondary text-muted-foreground"}`}>Comprar</button>
                <button onClick={() => setTradeType("SELL")} className={`px-3 py-1 rounded text-sm font-heading font-medium ${tradeType === "SELL" ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground"}`}>Vender</button>
              </div>
            </div>
            <input
              type="number" step="0.01" min="0"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading"
              placeholder="Cantidad de acciones"
              value={tradeShares}
              onChange={(e) => setTradeShares(e.target.value)}
            />
            {tradeShares && (
              <p className="text-sm text-muted-foreground">
                {tradeType === "BUY" ? "Total a invertir" : "Recibirás"}: ${(parseFloat(tradeShares) * prices[selectedTicker]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            <Button onClick={executeTrade} variant="cta" className="w-full" disabled={trading || !tradeShares}>
              {trading ? "Ejecutando..." : tradeType === "BUY" ? "Comprar" : "Vender"}
            </Button>
          </div>
        )}
      </div>

      {/* Holdings */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Holdings</h3>
        </div>
        {holdings.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Tu portafolio está vacío. ¡Comprá tu primera acción!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-xs text-muted-foreground font-heading uppercase">
                <th className="text-left px-4 py-2">Ticker</th>
                <th className="text-left px-4 py-2">Empresa</th>
                <th className="text-right px-4 py-2">Acciones</th>
                <th className="text-right px-4 py-2">Costo prom.</th>
                <th className="text-right px-4 py-2">Precio actual</th>
                <th className="text-right px-4 py-2">P&L</th>
              </tr></thead>
              <tbody>
                {holdings.map((h) => {
                  const currentPrice = prices[h.ticker] || h.avg_cost_per_share;
                  const pnl = (currentPrice - h.avg_cost_per_share) * h.shares;
                  return (
                    <tr key={h.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-heading font-medium text-foreground">{h.ticker}</td>
                      <td className="px-4 py-3 text-muted-foreground">{h.company_name}</td>
                      <td className="px-4 py-3 text-right">{h.shares}</td>
                      <td className="px-4 py-3 text-right">${h.avg_cost_per_share.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">${currentPrice.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${pnl >= 0 ? "text-[#22D07A]" : "text-red-500"}`}>
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
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
        <div className="border border-border rounded-lg overflow-hidden">
          <button onClick={() => setShowTxns(!showTxns)} className="w-full px-6 py-4 flex items-center justify-between text-left">
            <h3 className="font-heading font-semibold text-foreground">Historial de transacciones</h3>
            <span className="text-muted-foreground text-sm">{showTxns ? "Ocultar" : "Mostrar"}</span>
          </button>
          {showTxns && (
            <div className="overflow-x-auto border-t border-border">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-xs text-muted-foreground font-heading uppercase">
                  <th className="text-left px-4 py-2">Fecha</th>
                  <th className="text-left px-4 py-2">Tipo</th>
                  <th className="text-left px-4 py-2">Ticker</th>
                  <th className="text-right px-4 py-2">Acciones</th>
                  <th className="text-right px-4 py-2">Precio</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr></thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">{new Date(t.executed_at).toLocaleDateString("es-UY")}</td>
                      <td className={`px-4 py-3 font-medium ${t.transaction_type === "BUY" ? "text-[#22D07A]" : "text-red-500"}`}>
                        {t.transaction_type === "BUY" ? "Compra" : "Venta"}
                      </td>
                      <td className="px-4 py-3 font-heading font-medium text-foreground">{t.ticker}</td>
                      <td className="px-4 py-3 text-right">{t.shares}</td>
                      <td className="px-4 py-3 text-right">${t.price_per_share.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">${t.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;

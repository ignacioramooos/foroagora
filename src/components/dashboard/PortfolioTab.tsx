import { useState, useMemo } from "react";
import { usePortfolio, Transaction } from "@/hooks/usePortfolio";
import { SUPPORTED_STOCKS, fetchStockPrices, fetchStockHistory, StockQuote, HistoryPoint } from "@/lib/stockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, Search, BarChart2, LineChart as LineChartIcon, ArrowDownLeft, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
const pnlFmt = (v: number) => `${v >= 0 ? "+" : ""}${fmt(v)}`;

const buildPortfolioHistory = (
  transactions: Transaction[],
  finalValue: number,
): { date: string; value: number }[] => {
  if (!transactions.length) {
    return [
      { date: "Inicio", value: 10000 },
      { date: "Hoy", value: Math.round(finalValue) },
    ];
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.executed_at).getTime() - new Date(b.executed_at).getTime(),
  );

  let cash = 10000;
  const holdings = new Map<string, number>();
  const lastPrice = new Map<string, number>();
  const points: { date: string; value: number }[] = [{ date: "Inicio", value: 10000 }];

  sorted.forEach((t) => {
    const shares = Number(t.shares);
    const price = Number(t.price_per_share);
    const amount = Number(t.total_amount);

    lastPrice.set(t.ticker, price);

    if (t.transaction_type === "BUY") {
      cash -= amount;
      holdings.set(t.ticker, (holdings.get(t.ticker) ?? 0) + shares);
    } else {
      cash += amount;
      holdings.set(t.ticker, Math.max((holdings.get(t.ticker) ?? 0) - shares, 0));
    }

    let holdingsValue = 0;
    holdings.forEach((qty, ticker) => {
      holdingsValue += qty * (lastPrice.get(ticker) ?? 0);
    });

    const dateLabel = new Date(t.executed_at).toLocaleDateString("es-UY", {
      day: "numeric",
      month: "short",
    });

    points.push({ date: dateLabel, value: Math.round(cash + holdingsValue) });
  });

  points.push({ date: "Hoy", value: Math.round(finalValue) });
  return points;
};

// ─── Metric Card ───
const MetricCard = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) => (
  <Card className="bg-secondary border-0">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl md:text-2xl font-heading font-semibold ${color || "text-foreground"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${color || "text-muted-foreground"}`}>{sub}</p>}
    </CardContent>
  </Card>
);

// ─── Stock Chart Dialog ───
const StockChartDialog = ({ ticker, companyName, open, onClose }: { ticker: string; companyName: string; open: boolean; onClose: () => void }) => {
  const [range, setRange] = useState("3mo");
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (r: string) => {
    setLoading(true);
    setRange(r);
    const d = await fetchStockHistory(ticker, r);
    setData(d);
    setLoading(false);
  };

  useState(() => { if (open) load("3mo"); });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">{companyName} <span className="font-mono text-muted-foreground">({ticker})</span></DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          {[["1d","1D"],["5d","1S"],["1mo","1M"],["3mo","3M"],["6mo","6M"],["1y","1A"]].map(([v,l]) => (
            <Button key={v} size="sm" variant={range === v ? "cta" : "outline"} onClick={() => load(v)}>{l}</Button>
          ))}
        </div>
        <div className="h-[220px] border border-border rounded-lg p-3">
          {loading ? <Skeleton className="h-full w-full" /> : data.length < 2 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sin datos suficientes</div>
          ) : (
            <ChartContainer config={{ price: { label: "Precio", color: "hsl(var(--accent))" } }} className="h-full w-full">
              <LineChart data={data}>
                <XAxis dataKey="date" tickFormatter={d => { const p = d.split("-"); return `${p[2]}/${p[1]}`; }} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="close" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Datos proporcionados por Yahoo Finance. Solo con fines educativos.</p>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ───
const PortfolioTab = () => {
  const {
    portfolio, holdingsWithPrices, transactions,
    totalPortfolioValue, totalReturn, totalPnL, totalHoldingsValue, cashBalance,
    isLoading, isRefreshing, refresh, buyStock, sellStock,
  } = usePortfolio();

  const [tradeMode, setTradeMode] = useState<"BUY" | "SELL">("BUY");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [sharesInput, setSharesInput] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sellTicker, setSellTicker] = useState("");
  const [sellShares, setSellShares] = useState("");
  const [chartDialog, setChartDialog] = useState<{ ticker: string; name: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [mobileTradeOpen, setMobileTradeOpen] = useState(false);

  const portfolioHistory = useMemo(
    () => buildPortfolioHistory(transactions, totalPortfolioValue),
    [transactions, totalPortfolioValue],
  );

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SUPPORTED_STOCKS.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery]);

  const selectStock = async (ticker: string, name: string) => {
    setSearchQuery(name);
    setLoadingPrice(true);
    const quotes = await fetchStockPrices([ticker]);
    setSelectedStock(quotes[0] || null);
    setLoadingPrice(false);
  };

  const handleBuy = async () => {
    if (!selectedStock?.price || !sharesInput) return;
    const shares = parseFloat(sharesInput);
    if (isNaN(shares) || shares <= 0) return;
    setSubmitting(true);
    const result = await buyStock(selectedStock.ticker, selectedStock.companyName, shares, selectedStock.price);
    setSubmitting(false);
    if (result.success) {
      toast.success(`¡Compraste ${shares} acciones de ${selectedStock.ticker}!`);
      setSelectedStock(null); setSearchQuery(""); setSharesInput(""); setMobileTradeOpen(false);
    } else {
      toast.error(result.error || "Error al procesar la compra.");
    }
  };

  const handleSell = async () => {
    const holding = holdingsWithPrices.find(h => h.ticker === sellTicker);
    if (!holding || !sellShares) return;
    const shares = parseFloat(sellShares);
    if (isNaN(shares) || shares <= 0 || shares > holding.shares) return;
    const price = holding.currentPrice || holding.avg_cost_per_share;
    setSubmitting(true);
    const result = await sellStock(holding.ticker, shares, price);
    setSubmitting(false);
    if (result.success) {
      toast.success(`¡Vendiste ${shares} acciones de ${holding.ticker}!`);
      setSellTicker(""); setSellShares(""); setMobileTradeOpen(false);
    } else {
      toast.error(result.error || "Error al procesar la venta.");
    }
  };

  const buyTotal = selectedStock?.price ? parseFloat(sharesInput || "0") * selectedStock.price : 0;
  const sellHolding = holdingsWithPrices.find(h => h.ticker === sellTicker);
  const sellTotal = sellHolding ? parseFloat(sellShares || "0") * (sellHolding.currentPrice || sellHolding.avg_cost_per_share) : 0;

  const returnColor = totalReturn >= 0 ? "text-accent" : "text-destructive";

  // ─── LOADING ───
  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-[220px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    );
  }

  // ─── Trade Panel Content ───
  const TradePanel = () => (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-heading font-medium uppercase tracking-widest text-muted-foreground">Operar</h3>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" variant={tradeMode === "BUY" ? "cta" : "outline"} onClick={() => { setTradeMode("BUY"); setSellTicker(""); }}>Comprar</Button>
          <Button size="sm" className="flex-1" variant={tradeMode === "SELL" ? "cta" : "outline"} onClick={() => { setTradeMode("SELL"); setSelectedStock(null); setSearchQuery(""); }}>Vender</Button>
        </div>
        <Separator />
        {tradeMode === "BUY" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Buscar empresa o ticker..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSelectedStock(null); }} className="pl-9" />
              {filteredStocks.length > 0 && !selectedStock && (
                <div className="absolute z-20 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredStocks.map(s => (
                    <button key={s.ticker} className="w-full text-left px-3 py-2 hover:bg-secondary flex items-center gap-2 text-sm" onClick={() => selectStock(s.ticker, s.name)}>
                      <span className="font-mono font-semibold">{s.ticker}</span>
                      <span className="text-muted-foreground truncate">{s.name}</span>
                      <Badge variant="secondary" className="ml-auto text-[10px]">{s.sector}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {loadingPrice && <Skeleton className="h-16" />}
            {selectedStock && (
              <div className="bg-secondary rounded-md p-3 space-y-1">
                <p className="font-heading font-medium text-sm">{selectedStock.companyName} <span className="font-mono text-muted-foreground">({selectedStock.ticker})</span></p>
                <p className="text-xl font-heading font-semibold">{selectedStock.price != null ? fmt(selectedStock.price) : "—"}</p>
                {selectedStock.changePercent != null && (
                  <p className={`text-xs ${selectedStock.changePercent >= 0 ? "text-accent" : "text-destructive"}`}>
                    {pct(selectedStock.changePercent)} hoy
                  </p>
                )}
              </div>
            )}
            {selectedStock?.price != null && (
              <>
                <div>
                  <label className="text-xs text-muted-foreground font-heading">Cantidad de acciones</label>
                  <Input type="number" min={0.01} step={0.01} placeholder="0.00" value={sharesInput} onChange={e => setSharesInput(e.target.value)} className="tabular-nums" />
                </div>
                <p className="text-sm text-muted-foreground">Total a invertir: <span className="font-semibold text-foreground">{fmt(buyTotal)}</span></p>
                {buyTotal > cashBalance && <p className="text-xs text-destructive">Saldo insuficiente. Tenés {fmt(cashBalance)} disponibles.</p>}
                <Button className="w-full" variant="cta" disabled={!sharesInput || buyTotal <= 0 || buyTotal > cashBalance || submitting} onClick={handleBuy}>
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : `Comprar ${selectedStock.ticker}`}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {holdingsWithPrices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tenés posiciones para vender.</p>
            ) : (
              <>
                <select className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm" value={sellTicker} onChange={e => { setSellTicker(e.target.value); setSellShares(""); }}>
                  <option value="">Seleccioná una posición</option>
                  {holdingsWithPrices.map(h => (
                    <option key={h.ticker} value={h.ticker}>{h.ticker} — {h.shares.toFixed(2)} acc. @ {fmt(h.currentPrice || h.avg_cost_per_share)}</option>
                  ))}
                </select>
                {sellHolding && (
                  <>
                    <div className="bg-secondary rounded-md p-3 text-sm space-y-1">
                      <p className="font-heading font-medium">{sellHolding.company_name}</p>
                      <p>Valor actual: <span className="font-semibold">{fmt(sellHolding.currentValue)}</span></p>
                      <p className={sellHolding.pnl >= 0 ? "text-accent" : "text-destructive"}>P&L: {pnlFmt(sellHolding.pnl)} ({pct(sellHolding.pnlPercent)})</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-heading">¿Cuántas acciones querés vender?</label>
                      <Input type="number" min={0.01} step={0.01} max={sellHolding.shares} placeholder="0.00" value={sellShares} onChange={e => setSellShares(e.target.value)} className="tabular-nums" />
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSellShares(sellHolding.shares.toString())} className="w-full">Vender todo</Button>
                    <p className="text-sm text-muted-foreground">Recibirás: <span className="font-semibold text-foreground">{fmt(sellTotal)}</span></p>
                    <Button className="w-full" variant="cta" disabled={!sellShares || parseFloat(sellShares) <= 0 || parseFloat(sellShares) > sellHolding.shares || submitting} onClick={handleSell}>
                      {submitting ? <Loader2 className="animate-spin" size={16} /> : `Vender ${sellHolding.ticker}`}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
        <Separator />
        <p className="text-xs text-muted-foreground">Saldo disponible: {fmt(cashBalance)}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl space-y-6">
      {/* ─── Metrics ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Valor total" value={fmt(totalPortfolioValue)} sub={pct(totalReturn)} color={returnColor} />
        <MetricCard label="Efectivo" value={fmt(cashBalance)} sub={`${((cashBalance / totalPortfolioValue) * 100).toFixed(0)}% del portafolio`} />
        <MetricCard label="Posiciones" value={String(holdingsWithPrices.length)} sub="acciones en cartera" />
        <MetricCard label="P&L Total" value={pnlFmt(totalPnL)} sub="vs. $10,000.00 iniciales" color={totalPnL >= 0 ? "text-accent" : "text-destructive"} />
      </div>

      {/* ─── Chart placeholder (simplified: flat line for new users) ─── */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="h-[220px] md:h-[220px] flex items-center justify-center">
            {holdingsWithPrices.length === 0 ? (
              <div className="text-center text-muted-foreground space-y-2">
                <BarChart2 size={40} className="mx-auto" />
                <p className="text-sm">Realizá tu primera operación para ver tu curva de rendimiento</p>
              </div>
            ) : (
              <ChartContainer config={{ value: { label: "Valor", color: "hsl(var(--accent))" } }} className="h-full w-full">
                <AreaChart data={portfolioHistory}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#portfolioGrad)" />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Holdings + Trade ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Holdings (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-heading font-medium uppercase tracking-widest text-muted-foreground">Mis posiciones</h3>
            <Button size="sm" variant="outline" onClick={refresh} disabled={isRefreshing}>
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Actualizar
            </Button>
          </div>

          {holdingsWithPrices.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground space-y-2">
              <BarChart2 size={40} className="mx-auto" />
              <p className="font-heading font-medium">Tu portafolio está vacío</p>
              <p className="text-sm">Comprá tu primera acción en el panel de la derecha.</p>
            </CardContent></Card>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Acciones</TableHead>
                        <TableHead>Costo Prom.</TableHead>
                        <TableHead>Precio Act.</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdingsWithPrices.map(h => (
                        <TableRow key={h.id}>
                          <TableCell className="font-mono font-semibold">{h.ticker}</TableCell>
                          <TableCell className="tabular-nums">{h.shares.toFixed(2)}</TableCell>
                          <TableCell className="tabular-nums text-muted-foreground">{fmt(h.avg_cost_per_share)}</TableCell>
                          <TableCell className="tabular-nums">
                            {h.priceError ? <span className="text-xs text-muted-foreground">⚠ N/D</span> : h.currentPrice != null ? fmt(h.currentPrice) : <Skeleton className="h-4 w-16" />}
                          </TableCell>
                          <TableCell className="tabular-nums font-medium">{fmt(h.currentValue)}</TableCell>
                          <TableCell className={`tabular-nums ${h.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                            {pnlFmt(h.pnl)} <span className="text-xs">({pct(h.pnlPercent)})</span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" onClick={() => setChartDialog({ ticker: h.ticker, name: h.company_name })}>
                              <LineChartIcon size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => { setTradeMode("SELL"); setSellTicker(h.ticker); }}>
                              <ArrowDownLeft size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {holdingsWithPrices.map(h => (
                  <Card key={h.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-mono font-semibold text-sm">{h.ticker}</p>
                        <p className="text-xs text-muted-foreground">{h.shares.toFixed(2)} acc.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-medium text-sm tabular-nums">{fmt(h.currentValue)}</p>
                        <p className={`text-xs tabular-nums ${h.pnl >= 0 ? "text-accent" : "text-destructive"}`}>{pnlFmt(h.pnl)}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => setChartDialog({ ticker: h.ticker, name: h.company_name })}>
                        <LineChartIcon size={14} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Transaction History */}
          <div>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-heading" onClick={() => setShowHistory(!showHistory)}>
              Historial de operaciones {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showHistory && (
              <Card className="mt-2">
                {transactions.length === 0 ? (
                  <CardContent className="p-4 text-sm text-muted-foreground text-center">Aún no realizaste operaciones.</CardContent>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Acciones</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(historyPage * 10, (historyPage + 1) * 10).map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="text-xs tabular-nums">{new Date(t.executed_at).toLocaleDateString("es-UY")}</TableCell>
                          <TableCell>
                            <Badge variant={t.transaction_type === "BUY" ? "default" : "secondary"} className="text-[10px]">
                              {t.transaction_type === "BUY" ? "Compra" : "Venta"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{t.ticker}</TableCell>
                          <TableCell className="tabular-nums text-xs">{Number(t.shares).toFixed(2)}</TableCell>
                          <TableCell className="tabular-nums text-xs">{fmt(Number(t.price_per_share))}</TableCell>
                          <TableCell className="tabular-nums text-xs font-medium">{fmt(Number(t.total_amount))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {transactions.length > 10 && (
                  <div className="flex justify-center gap-2 p-2">
                    <Button size="sm" variant="outline" disabled={historyPage === 0} onClick={() => setHistoryPage(p => p - 1)}>Anterior</Button>
                    <Button size="sm" variant="outline" disabled={(historyPage + 1) * 10 >= transactions.length} onClick={() => setHistoryPage(p => p + 1)}>Siguiente</Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Trade Panel (desktop) */}
        <div className="hidden lg:block">
          <TradePanel />
        </div>
      </div>

      {/* Mobile trade button */}
      <button
        className="lg:hidden fixed bottom-20 right-4 z-30 bg-foreground text-background rounded-full px-5 py-3 font-heading font-semibold text-sm shadow-lg"
        onClick={() => setMobileTradeOpen(true)}
      >
        Operar
      </button>

      {/* Mobile trade overlay */}
      {mobileTradeOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileTradeOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-background border-t border-border rounded-t-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading font-semibold">Operar</h3>
              <Button size="icon" variant="ghost" onClick={() => setMobileTradeOpen(false)}><X size={18} /></Button>
            </div>
            <TradePanel />
          </div>
        </div>
      )}

      {/* Stock Chart Dialog */}
      {chartDialog && (
        <StockChartDialog ticker={chartDialog.ticker} companyName={chartDialog.name} open={!!chartDialog} onClose={() => setChartDialog(null)} />
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center pt-4">
        Este portafolio es simulado con fines educativos. No constituye asesoramiento financiero ni involucra dinero real. InvertíUY no es un broker ni servicio de inversión.
      </p>
    </div>
  );
};

export default PortfolioTab;

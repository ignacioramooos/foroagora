import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStockPrices, StockQuote } from "@/lib/stockData";

export interface HoldingWithPrice {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost_per_share: number;
  currentPrice: number | null;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  changePercent: number | null;
  priceError?: boolean;
}

export interface Transaction {
  id: string;
  ticker: string;
  company_name: string;
  transaction_type: string;
  shares: number;
  price_per_share: number;
  total_amount: number;
  executed_at: string;
}

export function usePortfolio() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [portfolio, setPortfolio] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [holdingsWithPrices, setHoldingsWithPrices] = useState<HoldingWithPrice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    if (!userId) return null;
    let { data } = await supabase.from("portfolios").select("*").eq("user_id", userId).maybeSingle();
    if (!data) {
      const { data: newP } = await supabase.from("portfolios").insert({ user_id: userId, cash_balance: 10000 }).select().single();
      data = newP;
    }
    setPortfolio(data);
    return data;
  }, [userId]);

  const fetchHoldings = useCallback(async (portfolioId: string) => {
    const { data } = await supabase.from("portfolio_holdings").select("*").eq("portfolio_id", portfolioId);
    setHoldings(data || []);
    return data || [];
  }, []);

  const fetchTransactions = useCallback(async (portfolioId: string) => {
    const { data } = await supabase.from("portfolio_transactions").select("*").eq("portfolio_id", portfolioId).order("executed_at", { ascending: false }).limit(20);
    setTransactions((data || []) as Transaction[]);
  }, []);

  const enrichHoldings = useCallback(async (rawHoldings: any[]) => {
    if (!rawHoldings.length) { setHoldingsWithPrices([]); return; }
    const tickers = rawHoldings.map(h => h.ticker);
    const quotes = await fetchStockPrices(tickers);
    const quoteMap = new Map<string, StockQuote>();
    quotes.forEach(q => quoteMap.set(q.ticker, q));

    const enriched: HoldingWithPrice[] = rawHoldings.map(h => {
      const q = quoteMap.get(h.ticker);
      const shares = Number(h.shares);
      const avgCost = Number(h.avg_cost_per_share);
      const currentPrice = q?.price ?? null;
      const currentValue = currentPrice != null ? currentPrice * shares : avgCost * shares;
      const costBasis = avgCost * shares;
      const pnl = currentValue - costBasis;
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
      return {
        id: h.id, ticker: h.ticker, company_name: h.company_name,
        shares, avg_cost_per_share: avgCost,
        currentPrice, currentValue, pnl, pnlPercent,
        changePercent: q?.changePercent ?? null,
        priceError: q?.error,
      };
    });
    setHoldingsWithPrices(enriched);
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    const p = await fetchPortfolio();
    if (p) {
      const h = await fetchHoldings(p.id);
      await Promise.all([enrichHoldings(h), fetchTransactions(p.id)]);
      // Update last_portfolio_value
      const totalHoldings = holdingsWithPrices.reduce((s, x) => s + x.currentValue, 0);
      const totalVal = Number(p.cash_balance) + totalHoldings;
      supabase.from("portfolios").update({ last_portfolio_value: totalVal }).eq("id", p.id).then(() => {});
    }
    setIsLoading(false);
  }, [fetchPortfolio, fetchHoldings, enrichHoldings, fetchTransactions]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    if (portfolio) {
      const h = await fetchHoldings(portfolio.id);
      await enrichHoldings(h);
      // Update last_portfolio_value
      const totalHoldings = holdingsWithPrices.reduce((s, x) => s + x.currentValue, 0);
      const totalVal = Number(portfolio.cash_balance) + totalHoldings;
      supabase.from("portfolios").update({ last_portfolio_value: totalVal }).eq("id", portfolio.id).then(() => {});
    }
    setIsRefreshing(false);
  }, [portfolio, fetchHoldings, enrichHoldings]);

  useEffect(() => { loadAll(); }, [userId]);

  const cashBalance = Number(portfolio?.cash_balance || 0);
  const totalHoldingsValue = holdingsWithPrices.reduce((s, h) => s + h.currentValue, 0);
  const totalPortfolioValue = cashBalance + totalHoldingsValue;
  const totalReturn = ((totalPortfolioValue / 10000) - 1) * 100;
  const totalPnL = totalPortfolioValue - 10000;

  // Update last_portfolio_value when prices change
  useEffect(() => {
    if (portfolio && holdingsWithPrices.length > 0) {
      supabase.from("portfolios").update({ last_portfolio_value: totalPortfolioValue }).eq("id", portfolio.id).then(() => {});
    }
  }, [totalPortfolioValue, portfolio?.id]);

  const buyStock = async (ticker: string, companyName: string, shares: number, price: number) => {
    if (!portfolio) return { success: false, error: "No portfolio" };
    const total = shares * price;
    if (total > cashBalance) return { success: false, error: "Saldo insuficiente" };

    const newCash = cashBalance - total;
    const { error: cashErr } = await supabase.from("portfolios").update({ cash_balance: newCash }).eq("id", portfolio.id);
    if (cashErr) return { success: false, error: cashErr.message };

    const existing = holdings.find(h => h.ticker === ticker);
    if (existing) {
      const oldShares = Number(existing.shares);
      const oldAvg = Number(existing.avg_cost_per_share);
      const newShares = oldShares + shares;
      const newAvg = (oldShares * oldAvg + shares * price) / newShares;
      await supabase.from("portfolio_holdings").update({ shares: newShares, avg_cost_per_share: newAvg }).eq("id", existing.id);
    } else {
      await supabase.from("portfolio_holdings").insert({
        portfolio_id: portfolio.id, ticker, company_name: companyName,
        shares, avg_cost_per_share: price,
      });
    }

    await supabase.from("portfolio_transactions").insert({
      portfolio_id: portfolio.id, ticker, company_name: companyName,
      transaction_type: "BUY", shares, price_per_share: price, total_amount: total,
    });

    await loadAll();
    return { success: true };
  };

  const sellStock = async (ticker: string, shares: number, price: number) => {
    if (!portfolio) return { success: false, error: "No portfolio" };
    const holding = holdings.find(h => h.ticker === ticker);
    if (!holding || Number(holding.shares) < shares) return { success: false, error: "Acciones insuficientes" };

    const total = shares * price;
    const newCash = cashBalance + total;
    await supabase.from("portfolios").update({ cash_balance: newCash }).eq("id", portfolio.id);

    const remaining = Number(holding.shares) - shares;
    if (remaining <= 0.0001) {
      await supabase.from("portfolio_holdings").delete().eq("id", holding.id);
    } else {
      await supabase.from("portfolio_holdings").update({ shares: remaining }).eq("id", holding.id);
    }

    await supabase.from("portfolio_transactions").insert({
      portfolio_id: portfolio.id, ticker, company_name: holding.company_name,
      transaction_type: "SELL", shares, price_per_share: price, total_amount: total,
    });

    await loadAll();
    return { success: true };
  };

  return {
    portfolio, holdingsWithPrices, transactions,
    totalPortfolioValue, totalReturn, totalPnL, totalHoldingsValue, cashBalance,
    isLoading, isRefreshing, refresh, buyStock, sellStock,
  };
}

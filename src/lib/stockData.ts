import { supabase } from "@/integrations/supabase/client";

export const SUPPORTED_STOCKS = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Tecnología" },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Tecnología" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Tecnología" },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumo" },
  { ticker: "META", name: "Meta Platforms", sector: "Tecnología" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotriz" },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductores" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Finanzas" },
  { ticker: "V", name: "Visa Inc.", sector: "Finanzas" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Salud" },
  { ticker: "MELI", name: "MercadoLibre Inc.", sector: "E-commerce LatAm" },
  { ticker: "GLOB", name: "Globant S.A.", sector: "Tecnología LatAm" },
  { ticker: "NU", name: "Nu Holdings", sector: "Fintech LatAm" },
  { ticker: "DESP", name: "Despegar.com", sector: "Turismo LatAm" },
  { ticker: "SPY", name: "S&P 500 ETF", sector: "ETF" },
  { ticker: "QQQ", name: "Nasdaq 100 ETF", sector: "ETF" },
  { ticker: "BRK-B", name: "Berkshire Hathaway", sector: "Holding" },
];

export interface StockQuote {
  ticker: string;
  price: number | null;
  previousClose: number | null;
  changePercent: number | null;
  companyName: string;
  error?: boolean;
}

export interface HistoryPoint {
  date: string;
  close: number;
}

export async function fetchStockPrices(tickers: string[]): Promise<StockQuote[]> {
  if (!tickers.length) return [];
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/stock-price?tickers=${tickers.join(",")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return tickers.map(ticker => ({
      ticker, price: null, previousClose: null, changePercent: null, companyName: ticker, error: true,
    }));
  }
}

export async function fetchStockHistory(ticker: string, range = "3mo"): Promise<HistoryPoint[]> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/stock-history?ticker=${ticker}&range=${range}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

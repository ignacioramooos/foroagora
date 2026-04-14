import { supabase } from "@/integrations/supabase/client";

export const SUPPORTED_STOCKS = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "META", name: "Meta Platforms Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "NVDA", name: "NVIDIA Corp." },
  { ticker: "BRK-B", name: "Berkshire Hathaway" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "MELI", name: "MercadoLibre Inc." },
  { ticker: "GLOB", name: "Globant S.A." },
  { ticker: "DESP", name: "Despegar.com" },
  { ticker: "NU", name: "Nu Holdings" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF" },
  { ticker: "QQQ", name: "Invesco QQQ Trust" },
  { ticker: "VTI", name: "Vanguard Total Stock" },
];

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
  currency: string;
}

export interface StockHistoryPoint {
  date: string;
  close: number;
}

export async function fetchStockPrice(ticker: string): Promise<StockQuote | null> {
  try {
    const { data, error } = await supabase.functions.invoke("stock-price", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: undefined,
    });
    // supabase.functions.invoke doesn't support query params well, use fetch directly
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const resp = await fetch(
      `https://${projectId}.supabase.co/functions/v1/stock-price?ticker=${ticker}`,
      {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

export async function fetchStockHistory(ticker: string, range = "3mo"): Promise<StockHistoryPoint[]> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const resp = await fetch(
      `https://${projectId}.supabase.co/functions/v1/stock-history?ticker=${ticker}&range=${range}`,
      {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );
    if (!resp.ok) return [];
    return await resp.json();
  } catch {
    return [];
  }
}

export async function fetchMultipleStockPrices(tickers: string[]): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();
  const promises = tickers.map(async (ticker) => {
    const quote = await fetchStockPrice(ticker);
    if (quote) results.set(ticker, quote);
  });
  await Promise.all(promises);
  return results;
}

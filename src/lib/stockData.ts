import { supabase } from "@/integrations/supabase/client";

export const SUPPORTED_TICKERS = [
  { ticker: "AAPL", name: "Apple" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "META", name: "Meta Platforms" },
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "BRK-B", name: "Berkshire Hathaway" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "MELI", name: "MercadoLibre" },
  { ticker: "GLOB", name: "Globant" },
  { ticker: "DESP", name: "Despegar" },
  { ticker: "NU", name: "Nu Holdings" },
  { ticker: "SPY", name: "S&P 500 ETF" },
  { ticker: "QQQ", name: "Nasdaq 100 ETF" },
  { ticker: "VTI", name: "Total Stock Market ETF" },
];

interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
  currency: string;
}

const quoteCache = new Map<string, { data: Quote; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchQuote(ticker: string): Promise<Quote | null> {
  const cached = quoteCache.get(ticker);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  try {
    const { data, error } = await supabase.functions.invoke("stock-price", {
      body: { ticker },
    });
    if (error || !data) return null;
    const quote = data as Quote;
    quoteCache.set(ticker, { data: quote, timestamp: Date.now() });
    return quote;
  } catch {
    return null;
  }
}

export async function fetchHistory(ticker: string, range = "3mo") {
  try {
    const { data, error } = await supabase.functions.invoke("stock-history", {
      body: { ticker, range },
    });
    if (error || !data) return [];
    return data as { date: string; close: number }[];
  } catch {
    return [];
  }
}

import { corsHeaders } from "@supabase/supabase-js/cors";

const cache = new Map<string, { data: any; ts: number }>();
const TTL = 3 * 60 * 1000; // 3 minutes

async function fetchQuote(ticker: string) {
  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d&includePrePost=false`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta) throw new Error("No meta");

    const result = {
      ticker,
      price: meta.regularMarketPrice ?? null,
      previousClose: meta.previousClose ?? meta.chartPreviousClose ?? null,
      changePercent: meta.regularMarketPrice && meta.previousClose
        ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
        : null,
      companyName: meta.shortName || meta.longName || ticker,
    };
    cache.set(ticker, { data: result, ts: Date.now() });
    return result;
  } catch {
    return { ticker, price: null, previousClose: null, changePercent: null, companyName: ticker, error: true };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tickersParam = url.searchParams.get("tickers") || "";
    const tickers = tickersParam.split(",").map(t => t.trim()).filter(Boolean);

    if (!tickers.length) {
      return new Response(JSON.stringify({ error: "Missing tickers param" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = await Promise.all(tickers.map(fetchQuote));
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

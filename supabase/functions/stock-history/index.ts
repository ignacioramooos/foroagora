const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_RANGES = ["1d", "5d", "1mo", "3mo", "6mo", "1y"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const ticker = url.searchParams.get("ticker") || "";
    let range = url.searchParams.get("range") || "3mo";
    if (!VALID_RANGES.includes(range)) range = "3mo";

    if (!ticker) {
      return new Response(JSON.stringify({ error: "Missing ticker param" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const interval = range === "1d" ? "5m" : range === "5d" ? "15m" : "1d";
    const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}`;
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) throw new Error("No data");

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const data = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      close: closes[i] != null ? Math.round(closes[i] * 100) / 100 : null,
    })).filter((d: any) => d.close !== null);

    return new Response(JSON.stringify({ ticker, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

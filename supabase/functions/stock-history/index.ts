import { corsHeaders } from '@supabase/supabase-js/cors'

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase();
  const range = url.searchParams.get('range') || '3mo';

  if (!ticker || !/^[A-Z0-9\-]{1,10}$/.test(ticker)) {
    return new Response(JSON.stringify({ error: 'Invalid ticker' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const validRanges = ['1mo', '3mo', '6mo', '1y', '5y'];
  const safeRange = validRanges.includes(range) ? range : '3mo';
  const cacheKey = `${ticker}-${safeRange}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const resp = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=${safeRange}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'Ticker not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const json = await resp.json();
    const result = json.chart?.result?.[0];

    if (!result?.timestamp) {
      return new Response(JSON.stringify({ error: 'No data' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const timestamps = result.timestamp;
    const closes = result.indicators?.quote?.[0]?.close || [];

    const data = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      close: closes[i] != null ? Math.round(closes[i] * 100) / 100 : null,
    })).filter((d: { close: number | null }) => d.close != null);

    cache.set(cacheKey, { data, ts: Date.now() });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch history' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

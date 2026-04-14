
-- Portfolios table
CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  cash_balance DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
  last_portfolio_value DECIMAL(12,2) DEFAULT 10000.00,
  cohort_id UUID REFERENCES public.cohorts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolio"
ON public.portfolios FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio"
ON public.portfolios FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio"
ON public.portfolios FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Public read for leaderboard
CREATE POLICY "Anyone can view portfolios for leaderboard"
ON public.portfolios FOR SELECT TO public
USING (true);

-- Portfolio transactions table
CREATE TABLE public.portfolio_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
  shares DECIMAL(10,4) NOT NULL,
  price_per_share DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.portfolio_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
ON public.portfolio_transactions FOR SELECT TO authenticated
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own transactions"
ON public.portfolio_transactions FOR INSERT TO authenticated
WITH CHECK (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

-- Portfolio holdings table
CREATE TABLE public.portfolio_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares DECIMAL(10,4) NOT NULL DEFAULT 0,
  avg_cost_per_share DECIMAL(10,2) NOT NULL,
  UNIQUE(portfolio_id, ticker)
);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own holdings"
ON public.portfolio_holdings FOR SELECT TO authenticated
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own holdings"
ON public.portfolio_holdings FOR INSERT TO authenticated
WITH CHECK (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own holdings"
ON public.portfolio_holdings FOR UPDATE TO authenticated
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own holdings"
ON public.portfolio_holdings FOR DELETE TO authenticated
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

-- Auto-create portfolio on user signup
CREATE OR REPLACE FUNCTION public.handle_new_portfolio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.portfolios (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_portfolio
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_portfolio();

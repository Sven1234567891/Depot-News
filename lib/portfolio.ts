"use client";

import { supabase } from "./supabase";
import { Holding } from "./types";
import { getHoldings as getMockHoldings } from "./data";

const STORAGE_KEY = "activePortfolioId";

export function getActivePortfolioId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function setActivePortfolioId(id: string) {
  window.localStorage.setItem(STORAGE_KEY, id);
}

interface HoldingRow {
  id: string;
  name: string;
  ticker: string | null;
  isin: string | null;
  shares: number | null;
  value: number | null;
}

function withWeights(rows: HoldingRow[]): Holding[] {
  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    ticker: r.ticker || "—",
    isin: r.isin || "—",
    shares: r.shares ?? "—",
    value: r.value ?? 0,
    weight: total > 0 && r.value ? Math.round((r.value / total) * 1000) / 10 : 0,
  }));
}

export async function saveHoldings(holdings: Holding[]): Promise<string> {
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .insert({})
    .select()
    .single();

  if (portfolioError || !portfolio) {
    throw new Error(portfolioError?.message || "Portfolio konnte nicht gespeichert werden.");
  }

  const rows = holdings.map((h) => ({
    portfolio_id: portfolio.id,
    name: h.name,
    ticker: h.ticker === "—" ? null : h.ticker,
    isin: h.isin === "—" ? null : h.isin,
    shares: typeof h.shares === "number" ? h.shares : null,
    value: h.value || null,
  }));

  const { error: holdingsError } = await supabase.from("holdings").insert(rows);
  if (holdingsError) {
    throw new Error(holdingsError.message);
  }

  setActivePortfolioId(portfolio.id);
  return portfolio.id;
}

export async function getActiveHoldings(): Promise<Holding[]> {
  const portfolioId = getActivePortfolioId();
  if (!portfolioId) {
    return getMockHoldings();
  }

  const { data, error } = await supabase
    .from("holdings")
    .select("id, name, ticker, isin, shares, value")
    .eq("portfolio_id", portfolioId);

  if (error || !data || data.length === 0) {
    return getMockHoldings();
  }

  return withWeights(data);
}

export async function getActiveHoldingById(id: string): Promise<Holding | undefined> {
  const holdings = await getActiveHoldings();
  return holdings.find((h) => h.id === id);
}

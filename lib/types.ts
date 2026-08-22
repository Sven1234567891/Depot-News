export type Relevance = "sehr_hoch" | "hoch" | "mittel" | "niedrig";
export type Sentiment = "positiv" | "neutral" | "negativ";

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  isin: string;
  shares: number | string;
  value: number;
  weight: number; // in Prozent, berechnet aus value / Summe aller values
}

export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  ticker: string; // verknüpft die News mit einem Holding über den Ticker
  relevance: Relevance;
  sentiment: Sentiment;
  impact: number; // Portfolio Impact Score, 0–100
  headline: string;
  time: string;
  sources: NewsSource[];
  summary: string;
  meaning: string;
  consolidated?: boolean; // true = mehrere Quellen zu einem Ereignis konsolidiert
}

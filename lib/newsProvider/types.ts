import { NewsItem } from "../types";

export interface NewsProvider {
  /** Liefert News für ein einzelnes Unternehmen, identifiziert über den Ticker. */
  searchNewsByTicker(ticker: string): Promise<NewsItem[]>;
}

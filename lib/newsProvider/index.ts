import { NewsProvider } from "./types";
import { mockNewsProvider } from "./mockProvider";

/**
 * Zentrale Stelle, um den News-Anbieter auszuwählen.
 * Später (Schritt 7): process.env.NEWS_PROVIDER auswerten, z. B.
 * "finnhub" → finnhubNewsProvider zurückgeben. Der Rest der App
 * muss dafür nicht angefasst werden.
 */
export function getNewsProvider(): NewsProvider {
  return mockNewsProvider;
}

export type { NewsProvider } from "./types";

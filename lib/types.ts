import { Holding, NewsItem } from "./types";

/* ------------------------------------------------------------------ */
/*  Mock-Daten. In Schritt 6 werden diese Arrays durch echte           */
/*  Datenbankabfragen (Supabase/Postgres) ersetzt — die Funktionen     */
/*  darunter (getHoldings, getNewsForTicker, ...) bleiben dabei        */
/*  unverändert nutzbar, nur ihr Inneres ändert sich.                  */
/* ------------------------------------------------------------------ */

const RAW_HOLDINGS: Omit<Holding, "weight">[] = [
  { id: "msft", name: "Microsoft", ticker: "MSFT", isin: "US5949181045", shares: 62, value: 25000 },
  { id: "nvda", name: "NVIDIA", ticker: "NVDA", isin: "US67066G1040", shares: 148, value: 18420 },
  { id: "aapl", name: "Apple", ticker: "AAPL", isin: "US0378331005", shares: 74, value: 13800 },
  { id: "novo", name: "Novo Nordisk", ticker: "NOVO-B.CO", isin: "DK0062498333", shares: 210, value: 12000 },
  { id: "asml", name: "ASML", ticker: "ASML", isin: "NL0010273215", shares: 12, value: 9200 },
  { id: "mc", name: "LVMH", ticker: "MC.PA", isin: "FR0000121014", shares: 10, value: 7300 },
  { id: "dbk", name: "Deutsche Bank", ticker: "DBK.DE", isin: "DE0005140008", shares: 320, value: 4300 },
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1", ticker: "NVDA", relevance: "sehr_hoch", sentiment: "positiv", impact: 94,
    headline: "NVIDIA kündigt neues KI-Rechenzentrum-Programm mit Großkunden an",
    time: "Heute, 14:32 Uhr",
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/technology/" },
      { name: "CNBC", url: "https://www.cnbc.com/technology/" },
      { name: "Unternehmensmitteilung", url: "https://investor.nvidia.com/news/" },
    ],
    summary: "NVIDIA hat eine mehrjährige Vereinbarung zur Lieferung von KI-Rechenzentrumshardware an einen großen Cloud-Anbieter bekanntgegeben. Das Volumen wurde nicht beziffert, gilt Analysten zufolge aber als eines der größeren Abkommen des Jahres.",
    meaning: "Zusätzliche Nachfrage nach Rechenzentrums-GPUs könnte das Wachstum im margenstärksten Segment stützen.",
    consolidated: true,
  },
  {
    id: "n2", ticker: "MSFT", relevance: "hoch", sentiment: "positiv", impact: 78,
    headline: "Microsoft erweitert Azure-KI-Partnerschaft im Gesundheitssektor",
    time: "Heute, 11:05 Uhr",
    sources: [{ name: "Financial Times", url: "https://www.ft.com/technology" }],
    summary: "Microsoft baut seine Azure-KI-Dienste für Gesundheitsdienstleister aus und gewinnt nach eigenen Angaben mehrere neue institutionelle Kunden in Europa.",
    meaning: "Könnte das Cloud-Wachstum in einem margenstarken Vertikalmarkt unterstützen.",
  },
  {
    id: "n3", ticker: "NOVO-B.CO", relevance: "hoch", sentiment: "negativ", impact: 71,
    headline: "US-Regulierungsbehörde fordert zusätzliche Sicherheitsdaten zu GLP-1-Präparat",
    time: "Heute, 09:47 Uhr",
    sources: [{ name: "Bloomberg", url: "https://www.bloomberg.com/markets" }],
    summary: "Die FDA verlangt ergänzende Langzeitdaten zu einem Präparat aus Novo Nordisks GLP-1-Portfolio, bevor über eine Indikationserweiterung entschieden wird.",
    meaning: "Könnte eine geplante Zulassungserweiterung verzögern.",
  },
  {
    id: "n4", ticker: "AAPL", relevance: "mittel", sentiment: "neutral", impact: 42,
    headline: "Apple meldet planmäßigen Software-Update-Zyklus für Herbst",
    time: "Heute, 08:15 Uhr",
    sources: [{ name: "MarketWatch", url: "https://www.marketwatch.com" }],
    summary: "Apple bestätigte den regulären Zeitplan für das nächste große Betriebssystem-Update ohne wesentliche Überraschungen.",
    meaning: "Routinemeldung ohne erkennbaren Einfluss auf die kurzfristige Umsatzentwicklung.",
  },
  {
    id: "n5", ticker: "ASML", relevance: "mittel", sentiment: "neutral", impact: 38,
    headline: "ASML-Zulieferer meldet Kapazitätserweiterung für Lithografie-Komponenten",
    time: "Gestern, 16:20 Uhr",
    sources: [{ name: "Handelsblatt", url: "https://www.handelsblatt.com" }],
    summary: "Ein wichtiger Zulieferer kündigte eine Erweiterung der Fertigungskapazität an, die ASML in der Lieferkette zugutekommen könnte.",
    meaning: "Indirekt positiv für die Lieferkettenstabilität, keine unmittelbare Kurswirkung erwartet.",
  },
  {
    id: "n6", ticker: "MC.PA", relevance: "niedrig", sentiment: "neutral", impact: 21,
    headline: "LVMH eröffnet neues Flagship-Store-Konzept in Mailand",
    time: "Gestern, 12:10 Uhr",
    sources: [{ name: "Fashion Network", url: "https://ww.fashionnetwork.com" }],
    summary: "LVMH hat ein neues Store-Format für eine seiner Modemarken vorgestellt. Reguläre Expansionsmaßnahme ohne finanzielle Details.",
    meaning: "Für langfristige Investoren voraussichtlich von geringer Bedeutung.",
  },
];

export const SIMULATED_FAILURE_TICKER = "DBK.DE";

/* ------------------------------------------------------------------ */
/*  Öffentliche Datenschicht — das ruft die App auf, nicht die Arrays  */
/*  direkt. So bleibt der Rest der App unabhängig davon, ob die Daten  */
/*  aus Mock-Arrays oder später aus der Datenbank kommen.              */
/* ------------------------------------------------------------------ */

export function getHoldings(): Holding[] {
  const totalValue = RAW_HOLDINGS.reduce((sum, h) => sum + h.value, 0);
  return RAW_HOLDINGS.map((h) => ({
    ...h,
    weight: totalValue > 0 ? Math.round((h.value / totalValue) * 1000) / 10 : 0,
  }));
}

export function getHoldingById(id: string): Holding | undefined {
  return getHoldings().find((h) => h.id === id);
}

export function getNewsForTicker(ticker: string): NewsItem[] {
  return MOCK_NEWS.filter((n) => n.ticker.toUpperCase() === ticker.toUpperCase());
}

export function getAllNews(): NewsItem[] {
  return [...MOCK_NEWS].sort((a, b) => b.impact - a.impact);
}

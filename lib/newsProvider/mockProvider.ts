import { NewsItem } from "../types";
import { NewsProvider } from "./types";

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

const SIMULATED_FAILURE_TICKER = "DBK.DE";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockNewsProvider: NewsProvider = {
  async searchNewsByTicker(ticker: string): Promise<NewsItem[]> {
    await delay(150); // simuliert die Latenz eines echten API-Aufrufs

    if (ticker.toUpperCase() === SIMULATED_FAILURE_TICKER) {
      throw new Error("Quelle nicht erreichbar");
    }

    return MOCK_NEWS.filter((n) => n.ticker.toUpperCase() === ticker.toUpperCase());
  },
};

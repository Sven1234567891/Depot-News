import { Holding } from "./types";

/* ------------------------------------------------------------------ */
/*  Mock-Holdings. In Schritt 6 wird dies durch echte Datenbank-        */
/*  abfragen ersetzt — getHoldings()/getHoldingById() bleiben als       */
/*  Funktionen bestehen, nur ihr Inneres ändert sich.                   */
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

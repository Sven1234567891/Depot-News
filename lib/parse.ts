import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Holding } from "./types";

const COLUMN_ALIASES: Record<string, string[]> = {
  name: ["unternehmen", "name", "company", "wertpapier", "position", "bezeichnung"],
  ticker: ["ticker", "symbol", "wkn/ticker", "kürzel"],
  isin: ["isin"],
  shares: ["stück", "stueck", "anzahl", "shares", "menge", "quantity"],
  // Spezifische Begriffe zuerst, generische ("wert", "value") als Fallback zuletzt.
  value: [
    "aktueller wert",
    "market value",
    "depotwert",
    "marktwert",
    "kurswert",
    "aktueller_wert",
    "wert",
    "value",
  ],
};

function normalizeHeader(h: string) {
  return (h || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ") // "Aktueller_Wert_EUR" -> "aktueller wert eur"
    .replace(/\s+/g, " ");
}

function findColumn(headers: string[], aliases: string[], exclude: Set<string>): string | null {
  const candidates = headers.filter((h) => !exclude.has(h));
  const normalized = candidates.map(normalizeHeader);
  for (const alias of aliases) {
    const idx = normalized.findIndex((h) => h === alias || h.includes(alias));
    if (idx !== -1) return candidates[idx];
  }
  return null;
}

function parseNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const cleaned = raw
    .toString()
    .replace(/[€$\s]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

export interface ParseResult {
  holdings: Holding[];
  error: string | null;
}

function rowsToHoldings(rowObjects: Record<string, unknown>[], headers: string[]): ParseResult {
  const used = new Set<string>();

  const nameCol = findColumn(headers, COLUMN_ALIASES.name, used);
  if (nameCol) used.add(nameCol);

  const tickerCol = findColumn(headers, COLUMN_ALIASES.ticker, used);
  if (tickerCol) used.add(tickerCol);

  const isinCol = findColumn(headers, COLUMN_ALIASES.isin, used);
  if (isinCol) used.add(isinCol);

  const sharesCol = findColumn(headers, COLUMN_ALIASES.shares, used);
  if (sharesCol) used.add(sharesCol);

  const valueCol = findColumn(headers, COLUMN_ALIASES.value, used);
  if (valueCol) used.add(valueCol);

  if (!nameCol) {
    return { holdings: [], error: "Keine Spalte mit Unternehmensnamen erkannt (z. B. „Unternehmen“ oder „Name“)." };
  }

  const rows = rowObjects
    .filter((row) => (row[nameCol] ?? "").toString().trim() !== "")
    .map((row, i) => {
      const name = row[nameCol]!.toString().trim();
      const ticker = tickerCol ? (row[tickerCol] ?? "").toString().trim() : "";
      const isin = isinCol ? (row[isinCol] ?? "").toString().trim() : "";
      const shares = sharesCol ? parseNumber(row[sharesCol]) : null;
      const value = valueCol ? parseNumber(row[valueCol]) : null;
      return {
        id: (ticker || isin || name).toUpperCase().replace(/\s+/g, "_") + "_" + i,
        name,
        ticker: ticker || "—",
        isin: isin || "—",
        shares: shares ?? "—",
        value: value ?? 0,
      };
    });

  if (rows.length === 0) {
    return { holdings: [], error: "In der Datei wurden keine Positionen gefunden." };
  }

  const totalValue = rows.reduce((sum, r) => sum + (typeof r.value === "number" ? r.value : 0), 0);
  const holdings: Holding[] = rows.map((r) => ({
    ...r,
    weight: totalValue > 0 && typeof r.value === "number" ? Math.round((r.value / totalValue) * 1000) / 10 : 0,
  }));

  return { holdings, error: null };
}

export function parseCsvText(text: string): ParseResult {
  const result = Papa.parse<Record<string, unknown>>(text.trim(), { header: true, skipEmptyLines: true });
  if (result.errors?.length && (!result.data || result.data.length === 0)) {
    return { holdings: [], error: "Die Datei konnte nicht als CSV gelesen werden." };
  }
  return rowsToHoldings(result.data, result.meta.fields || []);
}

export function parseXlsxBuffer(arrayBuffer: ArrayBuffer): ParseResult {
  let workbook;
  try {
    workbook = XLSX.read(arrayBuffer, { type: "array" });
  } catch {
    return { holdings: [], error: "Die Excel-Datei konnte nicht gelesen werden. Ist die Datei beschädigt oder passwortgeschützt?" };
  }
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { holdings: [], error: "Die Excel-Datei enthält kein lesbares Arbeitsblatt." };
  }
  const sheet = workbook.Sheets[firstSheetName];
  const rowObjects = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  if (rowObjects.length === 0) {
    return { holdings: [], error: "Im ersten Arbeitsblatt wurden keine Zeilen gefunden." };
  }
  const headers = Object.keys(rowObjects[0]);
  return rowsToHoldings(rowObjects, headers);
}

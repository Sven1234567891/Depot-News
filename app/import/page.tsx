"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileWarning, CheckCircle2 } from "lucide-react";
import { parseCsvText, parseXlsxBuffer, ParseResult } from "@/lib/parse";
import { saveHoldings } from "@/lib/portfolio";
import { Holding } from "@/lib/types";

export default function ImportPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyResult = ({ holdings: parsed, error: err }: ParseResult) => {
    if (err || parsed.length === 0) {
      setError(err || "In der Datei wurden keine Positionen gefunden.");
      setHoldings(null);
      return;
    }
    setError(null);
    setSaveError(null);
    setHoldings(parsed);
  };

  const handleFile = (file: File) => {
    setError(null);
    const name = file.name.toLowerCase();

    if (name.endsWith(".csv") || file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => applyResult(parseCsvText(e.target!.result as string));
      reader.onerror = () => setError("Die Datei konnte nicht gelesen werden.");
      reader.readAsText(file);
      return;
    }

    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => applyResult(parseXlsxBuffer(e.target!.result as ArrayBuffer));
      reader.onerror = () => setError("Die Excel-Datei konnte nicht gelesen werden.");
      reader.readAsArrayBuffer(file);
      return;
    }

    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      setError(
        "PDF konnte nicht automatisch gelesen werden. Die PDF-Extraktion läuft in der Produktivversion serverseitig — bitte lade deinen Depotauszug für diesen Prototyp als CSV oder Excel (XLSX) hoch."
      );
      return;
    }

    setError("Dateityp nicht erkannt. Bitte lade eine CSV-, XLSX-, XLS- oder PDF-Datei hoch.");
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) handleFile(files[0]);
  };

  const handleSave = async () => {
    if (!holdings) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveHoldings(holdings);
      router.push("/dashboard");
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Unbekannter Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const SAMPLE_CSV = `Unternehmen,Ticker,ISIN,Stück,Depotwert
Microsoft,MSFT,US5949181045,62,25000
NVIDIA,NVDA,US67066G1040,148,18420
Apple,AAPL,US0378331005,74,13800
Novo Nordisk,NOVO-B.CO,DK0062498333,210,12000
ASML,ASML,NL0010273215,12,9200
LVMH,MC.PA,FR0000121014,10,7300
Deutsche Bank,DBK.DE,DE0005140008,320,4300`;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-center">Portfolio importieren</h1>
      <p className="mt-2 text-center text-sm text-[#5B6576]">
        Lade deinen Depotauszug als CSV oder Excel (XLSX) hoch — die Anwendung erkennt Unternehmen, Ticker, ISIN,
        Stück und Depotwert automatisch.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all"
        style={{
          borderColor: dragging ? "#3653F4" : "#C7CEDA",
          background: dragging ? "rgba(54,83,244,0.06)" : "#F7F8FA",
        }}
      >
        <Upload size={22} className="mb-3" style={{ color: dragging ? "#3653F4" : "#5B6576" }} />
        <p className="text-sm font-medium">CSV, XLSX/XLS oder PDF hier ablegen</p>
        <p className="mt-1 text-xs text-[#8890A0]">oder</p>
        <button onClick={() => inputRef.current?.click()} className="btn-primary mt-4 text-[15px]">
          <Upload size={16} /> Datei auswählen
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#F0C6BD] bg-[#FBEAE7] px-4 py-3 text-xs text-[#8C2F22]">
          <FileWarning size={14} /> {error}
        </div>
      )}

      <button
        onClick={() => applyResult(parseCsvText(SAMPLE_CSV))}
        className="mt-4 block text-xs font-medium text-[#5B6576] underline underline-offset-2 hover:text-[#101826]"
      >
        Keine eigene Datei zur Hand? Beispiel-Depot laden
      </button>

      {holdings && (
        <>
          <h2 className="mt-10 font-serif text-xl font-medium">Erkannte Positionen</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-[#DDE2E9] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#DDE2E9] bg-[#F7F8FA] text-xs uppercase tracking-wide text-[#8890A0]">
                  <th className="px-4 py-3 font-medium">Unternehmen</th>
                  <th className="px-4 py-3 font-medium">Ticker</th>
                  <th className="px-4 py-3 font-medium text-right">Depotwert</th>
                  <th className="px-4 py-3 font-medium text-right">Gewicht</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.id} className="border-b border-[#EEF0F3] last:border-0">
                    <td className="px-4 py-3 font-medium">{h.name}</td>
                    <td className="px-4 py-3 font-mono text-[#5B6576]">{h.ticker}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {h.value ? h.value.toLocaleString("de-DE") + " €" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{h.weight}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#8890A0]">
            <CheckCircle2 size={14} /> {holdings.length} von {holdings.length} Positionen erfolgreich erkannt.
          </div>

          {saveError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#F0C6BD] bg-[#FBEAE7] px-4 py-3 text-xs text-[#8C2F22]">
              <FileWarning size={14} /> {saveError}
            </div>
          )}

          <button onClick={handleSave} disabled={saving} className="btn-primary mt-6 text-[15px]">
            <CheckCircle2 size={16} /> {saving ? "Wird gespeichert …" : "Portfolio speichern"}
          </button>
        </>
      )}
    </main>
  );
}

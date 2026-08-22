import { getHoldings, getAllNews } from "@/lib/data";

export default function Home() {
  const holdings = getHoldings();
  const news = getAllNews();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-center">Portfolio News Monitor</h1>
      <p className="mt-2 text-center text-sm text-[#5B6576]">
        Schritt 2 erledigt: Datenmodell &amp; Mock-Daten-Layer. {holdings.length} Positionen, {news.length} News
        werden jetzt aus <code>lib/data.ts</code> geladen.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-[#DDE2E9] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#DDE2E9] bg-[#F7F8FA] text-xs uppercase tracking-wide text-[#8890A0]">
              <th className="px-4 py-3 font-medium">Unternehmen</th>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium text-right">Gewicht</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.id} className="border-b border-[#EEF0F3] last:border-0">
                <td className="px-4 py-3 font-medium">{h.name}</td>
                <td className="px-4 py-3 font-mono text-[#5B6576]">{h.ticker}</td>
                <td className="px-4 py-3 text-right font-mono">{h.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

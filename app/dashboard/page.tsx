"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, AlertTriangle, Filter, CircleAlert } from "lucide-react";
import { getHoldings } from "@/lib/data";
import { getNewsProvider } from "@/lib/newsProvider";
import { NewsItem, Holding } from "@/lib/types";
import { NewsCard } from "@/components/NewsCard";
import { RelevanceBadge } from "@/components/badges";

type FilterId = "alle" | "sehr_relevant" | "positiv" | "neutral" | "negativ";
type NewsWithCompany = NewsItem & { companyId: string };

export default function DashboardPage() {
  const holdings = useMemo(() => getHoldings(), []);
  const [refreshing, setRefreshing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [filter, setFilter] = useState<FilterId>("alle");
  const [news, setNews] = useState<NewsWithCompany[]>([]);
  const [failedHoldings, setFailedHoldings] = useState<Holding[]>([]);

  const holdingsById = useMemo(() => Object.fromEntries(holdings.map((h) => [h.id, h])), [holdings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const provider = getNewsProvider();

    const results = await Promise.allSettled(
      holdings.map(async (h) => {
        const items = await provider.searchNewsByTicker(h.ticker);
        return { holding: h, items };
      })
    );

    const collected: NewsWithCompany[] = [];
    const failed: Holding[] = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        result.value.items.forEach((item) => collected.push({ ...item, companyId: result.value.holding.id }));
      } else {
        failed.push(holdings[i]);
      }
    });

    setNews(collected);
    setFailedHoldings(failed);
    setRefreshing(false);
    setHasFetched(true);
  };

  const filtered = useMemo(() => {
    let list = [...news];
    if (filter === "sehr_relevant") list = list.filter((n) => n.relevance === "sehr_hoch" || n.relevance === "hoch");
    if (filter === "positiv") list = list.filter((n) => n.sentiment === "positiv");
    if (filter === "neutral") list = list.filter((n) => n.sentiment === "neutral");
    if (filter === "negativ") list = list.filter((n) => n.sentiment === "negativ");
    return list.sort((a, b) => b.impact - a.impact);
  }, [news, filter]);

  const top = useMemo(() => [...news].sort((a, b) => b.impact - a.impact).slice(0, 3), [news]);

  const counts = {
    total: news.length,
    important: news.filter((n) => n.relevance === "sehr_hoch" || n.relevance === "hoch").length,
    positive: news.filter((n) => n.sentiment === "positiv").length,
    negative: news.filter((n) => n.sentiment === "negativ").length,
  };

  const filters: { id: FilterId; label: string }[] = [
    { id: "alle", label: "Alle" },
    { id: "sehr_relevant", label: "Sehr relevant" },
    { id: "positiv", label: "Positiv" },
    { id: "neutral", label: "Neutral" },
    { id: "negativ", label: "Negativ" },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Portfolio News Monitor</h1>
          <p className="mt-1 text-sm text-[#5B6576]">{holdings.length} Unternehmen im Depot</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="btn-primary text-[15px]">
          {!hasFetched && !refreshing && <span className="pulse-dot" />}
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "News werden abgerufen …" : "News für heute abrufen"}
        </button>
      </div>

      {!hasFetched && !refreshing && (
        <div className="mt-8 rounded-xl border border-dashed border-[#C7CEDA] bg-[#F7F8FA] px-6 py-10 text-center text-sm text-[#5B6576]">
          Noch keine News abgerufen. Klicke oben auf „News für heute abrufen", um dein Depot zu prüfen.
        </div>
      )}

      {hasFetched && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill label="Relevante News" value={counts.total} />
            <StatPill label="Wichtige Meldungen" value={counts.important} tone="#8C2F22" />
            <StatPill label="Positive News" value={counts.positive} tone="#146C51" />
            <StatPill label="Negative News" value={counts.negative} tone="#9A3B2E" />
          </div>

          {failedHoldings.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#EEDFC2] bg-[#FCF6E8] px-4 py-3 text-xs text-[#7A5E14]">
              <CircleAlert size={14} className="mt-0.5 shrink-0" />
              Für {failedHoldings.map((h) => h.name).join(", ")} konnten aktuell keine News abgerufen werden (Quelle
              nicht erreichbar). Die übrigen {holdings.length - failedHoldings.length} Unternehmen wurden erfolgreich
              verarbeitet.
            </div>
          )}

          {top.length > 0 && (
            <div className="mt-10">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#8C2F22]" />
                <h2 className="font-serif text-xl font-medium">Wichtigste Nachrichten heute</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {top.map((n, i) => (
                  <Link
                    key={n.id}
                    href={`/company/${n.companyId}`}
                    className="block rounded-xl border border-[#DDE2E9] bg-white p-4 hover:shadow-sm"
                  >
                    <div className="font-mono text-xs text-[#8890A0]">
                      #{i + 1} · {holdingsById[n.companyId].name}
                    </div>
                    <div className="mt-1 font-serif text-base leading-snug">{n.headline}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <RelevanceBadge level={n.relevance} />
                      <span className="font-mono text-xs text-[#5B6576]">Impact {n.impact}/100</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-[#8890A0]" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={
                  filter === f.id
                    ? { background: "#101826", color: "white" }
                    : { background: "#F0F2F5", color: "#5B6576" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#C7CEDA] px-6 py-10 text-center text-sm text-[#8890A0]">
                Keine relevanten News aus den verfügbaren Quellen gefunden.
              </div>
            ) : (
              filtered.map((n) => <NewsCard key={n.id} item={n} company={holdingsById[n.companyId]} />)
            )}
          </div>

          <p className="mt-10 text-center text-[11px] text-[#B0B8C4]">
            KI-generierte Einschätzungen dienen ausschließlich der Einordnung von Nachrichten und stellen keine
            Anlageberatung oder Kauf-/Verkaufsempfehlung dar.
          </p>
        </>
      )}
    </main>
  );
}

function StatPill({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-[#DDE2E9] bg-white px-4 py-3">
      <span className="font-serif text-2xl" style={{ color: tone || "#101826" }}>
        {value}
      </span>
      <span className="text-xs text-[#8890A0]">{label}</span>
    </div>
  );
}

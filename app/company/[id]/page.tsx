import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CircleAlert } from "lucide-react";
import { getHoldingById, getNewsForTicker, SIMULATED_FAILURE_TICKER } from "@/lib/data";
import { RelevanceBadge, SentimentBadge, ImpactScore } from "@/components/badges";

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = getHoldingById(params.id);
  if (!company) notFound();

  const failed = company.ticker.toUpperCase() === SIMULATED_FAILURE_TICKER;
  const companyNews = getNewsForTicker(company.ticker).sort((a, b) => b.impact - a.impact);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1 text-xs text-[#5B6576] hover:text-[#101826]">
        <ArrowLeft size={14} /> Zurück zum Dashboard
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium">{company.name}</h1>
          <p className="mt-1 font-mono text-sm text-[#8890A0]">
            {company.ticker} · {company.isin}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="font-mono text-lg">{company.weight}%</div>
            <div className="text-xs text-[#8890A0]">Depotgewicht</div>
          </div>
          <div>
            <div className="font-mono text-lg">{company.value.toLocaleString("de-DE")} €</div>
            <div className="text-xs text-[#8890A0]">Depotwert</div>
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-serif text-lg font-medium">News heute</h2>

      {failed ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#EEDFC2] bg-[#FCF6E8] px-4 py-3 text-sm text-[#7A5E14]">
          <CircleAlert size={15} className="mt-0.5 shrink-0" /> Für {company.name} konnten aktuell keine News aus
          den verfügbaren Quellen abgerufen werden.
        </div>
      ) : companyNews.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-[#C7CEDA] px-4 py-6 text-center text-sm text-[#8890A0]">
          Keine relevanten News aus den verfügbaren Quellen gefunden.
        </div>
      ) : (
        <div className="mt-3 grid gap-3">
          {companyNews.map((n) => (
            <div key={n.id} className="rounded-xl border border-[#DDE2E9] bg-white p-4">
              <div className="flex items-center justify-between text-xs text-[#8890A0]">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {n.time}
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {n.sources.map((s, i) => (
                    <span key={s.name} className="flex items-center gap-1.5">
                      {i > 0 && <span>·</span>}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-[#C7CEDA] underline-offset-2 hover:text-[#101826] hover:decoration-[#101826]"
                      >
                        {s.name}
                      </a>
                    </span>
                  ))}
                </span>
              </div>
              <div className="mt-1.5 font-serif text-base">{n.headline}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <RelevanceBadge level={n.relevance} />
                <SentimentBadge level={n.sentiment} />
                <ImpactScore value={n.impact} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

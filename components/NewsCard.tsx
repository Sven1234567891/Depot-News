import Link from "next/link";
import { Building2, Clock, ExternalLink } from "lucide-react";
import { NewsItem, Holding } from "@/lib/types";
import { RelevanceBadge, SentimentBadge, ImpactScore } from "./badges";

export function NewsCard({ item, company }: { item: NewsItem; company: Holding }) {
  return (
    <div className="rounded-xl border border-[#DDE2E9] bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/company/${company.id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-[#5B6576] hover:text-[#101826]"
        >
          <Building2 size={12} /> {company.name}
          <span className="font-mono text-[#B0B8C4]">{company.ticker}</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-[#8890A0]">
          <Clock size={12} /> {item.time}
        </div>
      </div>

      <h3 className="mt-2 font-serif text-lg leading-snug">{item.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#3B4454]">{item.summary}</p>

      <div className="mt-3 rounded-lg bg-[#F7F8FA] px-3 py-2 text-xs leading-relaxed text-[#5B6576]">
        <span className="font-medium text-[#101826]">Mögliche Bedeutung: </span>
        {item.meaning}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <RelevanceBadge level={item.relevance} />
        <SentimentBadge level={item.sentiment} />
        <ImpactScore value={item.impact} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#EEF0F3] pt-3">
        {item.sources.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-[#3B4454] underline decoration-[#C7CEDA] underline-offset-2 hover:text-[#101826] hover:decoration-[#101826]"
          >
            {s.name} <ExternalLink size={11} />
          </a>
        ))}
        {item.consolidated && (
          <span className="font-mono text-[11px] text-[#8890A0]">
            · {item.sources.length} Quellen zu diesem Ereignis konsolidiert
          </span>
        )}
      </div>
    </div>
  );
}

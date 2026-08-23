import { Relevance, Sentiment } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

const REL: Record<Relevance, { label: string; dot: string; bg: string; fg: string }> = {
  sehr_hoch: { label: "Sehr hohe Relevanz", dot: "#8C2F22", bg: "#FBEAE7", fg: "#8C2F22" },
  hoch: { label: "Hohe Relevanz", dot: "#B5721E", bg: "#FCF1E0", fg: "#8A5814" },
  mittel: { label: "Mittlere Relevanz", dot: "#8A7A1E", bg: "#FBF6DE", fg: "#71620F" },
  niedrig: { label: "Niedrige Relevanz", dot: "#7A8699", bg: "#EEF0F3", fg: "#5B6576" },
};

const SENT: Record<Sentiment, { label: string; fg: string; bg: string; Icon: LucideIcon }> = {
  positiv: { label: "Positiv", fg: "#146C51", bg: "#E4F3EC", Icon: TrendingUp },
  neutral: { label: "Neutral", fg: "#8A6D14", bg: "#F6F0DD", Icon: Minus },
  negativ: { label: "Negativ", fg: "#9A3B2E", bg: "#F7E7E4", Icon: TrendingDown },
};

function Badge({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

export function RelevanceBadge({ level }: { level: Relevance }) {
  const r = REL[level];
  return (
    <Badge bg={r.bg} fg={r.fg}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.dot }} />
      {r.label}
    </Badge>
  );
}

export function SentimentBadge({ level }: { level: Sentiment }) {
  const s = SENT[level];
  const Icon = s.Icon;
  return (
    <Badge bg={s.bg} fg={s.fg}>
      <Icon size={12} /> {s.label}
    </Badge>
  );
}

export function ImpactScore({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#DDE2E9]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: "#101826" }} />
      </div>
      <span className="font-mono text-xs text-[#5B6576]">{value}/100</span>
    </div>
  );
}

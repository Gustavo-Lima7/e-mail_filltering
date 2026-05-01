import { cn } from "@/lib/utils";
import type { MockEmail } from "@/data/mockEmails";
import type { Classification } from "@/lib/risk";
import { RiskBadge } from "./RiskBadge";
import { Loader2 } from "lucide-react";

type Props = {
  email: MockEmail;
  classification?: Classification;
  isAnalyzing?: boolean;
  selected?: boolean;
  onClick: () => void;
};

export const EmailListItem = ({ email, classification, isAnalyzing, selected, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full border-b border-border px-5 py-4 text-left transition",
        "hover:bg-accent/40",
        selected && "bg-accent/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-medium text-foreground">{email.fromName}</span>
            <span className="truncate font-mono text-[10px] text-muted-foreground">&lt;{email.from}&gt;</span>
          </div>
          <div className="mt-1 truncate text-sm text-foreground/90">{email.subject}</div>
          <div className="mt-1 truncate text-xs text-muted-foreground">
            {email.body.replace(/\n/g, " ").slice(0, 110)}…
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{email.date}</span>
          {isAnalyzing ? (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-primary">
              <Loader2 className="h-3 w-3 animate-spin" /> ANALISANDO
            </span>
          ) : classification ? (
            <RiskBadge category={classification.category} size="sm" glow={classification.category !== "safe" && classification.category !== "spam"} />
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">não analisado</span>
          )}
        </div>
      </div>
    </button>
  );
};

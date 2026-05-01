import { Inbox, ShieldCheck, ShieldAlert, Fish, Skull, Megaphone, ShieldQuestion } from "lucide-react";
import { CATEGORY_META, type RiskCategory } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Filter = "all" | "unclassified" | RiskCategory;

const ITEMS: { key: Filter; label: string; Icon: typeof Inbox }[] = [
  { key: "all",          label: "Caixa de entrada", Icon: Inbox },
  { key: "unclassified", label: "Não analisados",   Icon: ShieldQuestion },
  { key: "safe",         label: CATEGORY_META.safe.label,     Icon: ShieldCheck },
  { key: "suspect",      label: CATEGORY_META.suspect.label,  Icon: ShieldAlert },
  { key: "phishing",     label: CATEGORY_META.phishing.label, Icon: Fish },
  { key: "scam",         label: CATEGORY_META.scam.label,     Icon: Skull },
  { key: "spam",         label: CATEGORY_META.spam.label,     Icon: Megaphone },
];

type Props = {
  active: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
};

export const CategorySidebar = ({ active, onChange, counts }: Props) => {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface-overlay/60 backdrop-blur">
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary glow-safe">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold leading-none">Sentinel</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Email Threat Console
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const meta = key !== "all" && key !== "unclassified" ? CATEGORY_META[key as RiskCategory] : null;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
                "hover:bg-accent",
                isActive && "bg-accent",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn(
                  "h-4 w-4 transition",
                  meta ? meta.textClass : "text-muted-foreground",
                  isActive && "scale-110",
                )} />
                <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{counts[key] ?? 0}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-md border border-border bg-card/50 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Modelo</div>
          <div className="mt-1 font-display text-sm">Lovable AI · Gemini 3 Flash</div>
        </div>
      </div>
    </aside>
  );
};

export type { Filter };

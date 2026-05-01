import { CATEGORY_META, type RiskCategory } from "@/lib/risk";
import { cn } from "@/lib/utils";

export const ConfidenceBar = ({ value, category }: { value: number; category: RiskCategory }) => {
  const meta = CATEGORY_META[category];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Confiança</span>
        <span className={meta.textClass}>{Math.round(value)}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full animate-fill", meta.dot)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

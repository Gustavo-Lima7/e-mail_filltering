import { CATEGORY_META, type RiskCategory } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Props = {
  category: RiskCategory;
  size?: "sm" | "md";
  glow?: boolean;
};

export const RiskBadge = ({ category, size = "md", glow = false }: Props) => {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-mono uppercase tracking-wider",
        meta.bgGradient,
        meta.textClass,
        "border-current/30",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        glow && meta.glow,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full pulse-dot", meta.dot)} />
      {meta.short}
    </span>
  );
};

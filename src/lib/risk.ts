export type RiskCategory = "safe" | "suspect" | "phishing" | "scam" | "spam";
export type Urgency = "low" | "medium" | "high" | "critical";
export type RecommendedAction = "read" | "review" | "delete" | "report" | "block_sender";

export type Classification = {
  category: RiskCategory;
  confidence: number; // 0-100
  urgency: Urgency;
  summary: string;
  reasoning: string;
  red_flags: string[];
  recommended_action: RecommendedAction;
};

export const CATEGORY_META: Record<RiskCategory, {
  label: string;
  short: string;
  textClass: string;
  bgGradient: string;
  glow: string;
  dot: string;
}> = {
  safe:     { label: "Seguro",   short: "SAFE",     textClass: "text-risk-safe",     bgGradient: "bg-[var(--gradient-risk-safe)]",     glow: "glow-safe",     dot: "bg-risk-safe" },
  suspect:  { label: "Suspeito", short: "SUSPECT",  textClass: "text-risk-suspect",  bgGradient: "bg-[var(--gradient-risk-suspect)]",  glow: "glow-suspect",  dot: "bg-risk-suspect" },
  phishing: { label: "Phishing", short: "PHISHING", textClass: "text-risk-phishing", bgGradient: "bg-[var(--gradient-risk-phishing)]", glow: "glow-phishing", dot: "bg-risk-phishing" },
  scam:     { label: "Golpe",    short: "SCAM",     textClass: "text-risk-scam",     bgGradient: "bg-[var(--gradient-risk-scam)]",     glow: "glow-scam",     dot: "bg-risk-scam" },
  spam:     { label: "Spam",     short: "SPAM",     textClass: "text-risk-spam",     bgGradient: "bg-[var(--gradient-risk-spam)]",     glow: "glow-spam",     dot: "bg-risk-spam" },
};

export const URGENCY_META: Record<Urgency, { label: string; className: string }> = {
  low:      { label: "Baixa",    className: "text-muted-foreground border-border" },
  medium:   { label: "Média",    className: "text-risk-suspect border-risk-suspect/40" },
  high:     { label: "Alta",     className: "text-risk-phishing border-risk-phishing/50" },
  critical: { label: "Crítica",  className: "text-risk-scam border-risk-scam/60" },
};

export const ACTION_LABEL: Record<RecommendedAction, string> = {
  read: "Ler normalmente",
  review: "Revisar com atenção",
  delete: "Excluir",
  report: "Denunciar",
  block_sender: "Bloquear remetente",
};

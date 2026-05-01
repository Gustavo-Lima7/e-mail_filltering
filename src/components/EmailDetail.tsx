import { AlertTriangle, ArrowRight, Mail, Sparkles, Loader2 } from "lucide-react";
import type { MockEmail } from "@/data/mockEmails";
import { ACTION_LABEL, CATEGORY_META, URGENCY_META, type Classification } from "@/lib/risk";
import { RiskBadge } from "./RiskBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  email: MockEmail | null;
  classification?: Classification;
  isAnalyzing?: boolean;
  onAnalyze: () => void;
};

export const EmailDetail = ({ email, classification, isAnalyzing, onAnalyze }: Props) => {
  if (!email) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-muted-foreground">
          <Mail className="h-6 w-6" />
        </div>
        <div className="font-display text-lg">Selecione um email</div>
        <p className="max-w-xs text-sm text-muted-foreground">
          Escolha uma mensagem da caixa para analisar com IA e ver a classificação de risco.
        </p>
      </div>
    );
  }

  const meta = classification ? CATEGORY_META[classification.category] : null;
  const urg = classification ? URGENCY_META[classification.urgency] : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        "border-b border-border px-7 py-5 transition",
        meta && meta.bgGradient,
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold leading-tight text-foreground">{email.subject}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="font-medium">{email.fromName}</span>
              <span className="font-mono text-xs text-muted-foreground">&lt;{email.from}&gt;</span>
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {email.date}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {classification && <RiskBadge category={classification.category} glow />}
            {urg && (
              <span className={cn(
                "inline-flex items-center gap-1 rounded-md border bg-background/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider",
                urg.className,
              )}>
                Urgência: {urg.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analysis panel */}
      <div className="border-b border-border bg-surface-overlay/40 px-7 py-5">
        {isAnalyzing ? (
          <div className="scanline rounded-md border border-primary/30 bg-card/50 p-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analisando ameaças com IA…
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Verificando remetente, intenção, urgência e sinais de fraude.
            </div>
          </div>
        ) : classification ? (
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="space-y-3 animate-fade-up">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Resumo</div>
                <p className="mt-1 text-sm text-foreground">{classification.summary}</p>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Análise</div>
                <p className="mt-1 text-sm text-foreground/90">{classification.reasoning}</p>
              </div>
              {classification.red_flags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-risk-phishing">
                    <AlertTriangle className="h-3 w-3" /> Sinais de alerta
                  </div>
                  <ul className="mt-2 space-y-1">
                    {classification.red_flags.map((f, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/90">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-risk-phishing" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-4 rounded-md border border-border bg-card/50 p-4">
              <ConfidenceBar value={classification.confidence} category={classification.category} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Ação recomendada</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  {ACTION_LABEL[classification.recommended_action]}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-card/30 p-4">
            <div>
              <div className="font-display text-sm font-medium">Email ainda não analisado</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Rode a análise de IA para classificar e detectar sinais de risco.
              </p>
            </div>
            <Button onClick={onAnalyze} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Analisar com IA
            </Button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-7 py-6">
        <pre className="whitespace-pre-wrap font-display text-sm leading-relaxed text-foreground/90">
{email.body}
        </pre>
      </div>
    </div>
  );
};

import { useMemo, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mockEmails } from "@/data/mockEmails";
import { CategorySidebar, type Filter } from "@/components/CategorySidebar";
import { EmailListItem } from "@/components/EmailListItem";
import { EmailDetail } from "@/components/EmailDetail";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Classification, RiskCategory } from "@/lib/risk";

type ClassMap = Record<string, Classification>;

const Index = () => {
  const [classifications, setClassifications] = useState<ClassMap>({});
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>(mockEmails[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [batchRunning, setBatchRunning] = useState(false);

  const setOne = (id: string, c: Classification) =>
    setClassifications((prev) => ({ ...prev, [id]: c }));

  const markAnalyzing = (id: string, on: boolean) =>
    setAnalyzing((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const analyzeOne = async (id: string) => {
    const email = mockEmails.find((e) => e.id === id);
    if (!email) return;
    markAnalyzing(id, true);
    try {
      const { data, error } = await supabase.functions.invoke("classify-email", {
        body: { email },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setOne(id, data as Classification);
    } catch (e: any) {
      toast.error("Falha ao classificar", { description: e?.message ?? "Erro desconhecido" });
    } finally {
      markAnalyzing(id, false);
    }
  };

  const analyzeAll = async () => {
    setBatchRunning(true);
    const pending = mockEmails.filter((e) => !classifications[e.id]);
    for (const e of pending) {
      await analyzeOne(e.id);
    }
    setBatchRunning(false);
    toast.success("Análise concluída", { description: `${pending.length} emails classificados.` });
  };

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: mockEmails.length,
      unclassified: 0,
      safe: 0, suspect: 0, phishing: 0, scam: 0, spam: 0,
    };
    for (const e of mockEmails) {
      const c = classifications[e.id];
      if (!c) base.unclassified++;
      else base[c.category]++;
    }
    return base;
  }, [classifications]);

  const visibleEmails = useMemo(() => {
    return mockEmails.filter((e) => {
      const c = classifications[e.id];
      if (filter === "all") return true;
      if (filter === "unclassified") return !c;
      return c?.category === (filter as RiskCategory);
    });
  }, [filter, classifications]);

  const selected = mockEmails.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="grid h-screen grid-cols-[260px_minmax(360px,420px)_1fr] overflow-hidden">
      <CategorySidebar active={filter} onChange={setFilter} counts={counts} />

      {/* Inbox column */}
      <section className="flex h-full flex-col border-r border-border bg-card/30">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">
              {filter === "all" ? "Caixa de entrada" :
               filter === "unclassified" ? "Não analisados" :
               { safe: "Seguros", suspect: "Suspeitos", phishing: "Phishing", scam: "Golpes", spam: "Spam" }[filter]}
            </h2>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {visibleEmails.length} {visibleEmails.length === 1 ? "mensagem" : "mensagens"}
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={analyzeAll}
            disabled={batchRunning || counts.unclassified === 0}
            className="gap-1.5"
          >
            {batchRunning ? (
              <>
                <Zap className="h-3.5 w-3.5 animate-pulse" />
                Analisando…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Analisar todos
              </>
            )}
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          {visibleEmails.length === 0 ? (
            <div className="grid h-full place-items-center p-10 text-center text-sm text-muted-foreground">
              Nenhum email nesta categoria.
            </div>
          ) : (
            visibleEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                classification={classifications[email.id]}
                isAnalyzing={analyzing.has(email.id)}
                selected={selectedId === email.id}
                onClick={() => setSelectedId(email.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* Detail column */}
      <main className="h-full overflow-hidden bg-background">
        <EmailDetail
          email={selected}
          classification={selected ? classifications[selected.id] : undefined}
          isAnalyzing={selected ? analyzing.has(selected.id) : false}
          onAnalyze={() => selected && analyzeOne(selected.id)}
        />
      </main>
    </div>
  );
};

export default Index;

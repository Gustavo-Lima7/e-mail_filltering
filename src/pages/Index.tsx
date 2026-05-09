import { useMemo, useState } from "react";
import { Sparkles, Zap, Menu, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mockEmails } from "@/data/mockEmails";
import { CategorySidebar, type Filter } from "@/components/CategorySidebar";
import { EmailListItem } from "@/components/EmailListItem";
import { EmailDetail } from "@/components/EmailDetail";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import type { Classification, RiskCategory } from "@/lib/risk";

type ClassMap = Record<string, Classification>;

const Index = () => {
  const [classifications, setClassifications] = useState<ClassMap>({});
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [batchRunning, setBatchRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const selected = selectedId ? mockEmails.find((e) => e.id === selectedId) ?? null : null;

  const filterTitle = filter === "all" ? "Caixa de entrada" :
    filter === "unclassified" ? "Não analisados" :
    { safe: "Seguros", suspect: "Suspeitos", phishing: "Phishing", scam: "Golpes", spam: "Spam" }[filter];

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setSidebarOpen(false);
    setSelectedId(null);
  };

  const InboxColumn = (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col bg-card/30 nb:border-r nb:border-border">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 nb:px-5 nb:py-4">
        <div className="flex min-w-0 items-center gap-2">
          {/* Sidebar trigger (hidden when sidebar is visible at xl+) */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="xl:hidden h-9 w-9 shrink-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 border-r border-border bg-surface-overlay">
              <CategorySidebar active={filter} onChange={handleFilterChange} counts={counts} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold">{filterTitle}</h2>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {visibleEmails.length} {visibleEmails.length === 1 ? "mensagem" : "mensagens"}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={analyzeAll}
          disabled={batchRunning || counts.unclassified === 0}
          className="gap-1.5 shrink-0"
        >
          {batchRunning ? (
            <>
              <Zap className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden sm:inline">Analisando…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Analisar todos</span>
              <span className="sm:hidden">Analisar</span>
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
  );

  const DetailColumn = (
    <main className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      {/* Mobile back bar */}
      {selected && (
        <div className="flex items-center gap-2 border-b border-border bg-surface-overlay/70 px-3 py-2 nb:hidden">
          <Button size="sm" variant="ghost" className="gap-1.5 -ml-2" onClick={() => setSelectedId(null)}>
            <ArrowLeft className="h-4 w-4" /> Caixa
          </Button>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">
        <EmailDetail
          email={selected}
          classification={selected ? classifications[selected.id] : undefined}
          isAnalyzing={selected ? analyzing.has(selected.id) : false}
          onAnalyze={() => selected && analyzeOne(selected.id)}
        />
      </div>
    </main>
  );

  return (
    <div className="h-screen w-full overflow-hidden nb:grid nb:grid-cols-[minmax(300px,360px)_1fr] xl:grid-cols-[240px_minmax(300px,360px)_1fr]">
      {/* Sidebar (only visible at xl+) */}
      <div className="hidden xl:block h-full">
        <CategorySidebar active={filter} onChange={handleFilterChange} counts={counts} />
      </div>

      {/* Single-pane (mobile/tablet < 1000px) */}
      <div className="nb:hidden h-full">
        {selected ? DetailColumn : InboxColumn}
      </div>

      {/* List + Detail (≥1000px) */}
      <div className="hidden nb:flex nb:h-full nb:min-h-0 nb:min-w-0 nb:w-full">{InboxColumn}</div>
      <div className="hidden nb:flex nb:h-full nb:min-h-0 nb:min-w-0 nb:w-full">{DetailColumn}</div>
    </div>
  );
};

export default Index;

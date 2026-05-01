// Edge function: classifies an email using Lovable AI Gateway with structured tool-calling output.
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um analista sênior de segurança especializado em triagem de emails.
Sua tarefa: classificar UM email em uma das categorias e identificar sinais de risco.

CATEGORIAS:
- safe: comunicação legítima, transacional ou pessoal genuína
- suspect: tem indícios estranhos mas inconclusivos; merece atenção humana
- phishing: tenta induzir o destinatário a clicar links maliciosos, baixar anexos ou entregar credenciais/dados sensíveis se passando por marca/instituição
- scam: golpe (falsos prêmios, heranças, criptomoedas milagrosas, romance scam, falsa cobrança, sequestro de WhatsApp, falsa central bancária)
- spam: marketing não solicitado, em massa, sem intenção maliciosa direta

SINAIS DE ALERTA a procurar: domínio do remetente ≠ marca alegada, URLs encurtadas/suspeitas, urgência artificial, ameaça, erro gramatical grosseiro, pedido de dados sensíveis, anexo executável, ofertas boas demais, impersonação de autoridade.

URGÊNCIA: low | medium | high | critical (critical = ação imediata recomendada).
CONFIANÇA: 0–100 (quão certo você está da classificação).

Seja rigoroso. Em dúvida entre safe e suspect, escolha suspect.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email?.subject || !email?.from) {
      return new Response(JSON.stringify({ error: "Missing email.subject or email.from" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Analise este email:

De: ${email.from}
Assunto: ${email.subject}
Data: ${email.date ?? "n/d"}

Corpo:
${email.body ?? "(vazio)"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "classify_email",
            description: "Retorna a classificação estruturada do email.",
            parameters: {
              type: "object",
              properties: {
                category: { type: "string", enum: ["safe", "suspect", "phishing", "scam", "spam"] },
                confidence: { type: "number", description: "0 a 100" },
                urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
                summary: { type: "string", description: "Resumo curto do email em 1 frase, em português." },
                reasoning: { type: "string", description: "2–3 frases justificando a classificação, em português." },
                red_flags: {
                  type: "array",
                  description: "Lista curta de sinais de alerta encontrados (vazia se nenhum).",
                  items: { type: "string" },
                },
                recommended_action: {
                  type: "string",
                  enum: ["read", "review", "delete", "report", "block_sender"],
                },
              },
              required: ["category", "confidence", "urgency", "summary", "reasoning", "red_flags", "recommended_action"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "classify_email" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Aguarde um instante." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados no workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Modelo não retornou classificação estruturada");

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

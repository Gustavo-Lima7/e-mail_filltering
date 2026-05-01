export type MockEmail = {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  date: string;
};

export const mockEmails: MockEmail[] = [
  {
    id: "e1",
    fromName: "Banco Itaú Segurança",
    from: "seguranca@itau-verificacao-cliente.com",
    subject: "URGENTE: Sua conta será bloqueada em 24h — confirme seus dados",
    date: "Hoje, 09:14",
    body: `Prezado cliente,

Detectamos um acesso suspeito à sua conta. Para evitar o BLOQUEIO IMEDIATO, confirme seus dados clicando no link abaixo nas próximas 24 horas:

http://bit.ly/itau-confirmar-conta-2024

Você precisará informar: agência, conta, senha de 6 dígitos e código do cartão.

Atenciosamente,
Central de Segurança Itaú`,
  },
  {
    id: "e2",
    fromName: "Maria Souza",
    from: "maria.souza@empresa.com.br",
    subject: "Reagendamento da reunião de quinta",
    date: "Hoje, 08:42",
    body: `Oi! Tudo bem?

Posso empurrar nossa reunião de quinta para sexta às 10h? Tive um conflito de agenda.
Me avisa se funciona pra você.

Abraço,
Maria`,
  },
  {
    id: "e3",
    fromName: "PrêmioMega Sorteios",
    from: "ganhador@premiomega-oficial.win",
    subject: "🎉 PARABÉNS! Você foi sorteado com R$ 250.000,00",
    date: "Hoje, 07:30",
    body: `PARABÉNS!!!

Seu email foi o ESCOLHIDO entre milhões no nosso sorteio mundial. Você ganhou R$ 250.000,00!

Para liberar seu prêmio, faça um pequeno depósito de R$ 47,90 referente à taxa de transferência via Pix para a chave: 47.998.221-04

Após o pagamento, envie o comprovante para liberar imediatamente o prêmio.

Não perca essa oportunidade única!`,
  },
  {
    id: "e4",
    fromName: "GitHub",
    from: "noreply@github.com",
    subject: "[lovable-app] PR #482 merged into main",
    date: "Ontem, 22:11",
    body: `octocat merged pull request #482 into main.

"Refactor email classifier worker"
+128 −34 across 6 files.

View the merge: https://github.com/your-org/lovable-app/pull/482`,
  },
  {
    id: "e5",
    fromName: "Netflix",
    from: "info@account-netflix-update.co",
    subject: "Falha no pagamento — atualize seu cartão agora",
    date: "Ontem, 18:55",
    body: `Olá,

Não conseguimos processar a cobrança da sua assinatura. Sua conta será suspensa em 12 horas.

Atualize seu método de pagamento: https://netflix-billing.co/update?id=82711

Equipe Netflix`,
  },
  {
    id: "e6",
    fromName: "Newsletter Dev Weekly",
    from: "weekly@devweekly.com",
    subject: "🚀 As 10 libs de React que vão bombar em 2026",
    date: "Ontem, 14:02",
    body: `A edição #421 chegou!

Nesta semana: tendências de React Server Components, novidades em Vite 6, e uma entrevista com mantenedores do TanStack Query.

Leia online: https://devweekly.com/421
Cancelar inscrição: https://devweekly.com/unsubscribe`,
  },
  {
    id: "e7",
    fromName: "RH — Empresa",
    from: "rh@empresa.com.br",
    subject: "Holerite de outubro disponível",
    date: "Ontem, 10:00",
    body: `Olá,

Seu holerite referente ao mês de outubro já está disponível no portal do colaborador.

Acesse com seu login corporativo em portal.empresa.com.br

Equipe RH`,
  },
  {
    id: "e8",
    fromName: "Suporte Microsoft",
    from: "support-team@microsft-secure.com",
    subject: "Sua senha do Office 365 expira hoje",
    date: "2 dias atrás",
    body: `Sua senha do Office 365 expira em 6 horas. Para evitar perda de acesso aos seus arquivos, clique aqui e mantenha a mesma senha:

http://microsft-secure.com/keep-password?u=victim@empresa.com.br

Suporte Microsoft`,
  },
  {
    id: "e9",
    fromName: "AliExpress",
    from: "promo@aliexpress.com",
    subject: "🔥 Mega promoção: até 80% OFF — só hoje",
    date: "2 dias atrás",
    body: `Aproveite os melhores descontos do mês!

Eletrônicos, casa, moda — tudo com cupom EXTRA10.

Comprar agora: https://s.click.aliexpress.com/e/_promo
Para parar de receber: https://aliexpress.com/unsubscribe`,
  },
  {
    id: "e10",
    fromName: "Dr. James Wilson",
    from: "dr.wilson.barrister@lawyer-london.uk",
    subject: "Confidencial — herança não reclamada de US$ 8.5M",
    date: "3 dias atrás",
    body: `Caro amigo,

Sou advogado em Londres e represento o espólio de um cliente falecido com seu sobrenome. Há US$ 8.500.000 não reclamados.

Como você é o único parente vivo localizável, gostaria de transferir o valor para sua conta. Em troca, ficamos com 40%.

Envie urgentemente: nome completo, cópia do passaporte, dados bancários e número de telefone.

Estritamente confidencial.
Dr. James Wilson, Esq.`,
  },
];

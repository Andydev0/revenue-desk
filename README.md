# Revenue Desk

Painel interno de vendas para um cenário de e-commerce DTC. A aplicação consulta os carrinhos simulados da [DummyJSON](https://dummyjson.com/docs/carts), valida e normaliza a resposta no servidor e apresenta métricas comerciais em uma interface responsiva em português.

## Tecnologias

- Next.js 16 com App Router e Route Handler
- React 19 e TypeScript em modo `strict`
- Tailwind CSS 4
- Zod 4 para validação do contrato externo
- Recharts 3 para visualização
- Vitest 4, ESLint e Prettier
- Vercel como plataforma de deploy

## Arquitetura

```text
app/
  api/dashboard/route.ts   # BFF tipado, cálculo e erros sanitizados
  page.tsx                 # entrada da interface
components/
  dashboard/               # dashboard, estados, cards e gráfico
  ui/                      # componentes básicos reutilizáveis
lib/
  analytics/               # métricas puras
  dummyjson/               # cliente servidor, schemas e normalização
  tracking/                # camada tipada de dataLayer
types/                     # contratos internos do dashboard
tests/                     # testes unitários das métricas
```

Fluxo dos dados:

```text
DummyJSON → fetch no servidor → Zod → normalização → métricas puras
          → /api/dashboard → interface React → window.dataLayer
```

O navegador consulta apenas `/api/dashboard`; ele nunca acessa a DummyJSON diretamente. O cliente externo tem timeout de 5 segundos e revalidação de 5 minutos. A resposta do Route Handler usa `private, no-store` para permitir atualização do horário e dos estados sem manter uma cópia no navegador. Erros externos são convertidos em mensagens seguras e a resposta completa do provedor não é registrada em logs.

## Execução local

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. Nenhum arquivo `.env` é necessário.

## Qualidade e testes

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Os testes unitários cobrem soma de receita bruta e líquida, ticket médio, percentual de desconto, quantidade de itens, agregação e ordenação de produtos, lista vazia e valores ausentes, negativos ou não finitos.

## Métricas

- Receita bruta: soma do total dos pedidos antes de descontos.
- Receita após descontos: soma do total líquido dos pedidos.
- Descontos concedidos: diferença não negativa entre receita bruta e líquida.
- Percentual de desconto: descontos divididos pela receita bruta.
- Ticket médio: receita líquida dividida pela quantidade de pedidos.
- Pedidos analisados: quantidade de carrinhos retornados.
- Itens vendidos: soma das quantidades dos carrinhos.
- Produtos com maior receita: cinco produtos agregados por ID e ordenados pela receita líquida.

Todos os valores monetários estão em dólares americanos. Os dados são simulados e não representam vendas reais.

## Rastreamento

A camada em `lib/tracking/events.ts` inicializa `window.dataLayer` somente no navegador. Ela não configura Google Tag Manager, não contém identificadores de contêiner e não envia dados pessoais.

| Evento                      | Disparo                                                    | Propriedades                                                      |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `dashboard_loaded`          | Após cada carregamento bem-sucedido                        | `load_type`, `order_count`, `item_count`, `net_revenue`, `source` |
| `dashboard_refresh_clicked` | Clique em “Atualizar dados”                                | `last_updated_at`                                                 |
| `dashboard_load_failed`     | Falha inicial, de atualização ou nova tentativa            | `load_type`, `error_code`                                         |
| `top_product_viewed`        | Primeira vez que o painel do ranking entra na área visível | `product_id`, `position`, `product_revenue`                       |

Para conectar ao Google Tag Manager:

1. Crie um contêiner real na conta da empresa e instale o snippet oficial no layout.
2. No GTM, crie acionadores de “Evento personalizado” com os nomes da tabela.
3. Crie variáveis da camada de dados para apenas as propriedades necessárias.
4. Associe os acionadores às tags de analytics e publique o contêiner após validação.

Para validar sem GTM, abra o console do navegador e inspecione `window.dataLayer`. Com GTM instalado, use o modo Preview/Tag Assistant e confirme nome, momento e propriedades de cada evento.

Duplicações são evitadas por chaves em memória: `dashboard_loaded` usa `updatedAt`, `top_product_viewed` usa o ID do líder, requisições anteriores são canceladas com `AbortController` e o botão fica desabilitado durante a atualização. Falhas permanecem por tentativa, permitindo medir novas tentativas reais.

## Decisões e limitações

- O Route Handler atua como um BFF pequeno: protege o contrato da interface, centraliza timeout, cache, validação e mensagens de erro.
- Ticket médio e ranking usam receita líquida, pois representam o valor realizado após descontos.
- `limit=0` solicita todos os carrinhos disponíveis, em vez de analisar apenas a primeira página padrão.
- Não há autenticação, filtros ou persistência; o foco é o fluxo somente leitura pedido no desafio.
- PostgreSQL ou Supabase não são necessários neste escopo: a única fonte é uma API pública simulada e somente leitura, sem dados próprios para gravar. Adicionar um banco agora criaria operação e complexidade sem benefício funcional.
- A disponibilidade e o conteúdo dependem da DummyJSON. O cache curto reduz chamadas, mas não substitui observabilidade de uma integração real.

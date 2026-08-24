import { RevenueOverview } from '@/components/dashboard/revenue-overview'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { DashboardMetrics } from '@/types/dashboard'

interface MetricsGridProps {
  metrics: DashboardMetrics
}

const secondaryMetrics = (
  metrics: DashboardMetrics,
): Array<{ detail: string; label: string; value: string }> => [
  {
    detail: 'Receita líquida por carrinho',
    label: 'Ticket médio',
    value: formatCurrency(metrics.averageOrderValue),
  },
  {
    detail: 'Carrinhos simulados',
    label: 'Pedidos analisados',
    value: formatNumber(metrics.orderCount),
  },
  {
    detail: 'Unidades no snapshot',
    label: 'Itens vendidos',
    value: formatNumber(metrics.itemCount),
  },
]

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section aria-labelledby="metrics-title">
      <div className="mb-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--cobalt)]">
            Vendas / Snapshot atual
          </p>
          <h1
            className="mt-2 max-w-3xl font-display text-[clamp(2.3rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--ink)]"
            id="metrics-title"
          >
            Receita em perspectiva.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--slate)] sm:text-base">
            Uma leitura direta do valor gerado, dos descontos concedidos e da
            concentração do mix de produtos.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--slate)] lg:pb-1">
          <span className="size-1.5 rounded-full bg-[var(--coral)]" />
          <span>{formatNumber(metrics.orderCount)} carrinhos simulados</span>
        </div>
      </div>

      <RevenueOverview metrics={metrics} />

      <div className="mt-4 grid overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] sm:grid-cols-3">
        {secondaryMetrics(metrics).map((metric) => (
          <article
            className="border-b border-[var(--line)] px-5 py-5 last:border-b-0 sm:border-r sm:border-b-0 sm:px-6 sm:py-6 sm:last:border-r-0"
            key={metric.label}
          >
            <p className="text-xs font-medium text-[var(--slate)]">
              {metric.label}
            </p>
            <p className="mt-2 font-mono text-2xl font-medium tracking-[-0.05em] text-[var(--ink)] sm:text-[1.7rem]">
              {metric.value}
            </p>
            <p className="mt-1.5 text-[11px] text-[var(--slate)]/80">
              {metric.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

import { formatCurrency, formatPercentage } from '@/lib/formatters'
import type { DashboardMetrics } from '@/types/dashboard'

interface RevenueOverviewProps {
  metrics: DashboardMetrics
}

export function RevenueOverview({ metrics }: RevenueOverviewProps) {
  const realizedPercentage =
    metrics.grossRevenue > 0
      ? Math.min(100, (metrics.netRevenue / metrics.grossRevenue) * 100)
      : 0
  const discountPercentage = Math.max(0, 100 - realizedPercentage)

  return (
    <section
      aria-labelledby="revenue-overview-title"
      className="overflow-hidden rounded-[1.75rem] bg-[var(--ink)] text-white shadow-[0_24px_60px_rgba(23,37,38,0.14)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            Ponte de receita
          </p>
          <h2
            className="mt-1 font-display text-xl font-semibold tracking-[-0.03em]"
            id="revenue-overview-title"
          >
            Do valor bruto ao realizado
          </h2>
        </div>
        <p className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
          Dados simulados · USD
        </p>
      </div>

      <div className="grid gap-7 px-5 py-7 sm:px-7 lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:gap-10 lg:py-9">
        <div>
          <p className="text-xs font-medium text-white/50">Receita bruta</p>
          <p className="mt-2 font-mono text-[clamp(1.7rem,4vw,2.7rem)] font-medium tracking-[-0.06em]">
            {formatCurrency(metrics.grossRevenue)}
          </p>
          <p className="mt-2 text-xs text-white/40">Antes dos descontos</p>
        </div>

        <div className="flex items-center gap-3 lg:flex-col lg:gap-2 lg:pb-1">
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-white/15 lg:h-8 lg:w-px"
          />
          <div className="shrink-0 rounded-2xl bg-[var(--coral)] px-4 py-3 text-center text-white">
            <p className="font-mono text-sm font-semibold">
              − {formatCurrency(metrics.discountAmount)}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/75">
              {formatPercentage(metrics.discountPercentage)} concedidos
            </p>
          </div>
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-white/15 lg:h-8 lg:w-px"
          />
        </div>

        <div className="lg:text-right">
          <p className="text-xs font-medium text-[var(--cobalt-pale)]">
            Receita líquida
          </p>
          <p className="mt-2 font-mono text-[clamp(1.7rem,4vw,2.7rem)] font-medium tracking-[-0.06em] text-white">
            {formatCurrency(metrics.netRevenue)}
          </p>
          <p className="mt-2 text-xs text-white/40">Valor realizado</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 sm:px-7">
        <div
          aria-label={`${formatPercentage(realizedPercentage)} da receita bruta foi realizada`}
          className="flex h-2 overflow-hidden rounded-full bg-white/10"
          role="img"
        >
          <span
            className="bg-[var(--cobalt)]"
            style={{ width: `${realizedPercentage}%` }}
          />
          <span
            className="bg-[var(--coral)]"
            style={{ width: `${discountPercentage}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-white/45">
          <span>{formatPercentage(realizedPercentage)} realizados</span>
          <span>
            {formatPercentage(metrics.discountPercentage)} em descontos
          </span>
        </div>
      </div>
    </section>
  )
}

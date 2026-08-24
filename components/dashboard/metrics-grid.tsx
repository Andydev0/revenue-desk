import { MetricCard } from '@/components/dashboard/metric-card'
import {
  DiscountIcon,
  ItemsIcon,
  OrderIcon,
  RevenueIcon,
} from '@/components/ui/icons'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@/lib/formatters'
import type { DashboardMetrics } from '@/types/dashboard'

interface MetricsGridProps {
  metrics: DashboardMetrics
}

const iconClassName = 'size-[18px]'

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section aria-labelledby="metrics-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--teal)]">
            Indicadores-chave
          </p>
          <h2
            className="mt-1 text-xl font-bold tracking-tight text-[var(--navy)]"
            id="metrics-title"
          >
            Resumo comercial
          </h2>
        </div>
        <p className="rounded-full border border-[#e3ca9d] bg-[#fff8e9] px-3 py-1.5 text-xs font-medium text-[#79581d]">
          Dados simulados · Valores em USD
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:[&>article:first-child]:col-span-2">
        <MetricCard
          detail="Valor realizado após todos os descontos"
          icon={<RevenueIcon className={iconClassName} />}
          label="Receita após descontos"
          tone="featured"
          value={formatCurrency(metrics.netRevenue)}
        />
        <MetricCard
          detail="Soma dos pedidos antes dos descontos"
          icon={<RevenueIcon className={iconClassName} />}
          label="Receita bruta"
          value={formatCurrency(metrics.grossRevenue)}
        />
        <MetricCard
          detail={`${formatPercentage(metrics.discountPercentage)} da receita bruta`}
          icon={<DiscountIcon className={iconClassName} />}
          label="Descontos concedidos"
          tone="warning"
          value={formatCurrency(metrics.discountAmount)}
        />
        <MetricCard
          detail="Receita líquida média por pedido"
          icon={<RevenueIcon className={iconClassName} />}
          label="Ticket médio"
          value={formatCurrency(metrics.averageOrderValue)}
        />
        <MetricCard
          detail="Carrinhos incluídos na análise"
          icon={<OrderIcon className={iconClassName} />}
          label="Pedidos analisados"
          value={formatNumber(metrics.orderCount)}
        />
        <MetricCard
          detail="Soma das quantidades de cada produto"
          icon={<ItemsIcon className={iconClassName} />}
          label="Itens vendidos"
          value={formatNumber(metrics.itemCount)}
        />
        <MetricCard
          detail="Participação dos descontos no valor bruto"
          icon={<DiscountIcon className={iconClassName} />}
          label="Percentual de desconto"
          value={formatPercentage(metrics.discountPercentage)}
        />
      </div>
    </section>
  )
}
